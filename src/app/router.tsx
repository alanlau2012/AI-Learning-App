/**
 * 路由壳（product-spec §6 七条路由）。
 * AppShell 为布局路由（<Outlet/> 注入页面），其余为页面。
 * 未匹配路由回退首页。
 */
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        hydrateFallbackElement: <div aria-live="polite">页面加载中...</div>,
        lazy: () => import('../pages/HomePage').then((m) => ({ Component: m.HomePage })),
      },
      {
        path: 'modules',
        hydrateFallbackElement: <div aria-live="polite">页面加载中...</div>,
        lazy: () => import('../pages/ModulesPage').then((m) => ({ Component: m.ModulesPage })),
      },
      {
        path: 'modules/:moduleId',
        hydrateFallbackElement: <div aria-live="polite">页面加载中...</div>,
        lazy: () => import('../pages/ModulePage').then((m) => ({ Component: m.ModulePage })),
      },
      {
        path: 'concepts/:slug',
        hydrateFallbackElement: <div aria-live="polite">页面加载中...</div>,
        lazy: () => import('../pages/ConceptPage').then((m) => ({ Component: m.ConceptPage })),
      },
      {
        path: 'search',
        hydrateFallbackElement: <div aria-live="polite">页面加载中...</div>,
        lazy: () => import('../pages/SearchPage').then((m) => ({ Component: m.SearchPage })),
      },
      {
        path: 'glossary',
        hydrateFallbackElement: <div aria-live="polite">页面加载中...</div>,
        lazy: () => import('../pages/GlossaryPage').then((m) => ({ Component: m.GlossaryPage })),
      },
      {
        path: 'profile',
        hydrateFallbackElement: <div aria-live="polite">页面加载中...</div>,
        lazy: () => import('../pages/ProfilePage').then((m) => ({ Component: m.ProfilePage })),
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

export default router;
