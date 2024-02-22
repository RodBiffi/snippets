import { ChevronRight } from '@mui/icons-material';
import {
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Box,
  Button,
  Divider,
  Typography,
} from '@mui/material';
import React, { useState, useMemo } from 'react';
import './styles.css';

export type Chip = {
  id: string;
  name: string;
  highlighted?: boolean;
};

export type CardChipListProps = {
  id: string;
  title: string;
  description: string;
  chipListTitle: string;
  chips: Chip[];
  onSelectCard: (id: string) => void;
  onSelectChip: (cardId: string, chipId: string) => void;
};

export const CardChipList: React.FC<CardChipListProps> = ({
  id: cardId,
  title,
  description,
  chipListTitle,
  chips,
  onSelectCard,
  onSelectChip,
}) => {
  const [expanded, setExpanded] = useState(false);
  const onExpandToggle = () => setExpanded(!expanded);

  const { highlighted, normal } = useMemo(
    () => getHighlightedChips(chips),
    [chips],
  );

  return (
    <Card color="primary">
      <CardActionArea onClick={() => onSelectCard(cardId)}>
        <CardContent>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gridTemplateRows: '1fr 1fr',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
            <Typography variant="body2" component="p">
              {description}
            </Typography>
            <Box gridArea="1 / 2 / -1 / 2" display="flex" alignItems="center">
              <ChevronRight />
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
      <Divider />
      <CardContent>
        <Typography
          variant="subtitle2"
          component="h3"
          style={{ marginBottom: '16px' }}
        >
          {chipListTitle}
        </Typography>
        <ul className="chips">
          {highlighted.map(({ id, name }) => (
            <li key={id}>
              <Chip
                onClick={() => {
                  onSelectChip(cardId, id);
                }}
                variant="outlined"
                color="primary"
                label={name}
                icon={<ChevronRight />}
              />
            </li>
          ))}
        </ul>
        <div>
          <ul
            id={`${cardId}-content`}
            className="chips"
            style={{
              minHeight: expanded ? '0' : '0',
              height: expanded ? 'auto' : '0',
              overflowY: expanded ? 'visible' : 'hidden',
              transitionDuration: '355ms',
              transition: 'height 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
            }}
          >
            {normal.map(({ id, name }) => (
              <li key={id}>
                <Chip
                  onClick={() => {
                    onSelectChip(cardId, id);
                  }}
                  color="primary"
                  variant="outlined"
                  label={name}
                  icon={<ChevronRight />}
                />
              </li>
            ))}
          </ul>
          <Button
            variant="text"
            aria-controls={`${cardId}-content`}
            id={`${cardId}-header`}
            color="primary"
            onClick={() => {
              onExpandToggle();
            }}
          >
            {expanded ? 'Show less' : 'Show all'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const getHighlightedChips = (tags: Chip[]): Record<string, Chip[]> =>
  tags.reduce<Record<string, Chip[]>>(
    ({ highlighted, normal }, cur) => {
      if (cur.highlighted)
        return { highlighted: [...highlighted, cur], normal };
      return { highlighted, normal: [...normal, cur] };
    },
    { highlighted: [], normal: [] },
  );
