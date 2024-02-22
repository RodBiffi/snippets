import { FC, memo, useCallback, useMemo, useState } from 'react';
import { Box, Breadcrumbs, Button, Link } from '@mui/material';
import InputTreeList, { InputTreeListProps } from './InputTreeList';
import SchemaFieldDetails from './SchemaFieldDetails';
import { SchemaField } from '../types';
import { FilterField, useFilterField } from '../../UI/FilterField';
import { sortByStringProperty } from '../selectors';
import { flattenFieldRef } from '../api';
import './styles.css';

export type SchemaFieldInputTreeListProps = {
  breadcrumbs: SchemaField[];
  onBreadcrumbSelection: (field: SchemaField) => void;
  onSelectAll: (properties: SchemaField[]) => void;
  onDeselectAll: (properties: SchemaField[]) => void;
} & InputTreeListProps<SchemaField>;

const SchemaFieldInputTreeList: FC<SchemaFieldInputTreeListProps> = ({
  items,
  type,
  onBreadcrumbSelection,
  onHoverItem,
  onSelectAll,
  onDeselectAll,
  breadcrumbs,
  ...rest
}) => {
  const filter = useFilterField();
  const [detailId, setDetailId] = useState('');

  const filteredItems = useMemo(
    () =>
      items
        .map((item) => flattenFieldRef(item))
        .filter((item) =>
          item.name.toLowerCase().includes(filter.value.toLowerCase()),
        )
        .sort(sortByStringProperty('name')),
    [filter, items],
  );

  const details = useMemo(() => {
    if (!detailId && items.length > 0) return { ...items[0], id: items[0].id };
    const item = items.find(
      (item) => item.id === detailId || item.reference === detailId,
    );
    if (item) return { ...item, id: item.id };
    return null;
  }, [detailId, items]);

  const onHoverItemHandler = useCallback(
    async (property: SchemaField) => {
      await onHoverItem(property);
      setDetailId(property.id);
    },
    [onHoverItem],
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      {breadcrumbs.length > 1 && (
        <Breadcrumbs aria-label="breadcrumb">
          {breadcrumbs.map((breadcrumb, idx) => (
            <Link
              key={breadcrumb.id}
              onClick={() => onBreadcrumbSelection(breadcrumb)}
              color="inherit"
              component="button"
              {...(idx + 1 === breadcrumbs.length
                ? { 'aria-current': 'page' }
                : {})}
            >
              {breadcrumb.name}
            </Link>
          ))}
        </Breadcrumbs>
      )}
      <FilterField {...filter} />
      {type === 'checkbox' && (
        <Box>
          <Button variant="text" onClick={() => onSelectAll(filteredItems)}>
            Select all
          </Button>
          <Button variant="text" onClick={() => onDeselectAll(filteredItems)}>
            Deselect all
          </Button>
        </Box>
      )}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'minmax(240px, auto) 1fr',
          gap: '2rem',
          minHeight: '65ch',
        }}
      >
        <InputTreeList
          items={filteredItems}
          type={type}
          {...rest}
          onHoverItem={onHoverItemHandler}
        />
        {details && <SchemaFieldDetails {...details} />}
      </Box>
    </>
  );
};

export default memo(SchemaFieldInputTreeList);
