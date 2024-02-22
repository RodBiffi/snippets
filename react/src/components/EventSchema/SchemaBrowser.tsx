import React, { FC, useCallback, useContext } from 'react';

import { CardChipList } from './components/CardChipList';
import './styles.css';
import { EventSchemaContext } from './hooks/useEventSchemaContext';
import { Box, Typography } from '@mui/material';
import PageHeader from '../UI/PageHeader';
import { PageLoading } from '../AppStates/Loading';

const SchemaBrowser: FC = () => {
  const { initialSchemas, selectSchema, selectSchemaType } =
    useContext(EventSchemaContext);

  const onSelectSchema = useCallback(
    (schemaKey: string) => {
      selectSchema(schemaKey);
    },
    [selectSchema],
  );

  const onSelectSchemaType = useCallback(
    (schemaKey: string, type: string) => {
      selectSchemaType(schemaKey, type);
    },
    [selectSchemaType],
  );

  if (!initialSchemas) return <PageLoading />;
  return (
    <div className="browser-schema">
      <PageHeader
        title="Schema Browser"
        breadcrumbs={[
          { href: '/tracking/schema-browser', label: 'Schema Browser' },
        ]}
      >
        <Typography component="p" variant="body2">
          Explore the current schemas in order to understand what to track and
          how to track it. (Currently only user behavioral events are covered.)
        </Typography>
      </PageHeader>
      <Box sx={{ m: '3rem' }}>
        <ul className="schema-list">
          {Array.from(initialSchemas.values()).map((schema) => (
            <li key={schema.key}>
              <CardChipList
                id={schema.key}
                title={schema.title}
                description={schema.description}
                chipListTitle={schema.typeProperty}
                chips={schema.typeList}
                onSelectCard={onSelectSchema}
                onSelectChip={onSelectSchemaType}
              />
            </li>
          ))}
        </ul>
      </Box>
    </div>
  );
};

export default SchemaBrowser;
