import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from '@/lib/queryClient';
import ScrollToTop from '@/components/ScrollToTop';

import { PublicLayout } from '@/components/public/PublicLayout';
import Home from '@/pages/public/Home';
const Gallery = lazy(() => import('@/pages/public/Gallery'));
const ArtworkDetail = lazy(() => import('@/pages/public/ArtworkDetail'));
const About = lazy(() => import('@/pages/public/About'));
const Exhibitions = lazy(() => import('@/pages/public/Exhibitions'));
const Contact = lazy(() => import('@/pages/public/Contact'));

import { ProtectedRoute } from '@/routes/ProtectedRoute';

const AdminLayout = lazy(() =>
  import('@/components/admin/AdminLayout').then((mod) => ({ default: mod.AdminLayout }))
);
const Login = lazy(() => import('@/pages/admin/Login'));
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'));
const ArtworksManager = lazy(() => import('@/pages/admin/ArtworksManager'));
const ExhibitionsManager = lazy(() => import('@/pages/admin/ExhibitionsManager'));
const AboutManager = lazy(() => import('@/pages/admin/AboutManager'));
const MessagesManager = lazy(() => import('@/pages/admin/MessagesManager'));
const Settings = lazy(() => import('@/pages/admin/Settings'));

const RouteLoadingFallback = () => (
  <div className="min-h-[40vh] flex items-center justify-center">
    <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
  </div>
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route
              path="/gallery"
              element={(
                <Suspense fallback={<RouteLoadingFallback />}>
                  <Gallery />
                </Suspense>
              )}
            />
            <Route
              path="/artwork/:slug"
              element={(
                <Suspense fallback={<RouteLoadingFallback />}>
                  <ArtworkDetail />
                </Suspense>
              )}
            />
            <Route
              path="/about"
              element={(
                <Suspense fallback={<RouteLoadingFallback />}>
                  <About />
                </Suspense>
              )}
            />
            <Route
              path="/exhibitions"
              element={(
                <Suspense fallback={<RouteLoadingFallback />}>
                  <Exhibitions />
                </Suspense>
              )}
            />
            <Route
              path="/contact"
              element={(
                <Suspense fallback={<RouteLoadingFallback />}>
                  <Contact />
                </Suspense>
              )}
            />
          </Route>

          <Route
            path="/admin/login"
            element={(
              <Suspense fallback={<RouteLoadingFallback />}>
                <Login />
              </Suspense>
            )}
          />
          <Route element={<ProtectedRoute />}>
            <Route
              element={(
                <Suspense fallback={<RouteLoadingFallback />}>
                  <AdminLayout />
                </Suspense>
              )}
            >
              <Route
                path="/admin"
                element={(
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <Dashboard />
                  </Suspense>
                )}
              />
              <Route
                path="/admin/artworks"
                element={(
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <ArtworksManager />
                  </Suspense>
                )}
              />
              <Route
                path="/admin/exhibitions"
                element={(
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <ExhibitionsManager />
                  </Suspense>
                )}
              />
              <Route
                path="/admin/about"
                element={(
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <AboutManager />
                  </Suspense>
                )}
              />
              <Route
                path="/admin/messages"
                element={(
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <MessagesManager />
                  </Suspense>
                )}
              />
              <Route
                path="/admin/settings"
                element={(
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <Settings />
                  </Suspense>
                )}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
