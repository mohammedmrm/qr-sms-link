import Notfound from '@/components/common/notfound';
import Dashboard from '@/pages/dashboard';
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Dashboard />,
    },
    {
      path: '*',
      element: <Notfound />,
    },
  ],
  {
    basename: import.meta.env.VITE_BASE_URL,
  }
);
export default router;
