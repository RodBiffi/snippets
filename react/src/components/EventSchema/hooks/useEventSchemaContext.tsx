import { createContext, useCallback, useEffect, useMemo } from 'react';
import { useLocation, useMatch, useNavigate } from 'react-router-dom';
import objectScan from 'object-scan';
import _get from 'lodash/get';
import _set from 'lodash/set';
import { flattenFieldRef } from '../api';
import useEventSchemaApi from './useEventSchemaApi';
import { Schema, SchemaField, SchemaKey, schemaKeys, Type } from '../types';
import useEventSchemaReducer, {
  getSelectionKey,
  OperationsMode,
  SCHEMA_ROOT_KEY,
} from './useEventSchemaReducer';
import {
  findFieldByName,
  mapSelectionToEvent,
  sortByStringProperty,
} from '../selectors';

export interface IEventSchemaContext {
  initialSchemas: Map<SchemaKey, Schema>;
  schema?: Schema;
  event: Record<string, any>;
  clearAllSelections: () => void;
  deselectFieldProperties: (path: SchemaField[], selected: SchemaField) => void;
  deselectRootField: (field: SchemaField) => void;
  getSelectionCount: (path: SchemaField[]) => number;
  isSelected: (path: SchemaField[], property: SchemaField) => boolean;
  selectFieldProperties: (path: SchemaField[], selected: SchemaField) => void;
  selectFieldValues: (path: SchemaField[], type: Type) => void;
  selectSchema: (schemaKey: string) => void;
  selectSchemaType: (schemaKey: string, type: string) => void;
  selectSchemaVersion: (schemaVersion: string | number) => void;
  selectRootField: (field: SchemaField) => void;
  setFieldPropertyAsync: (
    field: SchemaField,
    property: SchemaField,
  ) => Promise<void>;
}

export const initialState: IEventSchemaContext = {
  event: {},
  initialSchemas: new Map(),
  clearAllSelections: () => undefined,
  deselectFieldProperties: () => undefined,
  deselectRootField: () => undefined,
  getSelectionCount: () => 0,
  isSelected: () => false,
  selectFieldProperties: () => undefined,
  selectFieldValues: () => undefined,
  selectSchema: () => undefined,
  selectSchemaType: () => undefined,
  selectSchemaVersion: () => undefined,
  selectRootField: () => undefined,
  setFieldPropertyAsync: () => Promise.resolve(),
};

export const EventSchemaContext =
  createContext<IEventSchemaContext>(initialState);

