import { renderHook } from '@testing-library/react-hooks';
import { FC, PropsWithChildren, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { SWRConfig } from 'swr';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import EventSchemaProvider from '../components/EventSchemaProvider';
import { findFieldByName } from '../selectors';
import { EventSchemaContext } from './useEventSchemaContext';
import schemasJson from '../__mocks__/schemas.json';
import trackerEventJson from '../__mocks__/tracker-event.json';
import engagementEventJson from '../__mocks__/engagement-event.json';
import trackerEventPropertiesJson from '../__mocks__/tracker-event-properties.json';
import engagementEventPropertiesJson from '../__mocks__/engagement-event-properties.json';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
  useMatch: () => ({ pathname: '/fields' }),
}));

const server = setupServer(
  rest.get('/api/v1/events/schemas', (req, res, ctx) => {
    return res(ctx.json(schemasJson));
  }),
  rest.get('/api/v1/events/schema/tracker-event', (req, res, ctx) => {
    return res(ctx.json(trackerEventJson));
  }),
  rest.get('/api/v1/events/schema/engagement-event', (req, res, ctx) => {
    return res(ctx.json(engagementEventJson));
  }),
  rest.get(
    '/api/v1/events/schemas/properties/%2Fevents%2Ftracker-event.json%2F326.json%23',
    (req, res, ctx) => {
      return res(ctx.json(trackerEventPropertiesJson));
    },
  ),
  rest.get(
    '/api/v1/events/schemas/properties/%2Fevents%2Fengagement-event.json%2F353.json%23',
    (req, res, ctx) => {
      return res(ctx.json(engagementEventPropertiesJson));
    },
  ),
);

describe('useEventSchemaContext', () => {
  beforeAll(() => {
    // Establish requests interception layer before all tests.
    server.listen({
      onUnhandledRequest: 'warn',
    });
  });
  afterAll(() => {
    // Clean up after all tests are done, preventing this
    // interception layer from affecting irrelevant tests.
    server.close();
  });

  test('initial state: tracker-event', async () => {
    (useLocation as jest.Mock).mockImplementation(() => ({
      search: '?schema=tracker-event&version=326&type=Click',
    }));
    let swrData: any;
    const wrapper: FC<PropsWithChildren> = ({ children }) => (
      <SWRConfig
        value={{
          dedupingInterval: 0,
          provider: () => new Map(),
          onSuccess: (data) => {
            swrData = data;
          },
        }}
      >
        <EventSchemaProvider>{children}</EventSchemaProvider>
      </SWRConfig>
    );
    const { result, waitForValueToChange } = renderHook(
      () => useContext(EventSchemaContext),
      {
        wrapper,
      },
    );
    await waitForValueToChange(() => swrData);
    expect(result.current.event).toEqual({
      schema: 'http://schema.site.com/events/event.json/326.json#',
      '@type': 'Click',
    });
    expect(result.current.getSelectionCount([])).toEqual(2);
    ['@type', 'schema'].forEach((propName) => {
      expect(
        result.current.isSelected(
          [],
          findFieldByName(propName, result.current.schema!.properties!)!,
        ),
      ).toBeTruthy();
    });
  });

  test('initial state: engagement-event', async () => {
    (useLocation as jest.Mock).mockImplementation(() => ({
      search: '?schema=engagement-event&version=353&type=Click',
    }));
    let swrData: any;
    const wrapper: FC<PropsWithChildren> = ({ children }) => (
      <SWRConfig
        value={{
          dedupingInterval: 0,
          provider: () => new Map(),
          onSuccess: (data) => {
            swrData = data;
          },
        }}
      >
        <EventSchemaProvider>{children}</EventSchemaProvider>
      </SWRConfig>
    );
    const { result, waitForValueToChange } = renderHook(
      () => useContext(EventSchemaContext),
      {
        wrapper,
      },
    );
    await waitForValueToChange(() => swrData);
    expect(result.current.event).toEqual({
      schema: 'http://schema.site.com/events/engagement-event.json/353.json#',
      '@type': 'Engagement',
      action: 'Click',
    });
    expect(result.current.getSelectionCount([])).toEqual(3);
    ['@type', 'schema', 'action'].forEach((propName) => {
      expect(
        result.current.isSelected(
          [],
          findFieldByName(propName, result.current.schema!.properties!)!,
        ),
      ).toBeTruthy();
    });
  });
});
