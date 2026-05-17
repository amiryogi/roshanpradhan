import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Artwork, PaginatedResponse } from '@/types';
import { ArtworkCard } from '@/components/public/ArtworkCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function Gallery() {
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['artworks', search],
    queryFn: async () => {
      const res = await api.get(`/artworks?limit=24${search ? `&search=${search}` : ''}`);
      return res.data.data as PaginatedResponse<Artwork>;
    },
  });

  return (
    <div className="page-enter">
      {/* Page Header */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-transparent" />
        <div className="relative container">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold mb-3 animate-fade-up">
            Browse Collection
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4 animate-fade-up delay-100">
            Gallery
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mb-8 animate-fade-up delay-200">
            Explore the complete body of work — from early explorations to recent masterpieces.
          </p>

          {/* Search with icon */}
          <div className="relative max-w-md animate-fade-up delay-300">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search artworks by title, medium..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card/50 border-border/50 focus:border-gold/50 focus:ring-gold/20 rounded-full"
            />
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="container pb-20">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : data?.artworks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl font-serif text-muted-foreground mb-2">No artworks found</p>
            <p className="text-sm text-muted-foreground/60">Try adjusting your search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data?.artworks.map((a, i) => (
              <div key={a._id} style={{ animationDelay: `${i * 80}ms` }}>
                <ArtworkCard artwork={a} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
