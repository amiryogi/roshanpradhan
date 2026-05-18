import { useEffect } from 'react';
import { DEFAULT_OG_IMAGE, absoluteUrl } from '@/lib/seo';

interface SEOOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  robots?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const setMeta = (
  attribute: 'name' | 'property',
  key: string,
  value: string
): void => {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attribute, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
};

const setCanonical = (href: string): void => {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
};

const setJsonLd = (
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
): void => {
  const existing = document.getElementById('seo-jsonld');
  if (existing) existing.remove();
  if (!jsonLd) return;

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'seo-jsonld';
  script.textContent = JSON.stringify(jsonLd);
  document.head.appendChild(script);
};

export const useSEO = ({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  robots = 'index, follow',
  jsonLd,
}: SEOOptions): void => {
  useEffect(() => {
    const canonical = absoluteUrl(path);
    const shareImage = image || DEFAULT_OG_IMAGE;

    document.title = title;
    setCanonical(canonical);

    setMeta('name', 'description', description);
    setMeta('name', 'robots', robots);

    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:image', shareImage);

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', shareImage);

    setJsonLd(jsonLd);
  }, [title, description, path, image, type, robots, jsonLd]);
};
