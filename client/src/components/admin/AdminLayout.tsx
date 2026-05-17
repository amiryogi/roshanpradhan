import { Link, NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Image, Calendar, User, Mail, LogOut, ChevronRight, Settings } from 'lucide-react';
import { useLogout } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/artworks', label: 'Artworks', icon: Image },
  { to: '/admin/exhibitions', label: 'Exhibitions', icon: Calendar },
  { to: '/admin/about', label: 'About Data', icon: User },
  { to: '/admin/messages', label: 'Messages', icon: Mail },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export const AdminLayout = () => {
  const logout = useLogout();

  return (
    <div className="min-h-screen flex bg-background text-foreground font-sans selection:bg-pink-halo/30 selection:text-white">
      {/* ─── Sidebar ─── */}
      <aside className="w-72 flex flex-col border-r border-border/50 bg-card/30 backdrop-blur-xl relative z-10">
        
        {/* Brand Area */}
        <div className="h-20 flex items-center px-8 border-b border-border/50">
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-halo to-brass flex items-center justify-center shadow-lg shadow-pink-halo/20 group-hover:shadow-pink-halo/40 transition-shadow">
              <div className="w-3 h-3 rounded-full bg-slate" />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-white group-hover:text-pink-halo transition-colors">
              Studio CMS
            </span>
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">Management</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 group',
                  isActive 
                    ? 'bg-pink-halo/10 text-pink-halo border border-pink-halo/20 shadow-inner' 
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <item.icon className={cn("h-5 w-5 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
                    {item.label}
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4 animate-fade-in" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        
        {/* Footer / Logout */}
        <div className="p-4 border-t border-border/50 bg-black/10">
          <Button 
            variant="ghost" 
            className="w-full justify-start rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-12" 
            onClick={logout}
          >
            <LogOut className="h-5 w-5 mr-3" /> 
            Sign Out
          </Button>
        </div>
      </aside>

      {/* ─── Main Content Area ─── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top ambient glow */}
        <div className="absolute top-0 left-1/4 right-0 h-[300px] bg-pink-halo/5 rounded-full blur-[100px] pointer-events-none -z-10" />
        
        {/* Topbar for context */}
        <header className="h-20 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Admin</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="rounded-full border-border/50 text-xs" asChild>
              <Link to="/" target="_blank">View Live Site</Link>
            </Button>
          </div>
        </header>

        {/* Scrollable page content */}
        <div className="flex-1 overflow-auto p-8 lg:p-12 z-0">
          <div className="max-w-6xl mx-auto animate-fade-up">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};
