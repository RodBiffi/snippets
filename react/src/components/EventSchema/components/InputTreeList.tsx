import React from 'react';
import {
  Badge,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Radio,
} from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import { SchemaField } from '../types';

export type InputTreeListProps<G> = {
  id: string;
  items: G[];
  type: 'checkbox' | 'radio' | 'single';
  checkSelected: (property: SchemaField) => boolean;
  getSelectionCount: (item: SchemaField) => number;
  onSelectItem: (property: SchemaField) => void;
  onHoverItem: (property: SchemaField) => void;
  onStepInItem: (property: SchemaField) => void;
};

const InputTreeList = <G extends Omit<SchemaField, 'description'>>({
  id: listId,
  items,
  type,
  checkSelected,
  getSelectionCount,
  onHoverItem,
  onSelectItem,
  onStepInItem,
}: InputTreeListProps<G>): JSX.Element => {
  return (
    <List
      sx={{ width: '100%', maxWidth: 360, backgroundColor: 'background.paper' }}
      color="primary"
    >
      {items.map((item) => {
        const { id, name, properties } = item;
        const selectionCount = getSelectionCount(item);
        return (
          <ListItem
            key={id}
            onMouseEnter={() => onHoverItem(item)}
            secondaryAction={
              properties?.length ? (
                <IconButton
                  edge="end"
                  aria-label="comments"
                  onClick={() => onStepInItem(item)}
                >
                  <ChevronRight />
                </IconButton>
              ) : (
                <div />
              )
            }
            disablePadding
          >
            <ListItemButton
              role={undefined}
              onClick={(e) => {
                e.stopPropagation();
                onSelectItem(item);
              }}
              dense
            >
              <ListItemIcon>
                {type === 'checkbox' && (
                  <Checkbox
                    edge="start"
                    checked={checkSelected(item)}
                    value={id}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': id }}
                  />
                )}
                {type === 'radio' && (
                  <Radio
                    edge="start"
                    checked={checkSelected(item)}
                    value={id}
                    tabIndex={-1}
                    name={listId}
                    disableRipple
                    inputProps={{ 'aria-labelledby': id }}
                  />
                )}
              </ListItemIcon>
              <ListItemText id={id} primary={name} />
              {!!selectionCount && selectionCount > 0 && (
                <Badge badgeContent={selectionCount} color="primary" />
              )}
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};
export default InputTreeList;
