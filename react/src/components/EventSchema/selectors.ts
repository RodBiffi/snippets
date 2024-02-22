import { SchemaField, schemaFieldsCategoriesItems } from './types';
import { IEventSchemaState } from './hooks/useEventSchemaReducer';
import _set from 'lodash/set';
import { InputTreeListProps } from './components/InputTreeList';

export const findFieldByName = (
  propertyName: string,
  fields?: SchemaField[],
): SchemaField | undefined =>
  fields?.find((field) => field.name === propertyName);

/**
 * getFieldType
 * Determines the field display strategy
 * @param  {SchemaField} field
 * @param field.type
 * @param field.properties
 * @param field.typeList
 */
export const getFieldType = ({
  type,
  isOneOfProperty,
  properties,
  typeList,
}: SchemaField): InputTreeListProps<SchemaField>['type'] => {
  const isEnum = type === 'enum';
  if (!properties && !typeList && !isEnum) return 'single';
  return isOneOfProperty || isEnum ? 'radio' : 'checkbox';
};

/**
 * getIsTypeList
 * The use case is to differentiate between value pick or property selection
 * @param  {SchemaField} field
 * @param properties
 * @param typeList
 */
export const getIsTypeList = ({ properties, typeList }: SchemaField): boolean =>
  !!typeList?.length && !properties?.length;

/**
 * resolveEventPropertyValue
 * Converts a field into its representation in the previewed EventJSON
 * @param field The field to resolve
 * @see https://lodash.com/docs/#set
 */
export const resolveEventPropertyValue = (field: SchemaField) => {
  switch (field.type) {
    case 'string': {
      if (field.pattern) {
        return field.pattern;
      }
      return 'string';
    }
    case 'number': {
      return 0;
    }
    case 'object': {
      return {};
    }
    case 'array': {
      // letting lodash create the array on the fly when passing a path
      // like "event.object.additionalIds[0].component". Initializing an
      // attribute with "[]" pollutes the result with another in-between
      // array.
      return undefined;
    }
    case 'enum': {
      return {};
    }
    default: {
      if (Array.isArray(field.typeList) && field.typeList.length === 1) {
        return field.typeList[0].name;
      }
      if (field.properties) {
        return {};
      }
      return 'string';
    }
  }
};

/**
 * mapSelectionToEvent
 * Traverse the selection map, resolving each selection entry set with proper
 * JSON values for the fields
 * @param key The key pointing to a selection set of fields in the selection map.
 * @param event The event being generated
 * @param eventPath The current JSON string path leading to the field being resolved.
 * Ex. ['actor', 'spt:userId'].
 * @param selection the entire selection map
 * @param parentField Convenience attribute, as it is common to resolve the current
 * field as the value of its parent.
 */
export const mapSelectionToEvent = (
  key: string,
  event: Record<string, unknown>,
  eventPath: string[],
  selection: IEventSchemaState['selection'],
  parentField?: SchemaField,
) => {
  let output = { ...event };
  const selectionEntry = selection.get(key);

  if (selectionEntry) {
    selectionEntry.forEach((field) => {
      const isTypeEnumSelection =
        parentField?.typeList || parentField?.type === 'enum';
      const fieldPath =
        field.type === 'array' ? `${field.name}[0]` : field.name;
      const currentPath = [...eventPath, fieldPath];
      const currentKey = `${key}|${field.id}`;
      const fieldValue = isTypeEnumSelection
        ? field.name
        : resolveEventPropertyValue(field);
      if (isTypeEnumSelection) {
        currentPath.pop();
      }
      _set(output, currentPath.join('.'), fieldValue);
      if (!isTypeEnumSelection) {
        output = mapSelectionToEvent(
          currentKey,
          output,
          currentPath,
          selection,
          field,
        );
      }
    });
  }
  return output;
};

export const sortByStringProperty =
  (propertyName: string, sortingArr?: string[]) => (a: any, b: any) => {
    if (
      typeof a[propertyName] === 'string' &&
      typeof b[propertyName] === 'string'
    ) {
      if (Array.isArray(sortingArr)) {
        return (
          sortingArr.indexOf(a[propertyName]) -
          sortingArr.indexOf(b[propertyName])
        );
      }
      return a[propertyName].localeCompare(b[propertyName]);
    }
    return -1;
  };

export const filterCategoryMainFields = (fields: SchemaField[]) => {
  return fields
    .filter((field) => schemaFieldsCategoriesItems.MAIN.includes(field.name))
    .sort(sortByStringProperty('name', schemaFieldsCategoriesItems.MAIN));
};

export const filterCategoryAdditionalFields = (fields: SchemaField[]) => {
  const categoryItems = schemaFieldsCategoriesItems.MAIN.concat(
    schemaFieldsCategoriesItems.TECHNICAL,
  );
  return fields
    .filter((field) => !categoryItems.includes(field.name))
    .sort(sortByStringProperty('name'));
};

export const filterCategoryTechnicalFields = (fields: SchemaField[]) => {
  return fields
    .filter((field) =>
      schemaFieldsCategoriesItems.TECHNICAL.includes(field.name),
    )
    .sort(sortByStringProperty('name', schemaFieldsCategoriesItems.TECHNICAL));
};
