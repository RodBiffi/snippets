import { useCallback, useMemo, useReducer } from 'react';
import _set from 'lodash/set';
import { Schema, SchemaField, SchemaKey } from '../types';

export interface IEventSchemaState {
  initialSchemas: Map<SchemaKey, Schema>;
  schema?: Schema;
  selection: Map<string, Set<SchemaField>>;
}

const initialEventSchemaState: IEventSchemaState = {
  initialSchemas: new Map(),
  selection: new Map(),
};

enum ActionType {
  CLEAR_ALL_SELECTIONS = 'CLEAR_ALL_SELECTIONS',
  CLEAR_SELECTED_SCHEMA = 'CLEAR_SELECTED_SCHEMA',
  SET_INITIAL_SCHEMAS = 'SET_INITIAL_SCHEMAS',
  SET_SCHEMA = 'SET_SCHEMA',
  SET_FIELD_PROPERTY = 'SET_FIELD_PROPERTY',
  SET_SELECTION = 'SET_SELECTION',
}

export enum OperationsMode {
  ADD,
  REPLACE,
  REMOVE,
}

type ClearAllSelectionsAction = {
  type: ActionType.CLEAR_ALL_SELECTIONS;
};

type ClearSelectedSchema = {
  type: ActionType.CLEAR_SELECTED_SCHEMA;
};

type SetInitialSchemasAction = {
  type: ActionType.SET_INITIAL_SCHEMAS;
  payload: {
    schemas: Map<string, Schema>;
  };
};

type SetSchemaAction = {
  type: ActionType.SET_SCHEMA;
  payload: {
    schema: Schema;
  };
};

type SetFieldPropertyAction = {
  type: ActionType.SET_FIELD_PROPERTY;
  payload: {
    fieldPaths: string[][];
    fieldValue: unknown;
  };
};

type SetSelectionAction = {
  type: ActionType.SET_SELECTION;
  payload: {
    path: SchemaField[];
    selected: SchemaField;
    mode?: OperationsMode;
  };
};

type EventSchemaAction =
  | ClearAllSelectionsAction
  | ClearSelectedSchema
  | SetInitialSchemasAction
  | SetSchemaAction
  | SetFieldPropertyAction
  | SetSelectionAction;

/**
 * assertNever
 * Typescript narrows all possible types of <EventSchemaAction> with the reducer switch,
 * leaving the action falling in "default" to have "no type", hence the <never> type assigned
 * to it.
 * @param action The action that didn't fit any switch case.
 */
const assertNever = (action: never): void => {
  console.warn(
    'Attempt to execute EventSchemaReducer with unknown action. Action was ignored: ',
    action,
  );
};

export const SCHEMA_ROOT_KEY = '_root';
export const SCHEMA_SELECTION_KEY_SEPARATOR = '|';
export const getSelectionKey = (selection: SchemaField[]) =>
  selection.reduce(
    (key, field) => `${key}${SCHEMA_SELECTION_KEY_SEPARATOR}${field.id}`,
    SCHEMA_ROOT_KEY,
  );

export const purgeDownstreamSelections = (
  selection: IEventSchemaState['selection'],
  selectionKey: string,
): IEventSchemaState['selection'] => {
  const selectionOutput = new Map(selection);
  for (const key of selection.keys()) {
    if (key.startsWith(selectionKey)) {
      selectionOutput.delete(key);
    }
  }
  return selectionOutput;
};

