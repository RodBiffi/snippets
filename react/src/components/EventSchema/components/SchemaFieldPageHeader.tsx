import React, { useState } from 'react';
import { ArrowDropDown } from '@mui/icons-material';
import { Box, Button, Typography, Menu, MenuItem } from '@mui/material';
import PageHeader from '../../UI/PageHeader';

export type SchemaFieldPageHeaderProps = {
  onChange: (version: string) => void;
  version: string;
  versions: string[];
  schemaUrl: string;
  header: string;
  description: string;
};

const SchemaFieldPageHeader: React.FC<SchemaFieldPageHeaderProps> = ({
  onChange,
  version,
  header,
  versions,
  description,
}) => {
  const [versionPickerMenuAnchor, setVersionPickerMenuAnchor] =
    useState<null | HTMLElement>(null);
  const open = Boolean(versionPickerMenuAnchor);
  const handleClose = () => setVersionPickerMenuAnchor(null);

  return (
    <PageHeader
      title={header}
      breadcrumbs={[
        { href: '/tracking/start/schema-browser', label: 'Schema Browser' },
        { href: '/tracking/start/schema-browser/fields', label: header },
      ]}
    >
      <Typography variant="body2" component="p">
        {description}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2">Schema version:</Typography>
        <Button
          id="basic-button"
          color="primary"
          aria-controls="basic-menu"
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={(e) => setVersionPickerMenuAnchor(e.currentTarget)}
        >
          {version} <ArrowDropDown />
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={versionPickerMenuAnchor}
          open={open}
          onClose={handleClose}
          sx={{ maxHeight: '65ch' }}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {versions.map((version) => (
            <MenuItem
              key={version}
              onClick={() => {
                onChange(version);
                handleClose();
              }}
            >
              {version}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </PageHeader>
  );
};

export default SchemaFieldPageHeader;
