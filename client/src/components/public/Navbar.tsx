import { Link, NavLink } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { About, Artwork, Exhibition, PaginatedResponse } from '@/types';
import { getOptimizedImageUrl } from '@/lib/image';

const links = [
  { to: '/', label: 'Home' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/exhibitions', label: 'Exhibitions' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const queryClient = useQueryClient();
  const prefetchedRoutesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const prefetchRoute = useCallback(
    (route: string) => {
      if (prefetchedRoutesRef.current.has(route)) return;
      prefetchedRoutesRef.current.add(route);

      if (route === '/gallery') {
        void import('@/pages/public/Gallery');
        void queryClient.prefetchQuery({
          queryKey: ['artworks', ''],
          queryFn: async () => {
            const res = await api.get('/artworks?limit=24');
            return res.data.data as PaginatedResponse<Artwork>;
          },
          staleTime: 1000 * 60 * 5,
        });
      }

      if (route === '/about') {
        void import('@/pages/public/About');
        void queryClient.fetchQuery({
          queryKey: ['about'],
          queryFn: async () => (await api.get('/about')).data.data as About,
          staleTime: 1000 * 60 * 5,
        }).then((aboutData) => {
          const profileUrl = aboutData?.profileImage?.url;
          if (!profileUrl) return;

          const optimizedProfileUrl = getOptimizedImageUrl(profileUrl, {
            width: 720,
            quality: 'auto',
            crop: 'limit',
          });

          const preloader = new Image();
          preloader.decoding = 'async';
          preloader.src = optimizedProfileUrl;
        }).catch(() => {
          prefetchedRoutesRef.current.delete(route);
        });
      }

      if (route === '/exhibitions') {
        void import('@/pages/public/Exhibitions');
        void queryClient.prefetchQuery({
          queryKey: ['exhibitions'],
          queryFn: async () => (await api.get('/exhibitions')).data.data as Exhibition[],
          staleTime: 1000 * 60 * 5,
        });
      }

      if (route === '/contact') {
        void import('@/pages/public/Contact');
      }
    },
    [queryClient]
  );

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-500',
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-black/5'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="group flex items-center gap-3">
          {/* Gold decorative mark */}
          <span className="inline-block w-8 h-8 rounded-sm bg-gradient-to-br from-gold to-gold-dark rotate-45 transition-transform duration-300 group-hover:rotate-[135deg]" />
          <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
            Roshan<span className="text-gold ml-1.5">Pradhan</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onMouseEnter={() => prefetchRoute(l.to)}
              onFocus={() => prefetchRoute(l.to)}
              onTouchStart={() => prefetchRoute(l.to)}
              className={({ isActive }) =>
                cn(
                  'relative px-4 py-2 text-sm font-medium tracking-wide uppercase transition-colors duration-300',
                  isActive
                    ? 'text-gold'
                    : 'text-muted-foreground hover:text-foreground'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-gold to-gold-light rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <button
          className="md:hidden p-2 text-foreground hover:text-gold transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-500 ease-in-out',
          open ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <nav className="bg-background/95 backdrop-blur-xl border-t border-border/50">
          <div className="container py-6 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onMouseEnter={() => prefetchRoute(l.to)}
                onFocus={() => prefetchRoute(l.to)}
                onTouchStart={() => prefetchRoute(l.to)}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-3 text-sm font-medium uppercase tracking-wide rounded-lg transition-all duration-200',
                    isActive
                      ? 'text-gold bg-gold/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};
