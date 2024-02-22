import EventDefinitionHeader from './EventDefinitionHeader.tsx';
import EventDefinitionGrid from './EventDefinitionGrid.tsx';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './EventDefinition.css';
import { eventDefinitions } from './__mock__/EventDefinitions.ts';
import { PropsWithChildren } from 'react';
import { EventDefinition as EventDefinitionType } from './types.ts';

interface EventDefinitionGroupProps {
  title: string;
  count?: number;
}
function EventDefinitionGroup({
  title,
  count,
  children,
}: PropsWithChildren<EventDefinitionGroupProps>) {
  return (
    <Box>
      <Accordion
        className="event-type-group"
        disableGutters
        elevation={0}
        square
        defaultExpanded
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography>{title}</Typography>
            <Typography color="secondary">({count ?? 0})</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default function EventDefinition() {
  const eventDefinitionsGroupDict: Record<string, EventDefinitionType[]> = {};

  eventDefinitions.forEach((eventDefinition) => {
    const key = `${eventDefinition.eventType} ${eventDefinition.objectType}`;
    if (!eventDefinitionsGroupDict[key]) {
      eventDefinitionsGroupDict[key] = [eventDefinition];
    } else {
      eventDefinitionsGroupDict[key].push(eventDefinition);
    }
  });

  return (
    <>
      {Object.entries(eventDefinitionsGroupDict).map(
        ([key, eventDefinitionGroup]) => {
          return (
            <EventDefinitionGroup
              key={key}
              title={key}
              count={eventDefinitionGroup.length}
            >
              {eventDefinitionGroup.map((eventDefinition) => (
                <Box key={eventDefinition.id} mb={1}>
                  <Accordion disableGutters elevation={0} square>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <EventDefinitionHeader
                        eventDefinition={eventDefinition}
                      />
                    </AccordionSummary>
                    <AccordionDetails>
                      <EventDefinitionGrid fields={eventDefinition.fields} />
                    </AccordionDetails>
                  </Accordion>
                </Box>
              ))}
            </EventDefinitionGroup>
          );
        },
      )}
    </>
  );
}
