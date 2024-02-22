import { Box, Button, IconButton, Paper, Typography } from '@mui/material';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import EditIcon from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import PublicIcon from '@mui/icons-material/Public';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PageViewIcon from '@mui/icons-material/Pageview';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import RestoreIcon from '@mui/icons-material/Restore';
import './EventDefinitionHeader.css';
import { EventDefinition } from './types.ts';

interface EventTypeIconProps {
  eventType: string;
}

function EventTypeIcon({ eventType }: EventTypeIconProps) {
  const color = 'secondary';
  const fontSize = 'medium';
  let icon = <PageViewIcon color={color} fontSize={fontSize} />; // assumes "View is default

  if (eventType.toLowerCase() === 'click') {
    icon = <AdsClickIcon color={color} fontSize={fontSize} />;
  }

  return (
    <Paper
      sx={{
        width: '3rem',
        height: '3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon}
    </Paper>
  );
}
interface EventDefinitionHeaderProps {
  eventDefinition: EventDefinition;
}

export default function EventDefinitionHeader({
  eventDefinition,
}: EventDefinitionHeaderProps) {
  return (
    <Paper className="event-definition-header" square elevation={0}>
      <Box display="flex">
        <Box
          flex={1}
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap={3}
        >
          <EventTypeIcon eventType={eventDefinition.eventType} />
          <Box>
            <Typography variant="h6">{eventDefinition.title}</Typography>
            <Typography variant="caption">
              {eventDefinition.description}
            </Typography>
          </Box>
        </Box>
        <Button startIcon={<EditIcon />}>Edit</Button>
        <Button startIcon={<FileCopyIcon />}>Duplicate</Button>
      </Box>
      <Box display="flex" gap={3}>
        <Box display="flex" flexDirection="row" alignItems="center" gap={0.5}>
          <PublicIcon color="secondary" />
          <Typography variant="caption" textTransform="capitalize">
            {eventDefinition.domain}
          </Typography>
        </Box>
        <Box display="flex" flexDirection="row" alignItems="center" gap={0.5}>
          <ListAltIcon color="secondary" />
          <Typography variant="caption">{eventDefinition.schema}</Typography>
        </Box>
        <Box display="flex" flexDirection="row" alignItems="center" gap={0.5}>
          <PeopleAltIcon color="secondary" />
          <Typography variant="caption">Easy apply team</Typography>
        </Box>
        <Box display="flex" flexDirection="row" alignItems="center" gap={0.5}>
          <RestoreIcon color="secondary" />
          <Typography variant="caption">{eventDefinition.version}</Typography>
        </Box>
        <IconButton>
          <MoreVertIcon color="secondary" />
        </IconButton>
      </Box>
    </Paper>
  );
}
