/**
 * 路由壳（product-spec §6 七条路由）。
 * AppShell 为布局路由（<Outlet/> 注入页面），其余为页面。
 * 未匹配路由回退首页。
 */
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { HomePage } from '../pages/HomePage';
import { ModulesPage } from '../pages/ModulesPage';
import { ModulePage } from '../pages/ModulePage';
import { ConceptPage } from '../pages/ConceptPage';
import { SearchPage } from '../pages/SearchPage';
import { GlossaryPage } from '../pages/GlossaryPage';
import { ProfilePage } from '../pages/ProfilePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'modules', element: <ModulesPage /> },
      { path: 'modules/:moduleId', element: <ModulePage /> },
      { path: 'concepts/:slug', element: <ConceptPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'glossary', element: <GlossaryPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

export default router;
