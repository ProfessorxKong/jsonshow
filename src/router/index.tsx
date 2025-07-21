import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import Home from '@/pages/Home';
import JsonViewer from '@/pages/JsonViewer';
import ExcelViewer from '@/pages/ExcelViewer';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <MainLayout>
        <Home />
      </MainLayout>
    ),
  },
  {
    path: '/json/:fileId',
    element: (
      <MainLayout>
        <JsonViewer />
      </MainLayout>
    ),
  },
  {
    path: '/excel/:fileId',
    element: (
      <MainLayout>
        <ExcelViewer />
      </MainLayout>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;
