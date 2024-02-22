import {
  Accordion,
  AccordionDetails,
  AccordionDetailsProps,
  AccordionProps,
  AccordionSummary,
  AccordionSummaryProps,
  Box,
  Typography,
} from '@mui/material';
import { FC, PropsWithChildren } from 'react';
import { ExpandMore } from '@mui/icons-material';

type FieldCategoryAccordionProps = {
  id: string;
  title: string;
  description: string;
  expanded: boolean;
  toggleExpanded: (id: string) => void;
  accordionProps?: Omit<AccordionProps, 'children'>;
  summaryProps?: Omit<AccordionSummaryProps, 'children'>;
  detailsProps?: Omit<AccordionDetailsProps, 'children'>;
};

const FieldCategoryAccordion: FC<
  PropsWithChildren<FieldCategoryAccordionProps>
> = ({
  id,
  title,
  description,
  expanded,
  toggleExpanded,
  accordionProps,
  summaryProps,
  detailsProps,
  children,
}) => {
  return (
    <Accordion
      disableGutters
      elevation={0}
      expanded={expanded}
      sx={{
        backgroundColor: 'transparent',
        backgroundImage: 'unset',
        boxShadow: 'unset',
      }}
      onChange={() => toggleExpanded(id)}
      {...accordionProps}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls={`${id}-details`}
        id={`${id}-container`}
        {...summaryProps}
      >
        <Box display="flex" flexDirection="column" flexGrow={1}>
          <Typography variant="body1" component="h2">
            {title}
          </Typography>
          <Typography variant="body2" component="p" color="text.secondary">
            {description}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }} id={`${id}-details`} {...detailsProps}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

export default FieldCategoryAccordion;
