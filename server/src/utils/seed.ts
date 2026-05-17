import mongoose from 'mongoose';
import path from 'path';
import { promises as fs } from 'fs';
import { env } from '../config/env';
import { User } from '../models/User';
import { About } from '../models/About';
import { Artwork } from '../models/Artwork';
import { uploadToCloudinary } from '../services/cloudinary.service';

interface ArtworkSeedItem {
  fileName: string;
  title: string;
  description: string;
  category: string;
  medium: string;
  dimensions: string;
  year: number;
  isFeatured?: boolean;
  tags: string[];
}

const ARTWORK_SEEDS: ArtworkSeedItem[] = [
  {
    fileName: 'bio_image_01.jpg',
    title: 'Unconquerable Soul',
    description:
      'A symbolic figurative work exploring resilience, transformation, and the human spirit against mechanical and mythic forces.',
    category: 'Mythic Figurative',
    medium: 'Acrylic on canvas',
    dimensions: '',
    year: 2024,
    isFeatured: true,
    tags: ['figurative', 'myth', 'symbolism'],
  },
  {
    fileName: 'bio_image_02.jpg',
    title: 'Tudaal',
    description:
      'A dynamic narrative composition rooted in Himalayan visual language and contemporary form.',
    category: 'Contemporary Mythology',
    medium: 'Acrylic on canvas',
    dimensions: '',
    year: 2024,
    isFeatured: true,
    tags: ['contemporary', 'narrative', 'himalayan'],
  },
  {
    fileName: 'bio_image_03.jpg',
    title: 'Inner Power',
    description:
      'An exploration of force, devotion, and spiritual duality expressed through layered iconography.',
    category: 'Spiritual Expression',
    medium: 'Acrylic on canvas',
    dimensions: '',
    year: 2024,
    tags: ['spiritual', 'iconography', 'energy'],
  },
  {
    fileName: 'bio_image_04.jpg',
    title: 'A New World',
    description:
      'A reimagined world where tradition and modernity intersect through surreal symbols and movement.',
    category: 'Surreal Figurative',
    medium: 'Acrylic on canvas',
    dimensions: '',
    year: 2024,
    tags: ['surreal', 'tradition', 'modernity'],
  },
  {
    fileName: 'bio_image_05.jpg',
    title: 'Effects of Artificial World',
    description:
      'A critical visual meditation on technology, identity, and the shifting realities of contemporary life.',
    category: 'Conceptual',
    medium: 'Acrylic on canvas',
    dimensions: '',
    year: 2024,
    tags: ['conceptual', 'technology', 'identity'],
  },
  {
    fileName: 'bio_image_06.jpg',
    title: 'The Mask',
    description:
      'A theatrical and symbolic interpretation of hidden selves, ritual, and cultural memory.',
    category: 'Symbolic Figurative',
    medium: 'Acrylic on canvas',
    dimensions: '',
    year: 2024,
    tags: ['mask', 'ritual', 'identity'],
  },
  {
    fileName: 'bio_image_07.jpg',
    title: 'The God',
    description:
      'A contemporary deity form connecting sacred narratives to present-day human experience.',
    category: 'Sacred Contemporary',
    medium: 'Acrylic on canvas',
    dimensions: '',
    year: 2024,
    tags: ['deity', 'sacred', 'mythic'],
  },
];

