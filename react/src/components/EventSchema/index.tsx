import { FC } from 'react';
import { Outlet } from 'react-router';
import EventSchemaProvider from './components/EventSchemaProvider';

const SchemaBrowserRoutes: FC = () => (
  <EventSchemaProvider>
    <Outlet />
  </EventSchemaProvider>
);

export default SchemaBrowserRoutes;
