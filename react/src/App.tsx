import TopBar from './components/App/TopBar';
import './App.css';
import NetworkProvider from './components/App/NetworkProvider.tsx';
import ThemeProvider from './components/Theme';
import { Container } from '@mui/material';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Route1 from './components/Route1.tsx';
import Route2 from './components/Route2.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        path: '/tracking-plan',
        element: <Route1 />,
      },
      {
        index: true,
        path: '/nmp-schema',
        element: <Route2 />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <ThemeProvider>
        <NetworkProvider>
          <RouterProvider router={router} />
        </NetworkProvider>
      </ThemeProvider>
    </>
  );
}

function Layout() {
  return (
    <>
      <TopBar />
      <Container maxWidth="xl" sx={{ mt: '2rem' }}>
        <Outlet />
      </Container>
    </>
  );
}

export default App;