const useEventSchemaContext = (): IEventSchemaContext => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const selectionMatch = useMatch('/tracking/start/schema-browser/');
  const schemaMatch = useMatch('/tracking/start/schema-browser/fields/');
  const { schemas, getPropertiesAsync, getSchemaAsync } = useEventSchemaApi();
  const {
    state,
    clearAllSelections,
    clearSelectedSchema,
    setInitialSchemas,
    setSchema,
    setFieldProperty,
    setSelection,
  } = useEventSchemaReducer();

  /**
   * selectSchema
   * Navigates locally to the Fields page, passing the schema selection state as query params
   * @async
   * @params schemaKey A key locator for the Schemas map
   * @see SchemaKey
   */
  const selectSchema = useCallback(
    async (schemaKey: SchemaKey) => {
      const schema = schemas.get(schemaKey);
      const queryParams = new URLSearchParams(search);
      queryParams.set('schema', schemaKey);
      queryParams.set('version', schema?.version ?? '');
      queryParams.delete('type');
      navigate(`fields?${queryParams.toString()}}`);
    },
    [clearAllSelections, navigate, schemas, search],
  );

  /**
   * selectSchema
   * Navigates locally to the Fields page, passing the schema and @type selection state as query params
   * @async
   * @params schemaKey A key locator for the Schemas map
   * @param type the @type to be set for the selected schema
   * @see SchemaKey
   */
  const selectSchemaType = useCallback(
    async (schemaKey: SchemaKey, type: string) => {
      const schema = schemas.get(schemaKey);
      const queryParams = new URLSearchParams(search);
      queryParams.set('schema', schemaKey);
      queryParams.set('version', schema?.version ?? '');
      queryParams.set('type', type ?? '');
      navigate(`fields?${queryParams.toString()}`);
    },
    [clearAllSelections, navigate, schemas, search],
  );

  const selectSchemaVersion = useCallback<
    IEventSchemaContext['selectSchemaVersion']
  >(
    async (version) => {
      const queryParams = new URLSearchParams(search);
      queryParams.set('version', version.toString());
      navigate(`fields?${queryParams.toString()}`);
    },
    [navigate, search],
  );

  /**
   * setFieldPropertyAsync
   * @async
   * @param field The parent field owning the property to fetch
   * @param property The property holding a $ref that needs to be asynchronously resolved.
   * "event-formats". A "reference" is the pointer to the actual implementation of the field.
   * @example
   * Schema Field not hydrated:
   * {
   *     "id": "/common-definitions.json/214.json#/definitions/content/anyOf/Article",
   *     "name": "Article",
   *     "reference": "/objects/Article.json/56.json#",
   * }
   * Calling setFieldPropertyAsync('/objects/Article.json/56.json#', 'reference') hydrates the schema with the
   * fetched resource
   */
  const setFieldPropertyAsync: IEventSchemaContext['setFieldPropertyAsync'] =
    useCallback(
      async (field, property) => {
        if (state.schema && property.reference) {
          const pathsToIdentifier: string[][] = objectScan(
            [`properties.++.reference`],
            {
              filterFn: ({ value }: Record<string, any>) =>
                value === property.reference,
            },
          )(state.schema);
          /**
           * as we want to append "properties" to the object holding that identifier, we go on level up, and down
           * to "properties".
           * @example
           *  from:   schema.properties.object.properties.Article.reference (as an Array of props)
           *  to:     schema.properties.object.properties.Article.properties (as an Array of props)
           */
          const pathsToAppendProperties = pathsToIdentifier.map((path) => [
            ...path.slice(0, -1),
            'properties',
          ]);

          /**
           * Let's only invoke the api call when one of the paths do not hold properties, which we "flag" as "not
           * loaded yet".
           */
          if (
            pathsToAppendProperties.some((path) => !_get(state.schema, path))
          ) {
            const properties = await getPropertiesAsync(property.reference);
            setFieldProperty(pathsToAppendProperties, properties);
          }
        }
      },
      [getPropertiesAsync, setFieldProperty, state.schema],
    );

  /**
   * isSelected
   * Returns if a property within a given path is selected
   * @param path The SchemaFields leading to that property
   * @param property The property to check selection
   */
  const isSelected = useCallback<IEventSchemaContext['isSelected']>(
    (path, property) =>
      state.selection.get(getSelectionKey(path))?.has(property) ?? false,
    [state.selection],
  );

  /**
   * getSelectionCount
   * For a given path, retrieve the selection set and return the size of it.
   * @param path The SchemaFields leading to selected fields to count
   */
  const getSelectionCount = useCallback<
    IEventSchemaContext['getSelectionCount']
  >(
    (path: SchemaField[]) =>
      state.selection.get(getSelectionKey(path))?.size ?? 0,
    [state.selection],
  );

  /**
   * selectFieldProperties
   * Register a property selection, while selecting all the fields in the path
   * that lead to that property.
   * The use case is: The user steps deep into a field's properties without any
   * selection. On the last level, they select a property. They expect all path
   * to be selected as well.
   * @param path the path of fields leading to the property
   * @param property the property that triggered the selection
   */
  const selectFieldProperties = useCallback<
    IEventSchemaContext['selectFieldProperties']
  >(
    (path, property) => {
      path.concat(property).forEach((field, ix, arr) => {
        const upPath = arr.slice(0, ix);
        const parent = [...upPath].pop();
        if (!isSelected(upPath, field)) {
          setSelection(
            upPath,
            field,
            parent?.isOneOfProperty
              ? OperationsMode.REPLACE
              : OperationsMode.ADD,
          );
        }
      });
    },
    [isSelected, setSelection],
  );

  /**
   * deselectFieldProperties
   * Unregister a property selection.
   * @param path the path of fields leading to the property
   * @param property the property that triggered the deselection
   */
  const deselectFieldProperties = useCallback<
    IEventSchemaContext['deselectFieldProperties']
  >(
    (path, property) => {
      setSelection(path, property, OperationsMode.REMOVE);
    },
    [setSelection],
  );

  /**
   * selectFieldValues
   * Register a Type value to a path.
   * Works in conjunction with fields having a "typeList" property.
   * @param path the path of fields leading to the property
   * @param type the object holding the value. It is a subset of SchemaField
   */
  const selectFieldValues = useCallback<
    IEventSchemaContext['selectFieldValues']
  >(
    (path, type) => {
      setSelection(path, type, OperationsMode.REPLACE);
    },
    [setSelection],
  );

  /**
   * selectRootField
   * Convenience method for selecting root-belonging fields
   * @param field The field that triggered the selection
   */
  const selectRootField = useCallback<IEventSchemaContext['selectRootField']>(
    (field) => {
      setSelection([], field, OperationsMode.ADD);
    },
    [setSelection],
  );

  /**
   * deselectRootField
   * Convenience method for deselecting root-belonging fields
   * @param field The field that triggered the deselection
   */
  const deselectRootField = useCallback<
    IEventSchemaContext['deselectRootField']
  >(
    (field) => {
      setSelection([], field, OperationsMode.REMOVE);
    },
    [setSelection],
  );

  /**
   * event
   * A parsed JSON object derived from the fields selections the user applies on the
   * UI.
   * @see IEventSchemaState
   */
  const event: Record<string, unknown> = useMemo(() => {
    const event = mapSelectionToEvent(SCHEMA_ROOT_KEY, {}, [], state.selection);
    _set(event, 'schema', `http://schema.site.com${state.schema?.id}`);
    return event;
  }, [state.selection, state.schema]);

  /**
   * Initialization of Schemas based on the navigation search params, and booting
   * any pre-selection needed based on those values: Ex.: schema.
   */
  useEffect(() => {
    (async () => {
      if (selectionMatch) {
        setInitialSchemas(schemas);
        clearSelectedSchema();
      }
      if (schemaMatch) {
        const queryParams = new URLSearchParams(search);
        const schemaKeyParam = queryParams.get('schema') ?? '';
        const typeParam = queryParams.get('type') ?? '';
        const schemaVersionParam = queryParams.get('version') ?? '';
        const latestSchema = schemas.get(schemaKeyParam);
        let versionedSchema;
        if (latestSchema) {
          /*
           * The latest schemas are fetched initially to load the schema selection step.
           * If the user decides to load a previous version, we must fetch it directly and
           * make it the selected schema.
           */
          if (latestSchema.version !== schemaVersionParam) {
            versionedSchema = await getSchemaAsync(
              schemaKeyParam,
              schemaVersionParam,
            );
            console.assert(
              versionedSchema,
              'No schema found with provided params. Loading latest instead.',
            );
          }
          const selectedSchema = versionedSchema ?? latestSchema;
          const properties = await getPropertiesAsync(selectedSchema.id);
          selectedSchema.properties = properties
            ?.sort(sortByStringProperty('name'))
            .map(flattenFieldRef);
          setSchema(selectedSchema);
          const schemaField = findFieldByName(
            'schema',
            selectedSchema.properties,
          );
          if (schemaField) {
            selectRootField(schemaField);
          }
          const typeField = findFieldByName('@type', selectedSchema.properties);
          if (typeField) {
            let typeValue;
            if (typeField.typeList?.length === 1) {
              typeValue = typeField.typeList?.at(0);
            } else {
              typeValue = typeField.typeList?.find(
                ({ name }) => name === typeParam,
              );
            }
            if (typeValue) {
              selectRootField(typeField);
              selectFieldValues([typeField], typeValue);
            }
          }
          if ((selectedSchema.key = schemaKeys.ENGAGEMENT)) {
            const actionField = findFieldByName(
              'action',
              selectedSchema.properties,
            );
            if (actionField) {
              const typeValue = actionField.typeList?.find(
                ({ name }) => name === typeParam,
              );
              if (typeValue) {
                selectRootField(actionField);
                selectFieldValues([actionField], typeValue);
              }
            }
          }
        }
      }
    })();
  }, [
    getPropertiesAsync,
    getSchemaAsync,
    schemas,
    search,
    selectFieldValues,
    selectRootField,
    setInitialSchemas,
    setSchema,
  ]);
  return useMemo(
    () => ({
      ...state,
      event,
      clearAllSelections,
      deselectFieldProperties,
      deselectRootField,
      getSelectionCount,
      isSelected,
      selectSchema,
      selectSchemaType,
      selectSchemaVersion,
      selectFieldProperties,
      selectFieldValues,
      selectRootField,
      setFieldPropertyAsync,
    }),
    [state],
  );
};

export const Provider = EventSchemaContext.Provider;

export default useEventSchemaContext;
