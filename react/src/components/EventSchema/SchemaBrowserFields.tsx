import {
  FC,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Box, Button, Typography } from '@mui/material';
import './styles.css';
import SchemaFieldPageHeader from './components/SchemaFieldPageHeader';
import { EventSchemaContext } from './hooks/useEventSchemaContext';
import { FilterField, useFilterField } from '../UI/FilterField';
import { copyClipboard } from '../Layout/copyClipboard';
import { PageLoading } from '../AppStates/Loading';
import { useNotificationContext } from '../Layout/NotificationContext';
import SchemaFieldContainer from './components/SchemaField';
import { schemaFieldsCategoriesIds } from './types';
import {
  filterCategoryAdditionalFields,
  filterCategoryMainFields,
  filterCategoryTechnicalFields,
} from './selectors';
import FieldCategoryAccordion from './components/FieldCategory';
import CodeEditor from '../UI/Editor';

const SchemaBrowserFields: FC = () => {
  const { schema, event, deselectRootField, selectSchemaVersion } =
    useContext(EventSchemaContext);
  const jsonRef = useRef<Record<string, unknown>>(event);
  const filter = useFilterField();
  const { showNotification } = useNotificationContext();
  const items = useMemo(() => schema?.properties ?? [], [schema?.properties]);
  const accordionIds = items.reduce(
    (acc, { id }) => ({ ...acc, [id]: false }),
    {
      [schemaFieldsCategoriesIds.MAIN]: false,
      [schemaFieldsCategoriesIds.ADDITIONAL]: false,
      [schemaFieldsCategoriesIds.TECHNICAL]: false,
      allOpen: false,
    },
  );
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>(
    {
      ...accordionIds,
      [schemaFieldsCategoriesIds.MAIN]: true,
    },
  );

  useEffect(() => {
    jsonRef.current = event;
  }, [event]);

  const { filteredFields, mainFields, additionalFields, technicalFields } =
    useMemo(() => {
      const filteredFields = items.filter(
        ({ name, description }) =>
          (name && name.toLowerCase().includes(filter.value.toLowerCase())) ||
          (description &&
            description.toLowerCase().includes(filter.value.toLowerCase())),
      );
      return {
        mainFields: filterCategoryMainFields(filteredFields),
        additionalFields: filterCategoryAdditionalFields(filteredFields),
        technicalFields: filterCategoryTechnicalFields(filteredFields),
        filteredFields,
      };
    }, [filter, items]);

  const onClearAllFieldsSelection = () => {
    filteredFields.forEach((field) => {
      deselectRootField(field);
    });
  };

  const openAllAccordions = () =>
    setOpenAccordions(
      Object.assign(
        Object.fromEntries(Object.keys(accordionIds).map((key) => [key, true])),
        {
          allOpen: true,
        },
      ),
    );

  const closeAllAccordions = () => setOpenAccordions(accordionIds);

  const copyJson = () =>
    copyClipboard(JSON.stringify(event), () =>
      showNotification({
        content: 'JSON Copied ✨',
        alert: { severity: 'success' },
      }),
    );

  const toggleAccordion = useCallback(
    (id: string) => {
      setOpenAccordions((prevState) => ({
        ...prevState,
        [id]: !prevState[id],
        allOpen: false,
      }));
    },
    [setOpenAccordions],
  );

  if (!schema) return <PageLoading />;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '60% 40%',
        gridTemplateRows: 'auto 1fr',
        maxWidth: '1920px',
      }}
    >
      <Box sx={{ gridArea: '1 / 1 / 1 / 1' }}>
        {schema ? (
          <SchemaFieldPageHeader
            {...schema}
            onChange={selectSchemaVersion}
            header={schema.key}
            schemaUrl={schema.id}
          />
        ) : (
          ''
        )}
      </Box>
      <Box sx={{ p: '3rem', gridArea: '2 / 1 / 2 / 1' }}>
        <Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr auto auto',
              gap: '2rem',
              my: '2rem',
            }}
          >
            <FilterField {...filter} />
            <Button
              onClick={onClearAllFieldsSelection}
              variant="outlined"
              sx={{ width: 'fit-content' }}
            >
              Clear selections
            </Button>
            <Button
              onClick={
                openAccordions.allOpen ? closeAllAccordions : openAllAccordions
              }
              variant="outlined"
              sx={{ width: 'fit-content' }}
            >
              {openAccordions.allOpen ? 'Collapse all' : 'Expand all'}
            </Button>
          </Box>
        </Box>
        <FieldCategoryAccordion
          id={schemaFieldsCategoriesIds.MAIN}
          title="Describe the event"
          description='First decide what "verb" (@type) is connected to the event. Then try
                                to find the "object" on which users are performing the event.
                                Optionally, you can also use intent, target, name, origin to
                                describe the event when needed.'
          expanded={
            openAccordions[schemaFieldsCategoriesIds.MAIN] ||
            openAccordions.allOpen ||
            (!!filter.value && mainFields.length > 0)
          }
          toggleExpanded={toggleAccordion}
        >
          <ul className="schema-list">
            {mainFields.map((field) => (
              <SchemaFieldContainer
                key={field.id}
                field={field}
                expanded={openAccordions[field.id] || openAccordions.allOpen}
                toggleExpanded={toggleAccordion}
              />
            ))}
          </ul>
        </FieldCategoryAccordion>
        <FieldCategoryAccordion
          id={schemaFieldsCategoriesIds.ADDITIONAL}
          title="Additional event fields"
          description="Additional fields you can use when needed."
          expanded={
            openAccordions[schemaFieldsCategoriesIds.ADDITIONAL] ||
            openAccordions.allOpen ||
            (!!filter.value && additionalFields.length > 0)
          }
          toggleExpanded={toggleAccordion}
        >
          <ul className="schema-list">
            {additionalFields.map((field) => (
              <SchemaFieldContainer
                key={field.id}
                field={field}
                expanded={openAccordions[field.id] || openAccordions.allOpen}
                toggleExpanded={toggleAccordion}
              />
            ))}
          </ul>
        </FieldCategoryAccordion>
        <FieldCategoryAccordion
          id={schemaFieldsCategoriesIds.TECHNICAL}
          title="Technical requirements "
          description="The contents and rules for sending and tracking of the properties within these
                    fields usually only need to be set up once for your brand. Therefore, you don’t need to add
                    them to each event."
          expanded={
            openAccordions[schemaFieldsCategoriesIds.TECHNICAL] ||
            openAccordions.allOpen ||
            (!!filter.value && technicalFields.length > 0)
          }
          toggleExpanded={toggleAccordion}
        >
          <ul className="schema-list">
            {technicalFields.map((field) => (
              <SchemaFieldContainer
                key={field.id}
                field={field}
                dimmed
                expanded={openAccordions[field.id] || openAccordions.allOpen}
                toggleExpanded={toggleAccordion}
              />
            ))}
          </ul>
        </FieldCategoryAccordion>
      </Box>
      <Box sx={{ gridArea: '1 / 2 / 3 / -1', position: 'relative' }}>
        <Box
          sx={{
            position: 'sticky',
            width: '100%',
            top: '4px',
            display: 'grid',
            height: '100vh',
            gridTemplateRows: 'auto 1fr auto',
          }}
        >
          <Typography variant="subtitle2" component="h2" sx={{ p: '1rem' }}>
            Event JSON structure preview
          </Typography>
          <CodeEditor
            value={JSON.stringify(event, null, 2)}
            // height="100%"
            options={{ readOnly: true }}
          />
          <Button
            onClick={copyJson}
            variant="outlined"
            fullWidth
            sx={{ my: '1rem' }}
          >
            Copy JSON
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SchemaBrowserFields;