export const eventSchemaReducer = (
  state: IEventSchemaState,
  action: EventSchemaAction,
): IEventSchemaState => {
  switch (action.type) {
    case ActionType.CLEAR_ALL_SELECTIONS: {
      return {
        ...state,
        selection: new Map(),
      };
    }
    case ActionType.CLEAR_SELECTED_SCHEMA: {
      return {
        ...state,
        selection: new Map(),
        schema: undefined,
      };
    }
    case ActionType.SET_INITIAL_SCHEMAS: {
      const {
        payload: { schemas },
      } = action;
      return {
        ...state,
        initialSchemas: schemas,
      };
    }
    case ActionType.SET_SCHEMA: {
      const {
        payload: { schema },
      } = action;
      if (schema.id !== state.schema?.id) {
        return {
          ...state,
          schema,
        };
      }
      return state;
    }
    case ActionType.SET_FIELD_PROPERTY: {
      const newState = { ...state };
      const {
        payload: { fieldPaths, fieldValue },
      } = action;

      fieldPaths.forEach((fieldPath) => {
        const path = ['schema'].concat(fieldPath);
        _set(newState, path, fieldValue);
      });
      return newState;
    }
    case ActionType.SET_SELECTION: {
      const { selection } = state;
      const {
        payload: { path, selected, mode },
      } = action;
      const selectionKey = getSelectionKey(path);
      let setToUpdate;
      if (mode === OperationsMode.ADD) {
        const selectedProperties = selection.get(selectionKey);
        setToUpdate = new Set(selectedProperties);
        setToUpdate.add(selected);
        return {
          ...state,
          selection: new Map(selection.set(selectionKey, setToUpdate)),
        };
      }
      if (mode === OperationsMode.REPLACE) {
        const selectionToUpdate = purgeDownstreamSelections(
          state.selection,
          `${selectionKey}${SCHEMA_SELECTION_KEY_SEPARATOR}${selected.id}`,
        );
        setToUpdate = new Set([selected]);
        return {
          ...state,
          selection: selectionToUpdate.set(selectionKey, setToUpdate),
        };
      }
      if (mode === OperationsMode.REMOVE) {
        const selectedProperties = state.selection.get(selectionKey);
        setToUpdate = new Set(selectedProperties);
        setToUpdate.delete(selected); // Set.delete mutates the Set.
        const selectionToUpdate = purgeDownstreamSelections(
          state.selection,
          `${selectionKey}${SCHEMA_SELECTION_KEY_SEPARATOR}${selected.id}`,
        );
        return {
          ...state,
          selection: selectionToUpdate.set(selectionKey, setToUpdate),
        };
      }
      return state;
    }

    default: {
      assertNever(action);
      return state;
    }
  }
};

const useEventSchemaReducer = () => {
  const [state, dispatch] = useReducer(
    eventSchemaReducer,
    initialEventSchemaState,
  );

  const clearAllSelections = useCallback(() => {
    dispatch({ type: ActionType.CLEAR_ALL_SELECTIONS });
  }, []);

  const clearSelectedSchema = useCallback(() => {
    dispatch({ type: ActionType.CLEAR_SELECTED_SCHEMA });
  }, []);

  const setInitialSchemas = useCallback((schemas: Map<SchemaKey, Schema>) => {
    dispatch({ type: ActionType.SET_INITIAL_SCHEMAS, payload: { schemas } });
  }, []);

  const setSchema = useCallback((schema: Schema) => {
    dispatch({ type: ActionType.SET_SCHEMA, payload: { schema } });
  }, []);

  const setFieldProperty = useCallback((paths: string[][], value: unknown) => {
    dispatch({
      type: ActionType.SET_FIELD_PROPERTY,
      payload: { fieldPaths: paths, fieldValue: value },
    });
  }, []);

  const setSelection = useCallback(
    (
      path: SchemaField[],
      selected: SchemaField,
      mode: OperationsMode = OperationsMode.ADD,
    ) => {
      dispatch({
        type: ActionType.SET_SELECTION,
        payload: { path, selected, mode },
      });
    },
    [],
  );

  return useMemo(
    () => ({
      state,
      clearAllSelections,
      clearSelectedSchema,
      setInitialSchemas,
      setFieldProperty,
      setSelection,
      setSchema,
    }),
    [state],
  );
};

export default useEventSchemaReducer;
