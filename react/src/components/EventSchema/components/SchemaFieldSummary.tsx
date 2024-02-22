import { Typography, IconButton, Box } from '@mui/material';
import {
  AddCircleOutlineRounded,
  RemoveCircleOutlineRounded,
} from '@mui/icons-material';
import { FC } from 'react';
import { SchemaField } from '../types';

export type SchemaFieldSummaryProps = {
  onSelectField?: () => void;
  schemaField: SchemaField;
  selected?: boolean;
};

const SchemaFieldSummary: FC<SchemaFieldSummaryProps> = ({
  onSelectField,
  schemaField: { required, description, name },
  selected,
}) => {
  return (
    <Box display="flex" alignItems="center">
      {!!onSelectField && (
        <IconButton
          edge="end"
          aria-label="comments"
          sx={{ marginRight: '2rem' }}
          onClick={(e) => {
            e.stopPropagation();
            if (onSelectField) onSelectField();
          }}
        >
          {selected ? (
            <RemoveCircleOutlineRounded color="primary" />
          ) : (
            <AddCircleOutlineRounded />
          )}
        </IconButton>
      )}
      <div>
        <Typography variant="body1" component="h2">
          {name} {required ? <span>*</span> : ''}
        </Typography>
        <Typography variant="body2" component="p" color="text.secondary">
          {description}
        </Typography>
      </div>
    </Box>
  );
};

export default SchemaFieldSummary;
