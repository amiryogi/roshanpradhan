interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  quality?: number | 'auto' | 'auto:good' | 'auto:best';
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  crop?: 'limit' | 'fill' | 'fit' | 'scale';
  dpr?: number | 'auto';
}

const CLOUDINARY_UPLOAD_SEGMENT = '/upload/';

export const isCloudinaryUrl = (url: string): boolean => {
  return url.includes('res.cloudinary.com') && url.includes(CLOUDINARY_UPLOAD_SEGMENT);
};

export const getOptimizedImageUrl = (
  url: string,
  {
    width,
    height,
    quality = 'auto:good',
    format = 'auto',
    crop = 'limit',
    dpr = 'auto',
  }: CloudinaryTransformOptions = {}
): string => {
  if (!isCloudinaryUrl(url)) return url;

  const [prefix, suffix] = url.split(CLOUDINARY_UPLOAD_SEGMENT);
  if (!prefix || !suffix) return url;

  const transformParts = [`f_${format}`, `q_${quality}`, `c_${crop}`, `dpr_${dpr}`];
  if (width) transformParts.push(`w_${Math.round(width)}`);
  if (height) transformParts.push(`h_${Math.round(height)}`);

  const normalizedSuffix = suffix.replace(/^\/+/, '');
  return `${prefix}${CLOUDINARY_UPLOAD_SEGMENT}${transformParts.join(',')}/${normalizedSuffix}`;
};

export const getCloudinarySrcSet = (
  url: string,
  widths: number[],
  options: Omit<CloudinaryTransformOptions, 'width'> = {}
): string | undefined => {
  if (!isCloudinaryUrl(url)) return undefined;

  return widths
    .map((width) => `${getOptimizedImageUrl(url, { ...options, width })} ${width}w`)
    .join(', ');
};
