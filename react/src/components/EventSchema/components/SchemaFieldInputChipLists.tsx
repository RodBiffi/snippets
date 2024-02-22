import { FC, memo, useMemo } from 'react';
import { ChipListItem, Type } from '../types';
import { Chip, Box } from '@mui/material';
import { FilterField, useFilterField } from '../../UI/FilterField';

export type SchemaFieldInputChipListsProps = {
  items: ChipListItem[];
  checkSelected: (item: Type) => boolean;
  onSelectChip: (item: Type) => void;
};

const SchemaFieldInputChipLists: FC<SchemaFieldInputChipListsProps> = ({
  items,
  checkSelected,
  onSelectChip,
}) => {
  const filter = useFilterField();

  const filteredItems = useMemo(
    () =>
      items.filter(({ name }) =>
        name.toLowerCase().includes(filter.value.toLowerCase()),
      ),
    [filter.value, items],
  );

  return (
    <Box>
      <FilterField {...filter} />
      <ul className="chips" style={{ marginTop: 8 }}>
        {filteredItems.map((item) => {
          const { id, name } = item;
          return (
            <li key={id}>
              <Chip
                onClick={() => {
                  onSelectChip(item);
                }}
                variant={checkSelected(item) ? undefined : 'outlined'}
                color="primary"
                label={name}
              />
            </li>
          );
        })}
      </ul>
    </Box>
  );
};

export default memo(SchemaFieldInputChipLists);
