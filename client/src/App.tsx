import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from '@/lib/queryClient';
import ScrollToTop from '@/components/ScrollToTop';

import { PublicLayout } from '@/components/public/PublicLayout';
import Home from '@/pages/public/Home';
import Gallery from '@/pages/public/Gallery';
import ArtworkDetail from '@/pages/public/ArtworkDetail';
import About from '@/pages/public/About';
import Exhibitions from '@/pages/public/Exhibitions';
import Contact from '@/pages/public/Contact';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import Login from '@/pages/admin/Login';
import Dashboard from '@/pages/admin/Dashboard';
import ArtworksManager from '@/pages/admin/ArtworksManager';
import ExhibitionsManager from '@/pages/admin/ExhibitionsManager';
import AboutManager from '@/pages/admin/AboutManager';
import MessagesManager from '@/pages/admin/MessagesManager';
import Settings from '@/pages/admin/Settings';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/artwork/:slug" element={<ArtworkDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/exhibitions" element={<Exhibitions />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          <Route path="/admin/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/artworks" element={<ArtworksManager />} />
              <Route path="/admin/exhibitions" element={<ExhibitionsManager />} />
              <Route path="/admin/about" element={<AboutManager />} />
              <Route path="/admin/messages" element={<MessagesManager />} />
              <Route path="/admin/settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
