import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
const supported = new Set(['.jpg', '.jpeg']);

const listInputFiles = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listInputFiles(absolute)));
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (supported.has(ext)) files.push(absolute);
  }

  return files;
};

const toKb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

const optimizeFile = async (inputPath) => {
  const ext = path.extname(inputPath);
  const base = inputPath.slice(0, -ext.length);
  const webpPath = `${base}.webp`;
  const avifPath = `${base}.avif`;

  const source = sharp(inputPath);
  const metadata = await source.metadata();

  // Keep pixel dimensions, but use modern codecs with tuned quality settings.
  await source
    .clone()
    .webp({ quality: 78, effort: 5 })
    .toFile(webpPath);

  await source
    .clone()
    .avif({ quality: 52, effort: 6 })
    .toFile(avifPath);

  const srcStat = await stat(inputPath);
  const webpStat = await stat(webpPath);
  const avifStat = await stat(avifPath);

  const rel = path.relative(publicDir, inputPath).replaceAll('\\', '/');
  console.log(
    `${rel} (${metadata.width}x${metadata.height}) -> webp ${toKb(webpStat.size)}, avif ${toKb(avifStat.size)} (src ${toKb(srcStat.size)})`
  );
};

const main = async () => {
  const files = await listInputFiles(publicDir);
  if (!files.length) {
    console.log('No JPG/JPEG files found in public/.');
    return;
  }

  for (const file of files) {
    await optimizeFile(file);
  }

  console.log(`Optimized ${files.length} image(s).`);
};

main().catch((error) => {
  console.error('Image optimization failed:', error);
  process.exitCode = 1;
});
