/**
 * Default values used across several components, determined by
 * implementation constraints or by Business rules/necessities, which cannot be
 * translated into dynamic references so far.
 */

/**
 * schemaKeys
 * Define less complex root schemas identifiers that can be exchanged
 * with the api and mapped back to the view components.
 * Those are the root schemas used as entrypoint for possible schemas the User
 * is allowed to configure.
 */
export const schemaKeys = {
  TRACKER: 'event',
  ENGAGEMENT: 'engagement-event',
};

/**
 * SchemaKey
 * Type derived from the schemaKeys object
 * @see schemaKeys
 */
export type SchemaKey = (typeof schemaKeys)[keyof typeof schemaKeys];

export const highlightedTypes = {
  ACTION: ['Click', 'Zoom', 'Scroll'],
  OBJECT: ['Click', 'Login', 'Open', 'View'],
};

export const schemaFieldsCategoriesIds = {
  MAIN: 'field-category-main',
  ADDITIONAL: 'field-category-additional',
  TECHNICAL: 'field-category-technical',
};

export const schemaFieldsCategoriesItems = {
  MAIN: ['@type', 'object', 'intent', 'target', 'name', 'origin'],
  TECHNICAL: [
    'schema',
    '@id',
    'creationDate',
    'tracker',
    'device',
    'provider',
    'actor',
    'session',
    'experiments',
  ],
};

export type Schema = {
  id: string;
  key: SchemaKey;
  version: string;
  versions: string[];
  title: string;
  description: string;
  typeProperty: string;
  typeDescription: string;
  typeList: Type[];
  properties?: SchemaField[];
};

export type Type = {
  id: string;
  name: string;
  highlighted?: boolean;
  reference?: string;
};

export type SchemaField = {
  id: string;
  name: string;
  description?: string;
  required?: boolean;
  pattern?: string;
  minimum?: string;
  maximum?: string;
  maxLength?: string;
  minLength?: string;
  type?: string;
  typeList?: ChipListItem[];
  properties?: SchemaField[];
  reference?: string;
  isOneOfProperty?: boolean;
  _mutated?: boolean;
};

export type ChipListItem = {
  id: string;
  name: string;
};
