import { FC, PropsWithChildren } from 'react';

import useEventSchemaContext, {
  Provider,
} from '../hooks/useEventSchemaContext';

const EventSchemaProvider: FC<PropsWithChildren> = ({ children }) => {
  const context = useEventSchemaContext();
  return <Provider value={context}>{children}</Provider>;
};

export default EventSchemaProvider;
