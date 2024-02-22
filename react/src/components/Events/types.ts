export type EventDefinitionField = {
  id: number;
  field: string;
  value: string;
  type: string;
  example: string;
};

export type EventDefinition = {
  id: string;
  title: string;
  description: string;
  domain: string;
  schema: string;
  eventType: string;
  objectType: string;
  version: string;
  fields: readonly EventDefinitionField[];
};
