import React, { FC } from 'react';
import { Paper, Typography, useTheme } from '@mui/material';
import { SchemaField as SchemaFieldProps } from '../types';

const SchemaFieldDetails: FC<SchemaFieldProps> = ({
  name,
  description,
  type,
  properties,
}) => {
  const {
    palette: { grey, mode, text },
  } = useTheme();
  return (
    <Paper
      sx={{
        padding: '2rem',
        flexGrow: 1,
        ml: '2rem',
        backgroundColor: mode === 'light' ? grey[100] : grey['900'],
        maxHeight: '65ch',
        overflowY: 'auto',
      }}
    >
      <Typography variant="h6" component="h3" sx={{ pb: '2rem' }}>
        {name}
      </Typography>
      <Typography
        variant="subtitle2"
        component="h4"
        sx={{ color: text.secondary }}
      >
        Description
      </Typography>
      <Typography variant="body2" sx={{ pb: '2rem' }}>
        {description}
      </Typography>
      {type && (
        <>
          <Typography
            variant="subtitle2"
            component="h4"
            sx={{ color: text.secondary }}
          >
            Type
          </Typography>
          <Typography variant="body2" sx={{ pb: '2rem' }}>
            {type}
          </Typography>
        </>
      )}
      {!!properties && properties.length > 0 && (
        <>
          <Typography
            variant="subtitle2"
            component="h4"
            sx={{ color: text.secondary }}
          >
            Properties
          </Typography>
          <ul>
            {properties.map(({ id, name, required }) => (
              <Typography
                variant="body2"
                component="li"
                key={id}
                sx={{ textIndent: '2rem' }}
              >
                {name}
                {required ? '*' : ''}
              </Typography>
            ))}
          </ul>
        </>
      )}
    </Paper>
  );
};

export default SchemaFieldDetails;
