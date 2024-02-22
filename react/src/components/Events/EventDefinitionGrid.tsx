import {
  DataGrid,
  GridColDef,
  GridRowHeightReturnValue,
} from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import './EventDefinitionGrid.css';
import { EventDefinitionField } from './types.ts';

const columns: GridColDef[] = [
  {
    field: 'field',
    headerName: 'tracking fields',
    flex: 1,
    minWidth: 150,
  },
  {
    field: 'value',
    headerName: 'what value to send',
    flex: 1,
    minWidth: 150,
    renderCell: ({ row }) => {
      return <FieldValue field={row} />;
    },
  },
  {
    field: 'type',
    headerName: 'data type of the value',
    width: 280,
  },
  {
    field: 'example',
    headerName: 'example value',
    width: 250,
  },
];

interface FieldValueProps {
  field: EventDefinitionField;
}
function FieldValue({ field }: FieldValueProps) {
  return (
    <Box display="flex" flexDirection="column">
      <Typography variant="caption" color="secondary.dark">
        Send a constant value
      </Typography>
      <Typography>{field.value}</Typography>
    </Box>
  );
}

const getRowHeight = (): GridRowHeightReturnValue => 'auto';

interface EventDefinitionGridProps {
  fields: readonly EventDefinitionField[];
}

export default function EventDefinitionGrid({
  fields,
}: EventDefinitionGridProps) {
  return (
    <Box sx={{ width: '100%' }} bgcolor="#171717">
      <DataGrid
        rows={fields}
        columns={columns}
        getRowHeight={getRowHeight}
        hideFooter
        showCellVerticalBorder
        showColumnVerticalBorder
      />
    </Box>
  );
}