const ROOT_DIR = path.resolve(__dirname, '../../..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'client', 'public');
const BIO_TEXT_PATH = path.join(ROOT_DIR, 'bio_extracted.txt');
const PROFILE_IMAGE_PATH = path.join(PUBLIC_DIR, 'Rupesh.jpeg');

interface ParsedBioData {
  name: string;
  dateOfBirth: string;
  gender: string;
  fatherName: string;
  address: string;
  country: string;
  email: string;
  roles: string[];
  education: string;
  achievements: string[];
  soloExhibitions: string[];
  selectedGroupExhibitions: string[];
  travel: string;
}

const readOptionalText = async (filePath: string): Promise<string> => {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch {
    return '';
  }
};

const normalizeBioText = (raw: string): string => {
  return raw
    .replace(/__+/g, '')
    .replace(/\\([()\-.])/g, '$1')
    .replace(/`/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/ΓÇ£|ΓÇ¥/g, '"')
    .replace(/ΓÇÖ/g, "'")
    .replace(/\s+\n/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

const parseLabeledValue = (line: string, labels: string[]): string => {
  const lower = line.toLowerCase();
  for (const label of labels) {
    const normalized = label.toLowerCase();
    if (lower.startsWith(`${normalized} :`) || lower.startsWith(`${normalized}:`)) {
      return line.slice(line.indexOf(':') + 1).trim();
    }
  }
  return '';
};

const parseBioData = (rawText: string): ParsedBioData => {
  const cleaned = normalizeBioText(rawText);
  const lines = cleaned
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^-\s*/, '').trim());

  const data: ParsedBioData = {
    name: '',
    dateOfBirth: '',
    gender: '',
    fatherName: '',
    address: '',
    country: '',
    email: '',
    roles: [],
    education: '',
    achievements: [],
    soloExhibitions: [],
    selectedGroupExhibitions: [],
    travel: '',
  };

  let section: '' | 'achievements' | 'solo' | 'group' | 'travel' = '';

  for (const line of lines) {
    const lower = line.toLowerCase();

    if (lower === 'personal achievement:' || lower === 'personal achievement') {
      section = 'achievements';
      continue;
    }
    if (lower === 'solo exhibition' || lower === 'solo exhibition:') {
      section = 'solo';
      continue;
    }
    if (
      lower === 'selected group art exhibitions' ||
      lower === 'selected group art exhibitions:'
    ) {
      section = 'group';
      continue;
    }
    if (lower === 'travel' || lower === 'travel:') {
      section = 'travel';
      continue;
    }

    const name = parseLabeledValue(line, ['Name']);
    if (name) {
      data.name = name;
      section = '';
      continue;
    }

    const dob = parseLabeledValue(line, ['Date of Birth']);
    if (dob) {
      data.dateOfBirth = dob;
      section = '';
      continue;
    }

    const gender = parseLabeledValue(line, ['Gender', 'Gendar']);
    if (gender) {
      data.gender = gender;
      section = '';
      continue;
    }

    const father = parseLabeledValue(line, ["Father's name", 'Fathers name', 'Father name']);
    if (father) {
      data.fatherName = father;
      section = '';
      continue;
    }

    const address = parseLabeledValue(line, ['Address', 'Adress']);
    if (address) {
      data.address = address;
      section = '';
      continue;
    }

    const country = parseLabeledValue(line, ['Country']);
    if (country) {
      data.country = country;
      section = '';
      continue;
    }

    const education = parseLabeledValue(line, ['Education']);
    if (education) {
      data.education = education;
      section = '';
      continue;
    }

    const emailMatch = line.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    if (emailMatch) {
      data.email = emailMatch[0];
      continue;
    }

    if (section === 'achievements') {
      data.achievements.push(line);
      continue;
    }

    if (section === 'solo') {
      data.soloExhibitions.push(line);
      continue;
    }

    if (section === 'group') {
      data.selectedGroupExhibitions.push(line);
      continue;
    }

    if (section === 'travel') {
      data.travel = data.travel ? `${data.travel} ${line}` : line;
      continue;
    }

    if (
      lower.includes('director of') ||
      lower.includes('founder member') ||
      lower.includes('representative') ||
      lower.includes('arts group')
    ) {
      data.roles.push(line);
    }
  }

  return data;
};

const sanitizeList = (items: string[]): string[] => {
  const seen = new Set<string>();
  const out: string[] = [];

  for (const item of items) {
    const normalized = item
      .replace(/^[-*]\s*/, '')
      .replace(/[ \t]{2,}/g, ' ')
      .trim();
    if (!normalized) continue;

    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(normalized);
  }

  return out;
};

const maybeUploadImage = async (
  filePath: string,
  folder: string
): Promise<{ url: string; publicId: string } | null> => {
  try {
    const buffer = await fs.readFile(filePath);
    return await uploadToCloudinary(buffer, folder);
  } catch (error) {
    console.warn(`⚠️  Skipping upload for ${path.basename(filePath)}:`, error);
    return null;
  }
};

const seedAbout = async (): Promise<void> => {
  const rawBio = await readOptionalText(BIO_TEXT_PATH);
  const cleanedBio = normalizeBioText(rawBio);
  const parsed = parseBioData(rawBio);

  const achievements = sanitizeList(parsed.achievements);
  const soloExhibitions = sanitizeList(parsed.soloExhibitions);
  const selectedExhibitions = sanitizeList(parsed.selectedGroupExhibitions);
  const roles = sanitizeList(parsed.roles);

  const bioSummary = [
    parsed.name ? `${parsed.name} is a contemporary visual artist from Nepal.` : '',
    parsed.dateOfBirth ? `Born on ${parsed.dateOfBirth}.` : '',
    parsed.address || parsed.country
      ? `Based in ${[parsed.address, parsed.country].filter(Boolean).join(', ')}.`
      : '',
    parsed.education ? `Education: ${parsed.education}` : '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  const statement = [
    'Roshan Pradhan explores mythology, identity, and social transformation through contemporary figurative language.',
    'His paintings weave spiritual symbols with modern anxieties, creating narratives that connect traditional iconography with present-day realities.',
  ].join(' ');

  const cvLines: string[] = [];

  if (parsed.name) cvLines.push(`Name: ${parsed.name}`);
  if (parsed.dateOfBirth) cvLines.push(`Date of Birth: ${parsed.dateOfBirth}`);
  if (parsed.gender) cvLines.push(`Gender: ${parsed.gender}`);
  if (parsed.fatherName) cvLines.push(`Father's Name: ${parsed.fatherName}`);
  if (parsed.address) cvLines.push(`Address: ${parsed.address}`);
  if (parsed.country) cvLines.push(`Country: ${parsed.country}`);
  if (parsed.email) cvLines.push(`Email: ${parsed.email}`);

  if (roles.length) {
    cvLines.push('', 'Professional Roles');
    for (const item of roles) cvLines.push(`- ${item}`);
  }

  if (parsed.education) {
    cvLines.push('', 'Education', `- ${parsed.education}`);
  }

  if (achievements.length) {
    cvLines.push('', 'Personal Achievements');
    for (const item of achievements) cvLines.push(`- ${item}`);
  }

  if (soloExhibitions.length) {
    cvLines.push('', 'Solo Exhibitions');
    for (const item of soloExhibitions) cvLines.push(`- ${item}`);
  }

  if (selectedExhibitions.length) {
    cvLines.push('', 'Selected Group Art Exhibitions');
    for (const item of selectedExhibitions) cvLines.push(`- ${item}`);
  }

  if (parsed.travel) {
    cvLines.push('', `Travel: ${parsed.travel}`);
  }

  const cvText = cvLines.join('\n').trim() || cleanedBio;

  const existingAbout = await About.findOne();
  let profileImage = existingAbout?.profileImage;
  if (!profileImage?.url) {
    const uploaded = await maybeUploadImage(
      PROFILE_IMAGE_PATH,
      'artist-portfolio/profile'
    );
    if (uploaded) profileImage = uploaded;
  }

  await About.findOneAndUpdate(
    {},
    {
      bio: bioSummary || cleanedBio,
      statement,
      cv: cvText,
      profileImage,
      email: parsed.email,
      phone: existingAbout?.phone || '',
      socialLinks: existingAbout?.socialLinks || {},
    },
    { upsert: true, new: true }
  );

  console.log('✅ About data seeded');
};

const seedArtworks = async (): Promise<void> => {
  for (const item of ARTWORK_SEEDS) {
    const existing = await Artwork.findOne({ title: item.title });
    let images = existing?.images || [];

    if (images.length === 0) {
      const uploaded = await maybeUploadImage(
        path.join(PUBLIC_DIR, item.fileName),
        'artist-portfolio/artworks'
      );
      if (!uploaded) {
        console.warn(`⚠️  Artwork skipped (missing image): ${item.title}`);
        continue;
      }
      images = [uploaded];
    }

    const payload = {
      title: item.title,
      description: item.description,
      category: item.category,
      medium: item.medium,
      dimensions: item.dimensions,
      year: item.year,
      price: null,
      isForSale: false,
      isFeatured: item.isFeatured ?? false,
      images,
      tags: item.tags,
    };

    if (existing) {
      await Artwork.findByIdAndUpdate(existing._id, payload, { new: true });
      console.log(`♻️  Artwork updated: ${item.title}`);
    } else {
      await Artwork.create(payload);
      console.log(`✅ Artwork created: ${item.title}`);
    }
  }
};

const ADMIN_ACCOUNTS = [
  { email: 'roshanhanger71@gmail.com', password: 'Admin@123', name: 'Roshan Pradhan' },
  { email: 'amir@gmail.com',           password: 'Admin@123', name: 'Amir' },
];

const seedAdmins = async (): Promise<void> => {
  for (const account of ADMIN_ACCOUNTS) {
    const existing = await User.findOne({ email: account.email });
    if (existing) {
      console.log(`⚠️  Admin already exists: ${account.email}`);
    } else {
      await User.create({ ...account, role: 'admin' });
      console.log(`✅ Admin created: ${account.email}`);
    }
  }
};

const seed = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await seedAdmins();

    await seedAbout();
    await seedArtworks();

    await mongoose.disconnect();
    console.log('✅ Seeding done');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seed();
