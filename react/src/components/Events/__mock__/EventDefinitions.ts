import { GridRowsProp } from '@mui/x-data-grid';
import { EventDefinition, EventDefinitionField } from '../types.ts';

export const eventDefinitionFields: GridRowsProp<EventDefinitionField> = [
  {
    id: 0,
    field: '.type',
    value: 'View',
    type: 'string',
    example: '-',
  },
  {
    id: 10,
    field: '.name',
    value: 'Order car subscription',
    type: 'string',
    example: '-',
  },
  {
    id: 20,
    field: '.object.type',
    value: 'Listing',
    type: 'string',
    example: '-',
  },
  {
    id: 30,
    field: '.object.url',
    value:
      'https://www.site.no/recruitment/hired/admin/favorite/showFavorites.action',
    type: 'string',
    example: '-',
  },
  {
    id: 31,
    field: '.object.layout',
    value: 'Send List or Grid according to the layout of the list',
    type: 'enum',
    example: 'List',
  },
  {
    id: 40,
    field: '.vertical.name',
    value: 'Job',
    type: 'string',
    example: '-',
  },
];

export const eventDefinitions: EventDefinition[] = [
  {
    id: '1',
    domain: 'job',
    title: 'JOB-pv01',
    description:
      'Page view of company profile overview in the jobs page https://www.site.no/job/browse.html',
    schema: 'View - Listing',
    eventType: 'View',
    objectType: 'Listing',
    version: 'v1',
    fields: eventDefinitionFields,
  },
  {
    id: '2',
    domain: 'job',
    title: 'JOB-pv02',
    description:
      'Page view of company profile overview in the jobs page https://www.site.no/job/browse.html',
    schema: 'View - Listing',
    eventType: 'View',
    objectType: 'Listing',
    version: 'v1',
    fields: eventDefinitionFields,
  },
  {
    id: '3',
    domain: 'job',
    title: 'JOB-pv03',
    description:
      'Page view of company profile overview in the jobs page https://www.site.no/job/browse.html',
    schema: 'View - Form',
    eventType: 'View',
    objectType: 'Form',
    version: 'v1',
    fields: eventDefinitionFields,
  },
  {
    id: '4',
    domain: 'job',
    title: 'JOB-ev01',
    description:
      'Click of the “Creation” button in the confirmation page, see the screenshots in the thumbnails of the object',
    schema: 'Click - UIElement',
    eventType: 'Click',
    objectType: 'UIElement',
    version: 'v1',
    fields: eventDefinitionFields,
  },
  {
    id: '5',
    domain: 'job',
    title: 'JOB-ev02',
    description:
      'Click of the “Creation” button in the confirmation page, see the screenshots in the thumbnails of the object',
    schema: 'Click - Form',
    eventType: 'Click',
    objectType: 'Form',
    version: 'v1',
    fields: eventDefinitionFields,
  },
];
