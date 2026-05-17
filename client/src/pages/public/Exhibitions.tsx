import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Exhibition } from '@/types';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { MapPin, Calendar } from 'lucide-react';

export default function Exhibitions() {
  const { data } = useQuery({
    queryKey: ['exhibitions'],
    queryFn: async () => {
      const res = await api.get('/exhibitions');
      return res.data.data as Exhibition[];
    },
  });

  return (
    <div className="page-enter">
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-transparent" />
        <div className="relative container">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold mb-3 animate-fade-up">Shows & Events</p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4 animate-fade-up delay-100">Exhibitions</h1>
          <p className="text-muted-foreground text-lg max-w-xl animate-fade-up delay-200">A timeline of solo and group exhibitions across Nepal and beyond.</p>
        </div>
      </section>

      <section className="container pb-20 max-w-5xl">
        <div className="relative">
          <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-gold/40 via-border to-transparent hidden md:block" />
          <div className="space-y-12">
            {data?.map((ex, i) => (
              <div key={ex._id} className="relative md:pl-20 animate-fade-up" style={{ animationDelay: `${i * 120}ms` }}>
                <div className="absolute left-0 md:left-[26px] top-2 hidden md:block">
                  <div className="w-5 h-5 rounded-full border-2 border-gold bg-background flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gold" />
                  </div>
                </div>
                <div className="group rounded-2xl border border-border/50 bg-card/50 hover:bg-card hover:border-gold/20 transition-all duration-500 overflow-hidden">
                  <div className="grid md:grid-cols-5 gap-0">
                    {ex.coverImage?.url && (
                      <div className="md:col-span-2 overflow-hidden">
                        <img src={ex.coverImage.url} alt={ex.title} className="w-full h-full min-h-[200px] object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                    )}
                    <div className={`${ex.coverImage?.url ? 'md:col-span-3' : 'md:col-span-5'} p-6 md:p-8`}>
                      <Badge className={ex.status === 'past' ? 'bg-muted text-muted-foreground border-border/50 mb-3' : 'bg-gold/10 text-gold border-gold/30 mb-3'}>
                        {ex.status === 'past' ? 'Past' : 'Current'}
                      </Badge>
                      <h2 className="font-serif text-2xl font-bold mb-3 group-hover:text-gold transition-colors duration-300">{ex.title}</h2>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-muted-foreground mb-4">
                        <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-terracotta" />{ex.venue} · {ex.location}</span>
                        <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-gold" />{formatDate(ex.startDate)} – {formatDate(ex.endDate)}</span>
                      </div>
                      <p className="leading-relaxed text-foreground/80">{ex.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
