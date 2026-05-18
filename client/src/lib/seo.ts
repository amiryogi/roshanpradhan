export const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') ||
  'https://roshanpradhan.vercel.app';

export const DEFAULT_OG_IMAGE = `${SITE_URL}/art3.jpeg`;

export const SOCIAL_PROFILES = [
  'https://instagram.com/your_profile',
  'https://facebook.com/your_profile',
];

export const ARTIST_NAME = 'Roshan Pradhan';

export const absoluteUrl = (path = '/'): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
};

export const trimText = (value: string, max = 160): string => {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trim()}...`;
};
