import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import { api } from '@/lib/api';
import { Artwork } from '@/types';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { ARTIST_NAME, absoluteUrl, trimText } from '@/lib/seo';
import { getCloudinarySrcSet, getOptimizedImageUrl } from '@/lib/image';

export default function ArtworkDetail() {
  const { slug } = useParams();
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  const { data: artwork, isLoading } = useQuery({
    queryKey: ['artwork', slug],
    queryFn: async () => {
      const res = await api.get(`/artworks/${slug}`);
      return res.data.data as Artwork;
    },
  });

  const pagePath = `/artwork/${slug || ''}`;
  const pageTitle = artwork
    ? `${artwork.title} | ${ARTIST_NAME}`
    : `Artwork Detail | ${ARTIST_NAME}`;
  const pageDescription = artwork
    ? trimText(artwork.description, 155)
    : 'Explore detailed information about an original artwork by Roshan Pradhan.';

  const artworkSchema = artwork
    ? {
        '@context': 'https://schema.org',
        '@type': 'VisualArtwork',
        name: artwork.title,
        description: artwork.description,
        image: artwork.images.map((img) => img.url),
        artMedium: artwork.medium,
        genre: artwork.category,
        dateCreated: String(artwork.year),
        url: absoluteUrl(pagePath),
        creator: {
          '@type': 'Person',
          name: ARTIST_NAME,
        },
      }
    : undefined;

  useSEO({
    title: pageTitle,
    description: pageDescription,
    path: pagePath,
    image: artwork?.images?.[0]?.url,
    type: 'article',
    jsonLd: artworkSchema,
  });

  if (isLoading) return (
    <div className="container py-20 text-center">
      <div className="w-12 h-12 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" />
    </div>
  );
  if (!artwork) return <p className="container py-20 text-center text-muted-foreground">Not found</p>;

  const slides = artwork.images.map((img) => ({
    src: getOptimizedImageUrl(img.url, {
      width: 2200,
      quality: 'auto:best',
      crop: 'limit',
    }),
    alt: artwork.title,
  }));

  return (
    <div className="page-enter container py-12 max-w-6xl">
      <Link to="/gallery" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Gallery
      </Link>

      <div className="grid md:grid-cols-2 gap-12 md:gap-16">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground/90">Tap or click image to view fullscreen and zoom</p>
          {artwork.images.map((img, i) => (
            <button
              key={`${img.publicId}-${i}`}
              type="button"
              onClick={() => setLightboxIndex(i)}
              className="group block w-full rounded-2xl overflow-hidden bg-muted ring-1 ring-border/30 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
              aria-label={`Open ${artwork.title} image ${i + 1} in fullscreen zoom view`}
            >
              <img
                src={getOptimizedImageUrl(img.url, { width: 1280, quality: 'auto:good', crop: 'limit' })}
                srcSet={getCloudinarySrcSet(img.url, [480, 768, 1024, 1280, 1600], {
                  quality: 'auto:good',
                  crop: 'limit',
                })}
                sizes="(max-width: 768px) 100vw, 50vw"
                alt={artwork.title}
                className="w-full transition-transform duration-500 group-hover:scale-[1.02]"
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                fetchPriority={i === 0 ? 'high' : 'low'}
              />
            </button>
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

      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex >= 0 ? lightboxIndex : 0}
        slides={slides}
        plugins={[Zoom]}
        carousel={{ imageFit: 'contain' }}
        zoom={{ maxZoomPixelRatio: 3 }}
      />
    </div>
  );
}
