import { FC, memo, useContext, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { SchemaField, Type } from '../types';
import { EventSchemaContext } from '../hooks/useEventSchemaContext';
import { getFieldType, getIsTypeList } from '../selectors';
import SchemaFieldInputTreeList from './SchemaFieldInputTreeList';
import SchemaFieldInputChipLists from './SchemaFieldInputChipLists';
import SchemaFieldSummary from './SchemaFieldSummary';
import { flattenFieldRef } from '../api';

const sxDimmed = {
  backgroundColor: 'rgba(0,0,0,0.05)',
  backgroundImage: 'unset',
  backgroundBlendMode: 'color-dodge',
};

type SchemaFieldProps = {
  field: SchemaField;
  dimmed?: boolean;
  expanded: boolean;
  toggleExpanded: (id: string) => void;
};

const SchemaFieldContainer: FC<SchemaFieldProps> = ({
  field,
  expanded,
  toggleExpanded,
  dimmed,
}) => {
  const [fieldSelection, setFieldSelection] = useState(() => {
    return {
      field,
      path: [field],
    };
  });
  const {
    isSelected,
    getSelectionCount,
    deselectFieldProperties,
    deselectRootField,
    selectFieldProperties,
    selectFieldValues,
    selectRootField,
    setFieldPropertyAsync,
  } = useContext(EventSchemaContext);
  const isTypeList = getIsTypeList(field);
  const fieldType = getFieldType(field);
  const selectedFieldType = getFieldType(fieldSelection.field);
  const isFieldSelected = isSelected([], field);

  const onGetFieldProperty =
    (field: SchemaField) => async (property: SchemaField) => {
      await setFieldPropertyAsync(field, property);
    };

  const checkSelected = (path: SchemaField[]) => (property: SchemaField) =>
    isSelected(path, property);

  const onToggleSelectField =
    (path: SchemaField[]) => (property: SchemaField) => {
      if (isSelected(path, property)) {
        deselectFieldProperties(path, property);
        return;
      }
      selectFieldProperties(path, property);
    };

  const onToggleSelectRootField = (field: SchemaField) => () => {
    if (isSelected([], field)) {
      deselectRootField(field);
      return;
    }
    selectRootField(field);
  };

  const onSelectType = (path: SchemaField[]) => (type: Type) => {
    selectFieldValues(path, type);
  };

  const onDeselectAllFields =
    (path: SchemaField[]) => (properties: SchemaField[]) => {
      properties.forEach((property) => {
        deselectFieldProperties(path, property);
      });
    };

  const onSelectAllFields =
    (path: SchemaField[]) => (properties: SchemaField[]) => {
      properties.forEach((property) => {
        selectFieldProperties(path, property);
      });
    };

  const stepInFieldProperty = (field: SchemaField) => {
    const flatField = flattenFieldRef(field);
    setFieldSelection(({ path }) => ({
      field: flatField,
      path: [...path, flatField],
    }));
  };

  const stepOnPath = (field: SchemaField) => {
    setFieldSelection(({ path }) => ({
      field: field,
      path: path.slice(0, path.indexOf(field) + 1),
    }));
  };

  const getSelectedCount = (field: SchemaField) =>
    getSelectionCount([...fieldSelection.path, field]);

  if (fieldType === 'single')
    return (
      <li key={field.id}>
        <Card sx={dimmed ? sxDimmed : undefined}>
          <CardContent sx={{ pr: '32px' }}>
            <SchemaFieldSummary
              schemaField={field}
              selected={isFieldSelected}
              onSelectField={onToggleSelectRootField(field)}
            />
          </CardContent>
        </Card>
      </li>
    );
  return (
    <li key={`${field.name}|${field.id}`}>
      <Accordion
        expanded={expanded}
        onChange={(event) => {
          event.stopPropagation();
          toggleExpanded(field.id);
        }}
        sx={dimmed ? sxDimmed : undefined}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <SchemaFieldSummary
            schemaField={field}
            selected={isFieldSelected}
            onSelectField={onToggleSelectRootField(field)}
          />
        </AccordionSummary>
        <AccordionDetails>
          {isTypeList ? (
            <SchemaFieldInputChipLists
              items={field.typeList ?? []}
              checkSelected={checkSelected([field])}
              onSelectChip={onSelectType([field])}
            />
          ) : (
            <SchemaFieldInputTreeList
              id={fieldSelection.field.id}
              items={fieldSelection.field?.properties ?? []}
              breadcrumbs={fieldSelection.path}
              onDeselectAll={onDeselectAllFields(fieldSelection.path)}
              onSelectAll={onSelectAllFields(fieldSelection.path)}
              type={selectedFieldType}
              checkSelected={checkSelected(fieldSelection.path)}
              getSelectionCount={getSelectedCount}
              onSelectItem={onToggleSelectField(fieldSelection.path)}
              onHoverItem={onGetFieldProperty(fieldSelection.field)}
              onStepInItem={stepInFieldProperty}
              onBreadcrumbSelection={stepOnPath}
            />
          )}
        </AccordionDetails>
      </Accordion>
    </li>
  );
};

export default memo(SchemaFieldContainer);
