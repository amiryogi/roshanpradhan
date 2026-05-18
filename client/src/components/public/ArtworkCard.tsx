import { Link } from 'react-router-dom';
import { Artwork } from '@/types';
import { getCloudinarySrcSet, getOptimizedImageUrl } from '@/lib/image';

export const ArtworkCard = ({ artwork }: { artwork: Artwork }) => {
  const imageUrl = artwork.images[0]?.url;
  const optimizedSrc = imageUrl
    ? getOptimizedImageUrl(imageUrl, { width: 720, quality: 'auto:good', crop: 'limit' })
    : undefined;
  const srcSet = imageUrl
    ? getCloudinarySrcSet(imageUrl, [320, 480, 640, 720, 960], {
        quality: 'auto:good',
        crop: 'limit',
      })
    : undefined;

  return (
    <Link
      to={`/artwork/${artwork.slug}`}
      className="group block overflow-hidden rounded-xl animate-fade-up"
    >
      {/* Image container with overlay */}
      <div className="relative aspect-[4/5] overflow-hidden bg-muted rounded-xl">
        {optimizedSrc ? (
          <img
            src={optimizedSrc}
            srcSet={srcSet}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt={artwork.title}
            className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
          />
        ) : null}
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {/* Info revealed on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-gold mb-1">
            {artwork.category}
          </p>
          <h3 className="font-serif text-lg font-semibold text-white">
            {artwork.title}
          </h3>
          <p className="text-sm text-white/60 mt-1">
            {artwork.medium}, {artwork.year}
          </p>
        </div>
        {/* Corner accent */}
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-gold/0 group-hover:border-gold/60 transition-all duration-500 rounded-tr-sm" />
      </div>
      {/* Static info below image */}
      <div className="pt-4 pb-2">
        <h3 className="font-serif text-lg font-semibold group-hover:text-gold transition-colors duration-300">
          {artwork.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {artwork.medium}, {artwork.year}
        </p>
      </div>
    </Link>
  );
};
