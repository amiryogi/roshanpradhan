import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Image, Calendar, Mail, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { data: artworks } = useQuery({
    queryKey: ['stats-artworks'],
    queryFn: async () => (await api.get('/artworks?limit=1')).data.data,
  });
  const { data: exhibitions } = useQuery({
    queryKey: ['stats-exhibitions'],
    queryFn: async () => (await api.get('/exhibitions')).data.data,
  });
  const { data: messages } = useQuery({
    queryKey: ['stats-messages'],
    queryFn: async () => (await api.get('/messages')).data.data,
  });

  const unread = messages?.filter((m: { isRead: boolean }) => !m.isRead).length || 0;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="font-serif text-4xl font-bold text-foreground mb-2">Welcome back, Roshan.</h1>
        <p className="text-muted-foreground text-lg">Here's what's happening with your portfolio today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Artworks Stat Card */}
        <Card className="relative overflow-hidden border-border/50 bg-card/40 backdrop-blur-md group hover:border-pink-halo/30 transition-colors duration-500 rounded-2xl">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Image className="w-24 h-24 text-pink-halo" />
          </div>
          <CardContent className="p-8 relative z-10">
            <div className="w-12 h-12 rounded-full bg-pink-halo/10 flex items-center justify-center mb-6">
              <Image className="h-6 w-6 text-pink-halo" />
            </div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-2">Total Artworks</p>
            <div className="flex items-end gap-4">
              <span className="text-5xl font-serif font-bold text-foreground">{artworks?.total || 0}</span>
              <Link to="/admin/artworks" className="flex items-center gap-1 text-sm text-pink-halo hover:underline mb-1">
                Manage <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Exhibitions Stat Card */}
        <Card className="relative overflow-hidden border-border/50 bg-card/40 backdrop-blur-md group hover:border-brass/30 transition-colors duration-500 rounded-2xl">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Calendar className="w-24 h-24 text-brass" />
          </div>
          <CardContent className="p-8 relative z-10">
            <div className="w-12 h-12 rounded-full bg-brass/10 flex items-center justify-center mb-6">
              <Calendar className="h-6 w-6 text-brass" />
            </div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-2">Exhibitions</p>
            <div className="flex items-end gap-4">
              <span className="text-5xl font-serif font-bold text-foreground">{exhibitions?.length || 0}</span>
              <Link to="/admin/exhibitions" className="flex items-center gap-1 text-sm text-brass hover:underline mb-1">
                Manage <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Messages Stat Card */}
        <Card className="relative overflow-hidden border-border/50 bg-card/40 backdrop-blur-md group hover:border-sage/30 transition-colors duration-500 rounded-2xl">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Mail className="w-24 h-24 text-sage" />
          </div>
          <CardContent className="p-8 relative z-10">
            <div className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center mb-6 relative">
              <Mail className="h-6 w-6 text-sage" />
              {unread > 0 && (
                <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-destructive border-2 border-card animate-pulse" />
              )}
            </div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-2">Unread Messages</p>
            <div className="flex items-end gap-4">
              <span className="text-5xl font-serif font-bold text-foreground">{unread}</span>
              <Link to="/admin/messages" className="flex items-center gap-1 text-sm text-sage hover:underline mb-1">
                Inbox <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action / Notice Area */}
      <div className="p-8 rounded-2xl border border-border/50 bg-gradient-to-br from-card/30 to-background flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
            <TrendingUp className="text-muted-foreground h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Portfolio Status</h3>
            <p className="text-sm text-muted-foreground">Your portfolio is live and functioning normally.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
