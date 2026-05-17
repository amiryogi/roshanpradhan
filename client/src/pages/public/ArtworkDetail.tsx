import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { Artwork } from '@/types';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';

export default function ArtworkDetail() {
  const { slug } = useParams();
  const { data: artwork, isLoading } = useQuery({
    queryKey: ['artwork', slug],
    queryFn: async () => {
      const res = await api.get(`/artworks/${slug}`);
      return res.data.data as Artwork;
    },
  });

  if (isLoading) return (
    <div className="container py-20 text-center">
      <div className="w-12 h-12 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" />
    </div>
  );
  if (!artwork) return <p className="container py-20 text-center text-muted-foreground">Not found</p>;

  return (
    <div className="page-enter container py-12 max-w-6xl">
      <Link to="/gallery" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Gallery
      </Link>

      <div className="grid md:grid-cols-2 gap-12 md:gap-16">
        <div className="space-y-4">
          {artwork.images.map((img, i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-muted ring-1 ring-border/30">
              <img src={img.url} alt={artwork.title} className="w-full" />
            </div>
          ))}
        </div>

        <div className="md:sticky md:top-28 md:self-start">
          <Badge className="mb-4 bg-gold/10 text-gold border-gold/30">{artwork.category}</Badge>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">{artwork.title}</h1>
          <p className="text-muted-foreground mb-8">{artwork.medium}, {artwork.year}</p>
          <div className="divider-gold mb-8" />
          <p className="leading-relaxed text-foreground/85 mb-8">{artwork.description}</p>

          <dl className="space-y-4 border-t border-border/50 pt-6">
            <div className="flex justify-between items-center py-2">
              <dt className="text-sm text-muted-foreground">Dimensions</dt>
              <dd className="text-sm font-medium">{artwork.dimensions || 'N/A'}</dd>
            </div>
            <div className="flex justify-between items-center py-2 border-t border-border/30">
              <dt className="text-sm text-muted-foreground">Price</dt>
              <dd className="text-sm font-semibold text-gold">{formatPrice(artwork.price)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
