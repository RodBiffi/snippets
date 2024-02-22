import { useMemo } from 'react';
import useSWR from 'swr';
import { BASE_URL, fetchProperties, fetchSchema, fetchSchemas } from '../api';
import {
  highlightedTypes,
  Schema,
  SchemaField,
  SchemaKey,
  schemaKeys,
} from '../types';

const getSchemaAsync = async (schemaKey: SchemaKey, version: string) => {
  try {
    return await fetchSchema(schemaKey, version);
  } catch (err) {
    console.error(err);
  }
  return;
};

const getPropertiesAsync = async (URI: string) => {
  try {
    return await fetchProperties(URI);
  } catch (err) {
    console.error(err);
  }
  return;
};

const useEventSchemaApi = (): {
  schemas: Map<SchemaKey, Schema>;
  getPropertiesAsync: (URI: string) => Promise<SchemaField[] | undefined>;
  getSchemaAsync: (
    key: SchemaKey,
    version: string,
  ) => Promise<Schema | undefined>;
} => {
  const { data } = useSWR(BASE_URL, fetchSchemas);
  const schemas = useMemo(() => {
    if (!data) {
      return new Map<SchemaKey, Schema>();
    }
    const engagementEventSchema = data.schemas.find(
      (schema: Schema) => schema.key == schemaKeys.ENGAGEMENT,
    );
    const trackerEventSchema = data.schemas.find(
      (schema: Schema) => schema.key == schemaKeys.TRACKER,
    );
    if (!engagementEventSchema || !trackerEventSchema) {
      return new Map<SchemaKey, Schema>();
    }

    return new Map([
      [
        schemaKeys.ENGAGEMENT,
        {
          ...engagementEventSchema,
          typeList: engagementEventSchema?.typeList.map((item) => ({
            ...item,
            highlighted: highlightedTypes.ACTION.includes(item.name),
          })),
        },
      ],
      [
        schemaKeys.TRACKER,
        {
          ...trackerEventSchema,
          typeList: trackerEventSchema?.typeList.map((item) => ({
            ...item,
            highlighted: highlightedTypes.OBJECT.includes(item.name),
          })),
        },
      ],
    ]);
  }, [data]);

  return {
    schemas,
    getPropertiesAsync,
    getSchemaAsync,
  };
};

export default useEventSchemaApi;
