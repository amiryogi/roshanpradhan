import { useQuery } from '@tanstack/react-query';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { About as AboutType } from '@/types';
import {
  Award, Briefcase, GraduationCap, Globe, MapPin, Mail,
  Sparkles, Quote, Calendar,
} from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { ARTIST_NAME, SOCIAL_PROFILES, absoluteUrl } from '@/lib/seo';
import { getCloudinarySrcSet, getOptimizedImageUrl } from '@/lib/image';

// ─── Static bio data from bio.docx ──────────────────────────────────────────
const ROLES = [
  'Director of Pagoda Institute of Fine Arts, Tinkune Subhidanagar, Kathmandu',
  "Founder member of Pagoda Group — Nepalese Contemporary Artists' Guild",
  'DFEWA Representatives Worldwide, Nepal',
  'Fabriano In Acquarello, Italy — Country Representative, Nepal',
  'International Island Country Arts Group, Turkey',
];

const ACHIEVEMENTS = [
  { year: '2023', text: 'Lalitkala Special Award — Nepal Fine Art Academy' },
  { year: '2020', text: 'Creative Artist of the Year — Nanda Devi Khanal Lalitkala Smriti Award, Arupan Art Gallery, Nepal' },
  { year: '2015', text: 'Araniko Youth Award (Gold Medal) — National Youth Service Trust, Nepal' },
  { year: '2006', text: 'Expert Teacher Award — Fevicryl / Pidilite Industries Ltd.' },
  { year: '2005', text: 'Lalitkala Special Award — Nepal Fine Art Academy' },
];

const SOLO_EXHIBITIONS = [
  { year: '2014', title: '"Nodes Expression and Human Feelings"', venue: 'Nepal Art Council Gallery, Babar Mahal, Kathmandu' },
  { year: '2013', title: '"Hanger 2"', venue: 'Sakano Ueno Bijutsukan Art Gallery, Hokkaido, Japan' },
  { year: '2007', title: '"Hanger"', venue: 'Nepal Art Council Gallery, Babar Mahal, Kathmandu' },
];

const GROUP_EXHIBITIONS = [
  { year: '2026', text: 'Pagoda Group — Changing Times, Kala Salon Chhaya Center, Thamel' },
  { year: '2026', text: 'Hatyai International Art Camp, Thailand' },
  { year: '2025', text: '"Deities of Nepal II" — Nepal Art Council, Babar Mahal, Kathmandu' },
  { year: '2024', text: 'Kathmandu International Art Exhibition, San Pablo City, Philippines' },
  { year: '2024', text: '"Reimagine: Himalayan Art Now" — 659 Wrightwood Gallery, Chicago' },
  { year: '2024', text: '"Reimagine: Himalayan Art Now" — Rubin Museum, New York, USA' },
  { year: '2023', text: '"A Tapestry of Voices" — Takpa Art Gallery' },
  { year: '2023', text: '"5th Global Friendship Art Festival Nepal" — Embassy of Bangladesh, Kathmandu' },
  { year: '2022', text: '"19th Asian Art Biennale" — Silpakala Academy, Bangladesh' },
  { year: '2022', text: '"Freedom and Love" — NCCA Gallery, Manila, Philippines' },
  { year: '2022', text: '"Himalayan Art Festival" — Nepal Art Council, Babar Mahal, Kathmandu' },
  { year: '2021', text: '"Art Unites" — Philippines & Nepal, FilArts & Pagoda Group' },
  { year: '2021', text: '"Looking Forward" — Loyola Marymount University, Los Angeles, California, USA' },
  { year: '2020', text: '"Asian Contemporary Art Exchange" — National Taiwan Art Education Center' },
  { year: '2020', text: '"Revived Emotion" — Ratchadamnoen Contemporary Art Center, Bangkok, Thailand' },
  { year: '2019', text: '"A Space for Freedom and Equality" — American Center, US Embassy, Nepal' },
  { year: '2019', text: '"Fabriano Acquarello in Arte Culturale" — International Watercolor Museum, Italy' },
  { year: '2018', text: '"Friendship Art Exhibition" — Arma Museum, Indonesia' },
  { year: '2018', text: '"3rd Tune of Art" International Art Festival — FOCUS, Bangladesh' },
  { year: '2017', text: '"Korea–Nepal Contemporary Art Exchange Exhibition" — Nepal Academy, Kathmandu' },
  { year: '2016', text: '"Buddhist Art Fair" — Beijing, China' },
  { year: '2014', text: '"Colour Passion" India–Nepal Friendship Exhibition — Jamini Roy Gallery, Kolkata' },
  { year: '2013', text: 'India–Nepal Art Workshop, Shantiniketan Bholpur, India' },
  { year: '2010', text: '"14th Asian Art Biennale" — Silpakala Academy, Bangladesh' },
  { year: '2010', text: '"Nepal–Bangladesh Art Exchange Exhibition" — Zenual Art Gallery, Bangladesh' },
  { year: '2003', text: '"Nepal–Japan Art Exhibition" — Fukuoka City, Japan' },
];

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: ARTIST_NAME,
  url: absoluteUrl('/about'),
  image: absoluteUrl('/Rupesh.jpeg'),
  jobTitle: 'Contemporary Nepalese Artist',
  sameAs: SOCIAL_PROFILES,
  description:
    'Biography and career highlights of Roshan Pradhan, a contemporary Nepalese visual artist.',
};

// ─── Animation variants ──────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const listItem: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

// ─── Section header helper ───────────────────────────────────────────────────
function SectionHeading({
  accent,
  icon: Icon,
  children,
}: {
  accent: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <div className={`w-12 h-px ${accent}`} />
      <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3 m-0">
        <Icon className={`w-7 h-7 ${accent.replace('bg-', 'text-')}`} />
        {children}
      </h2>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function About() {
  const art3ImageSet =
    "image-set(url('/art3.avif') type('image/avif'), url('/art3.webp') type('image/webp'), url('/art3.jpeg') type('image/jpeg'))";

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const [profileImageLoaded, setProfileImageLoaded] = useState(false);

  const { data } = useQuery({
    queryKey: ['about'],
    queryFn: async () => (await api.get('/about')).data.data as AboutType,
  });

  const profileSourceUrl = data?.profileImage?.url;
  const profileImageUrl = profileSourceUrl
    ? getOptimizedImageUrl(profileSourceUrl, {
      width: 720,
      quality: 'auto',
      crop: 'limit',
    })
    : undefined;

  const profileImageSrcSet = profileSourceUrl
    ? getCloudinarySrcSet(profileSourceUrl, [320, 480, 640, 720, 900], {
      quality: 'auto',
      crop: 'limit',
    })
    : undefined;

  const profileImageBlurUrl = profileSourceUrl
    ? getOptimizedImageUrl(profileSourceUrl, {
      width: 64,
      quality: 35,
      crop: 'limit',
    })
    : undefined;

  useEffect(() => {
    setProfileImageLoaded(false);
  }, [profileSourceUrl]);

  useSEO({
    title: 'About Roshan Pradhan | Artist Biography',
    description:
      'Learn about Roshan Pradhan, his artistic journey, awards, exhibitions, and contemporary visual practice rooted in mythology and surrealism.',
    path: '/about',
    image: absoluteUrl('/Rupesh.jpeg'),
    jsonLd: aboutSchema,
  });

  return (
    <div className="relative pb-24 overflow-x-hidden">

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative pt-32 pb-24 md:pt-44 md:pb-36 overflow-hidden border-b border-border/50">
        {/* Parallax background art */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 pointer-events-none"
        >
          <div
            className="absolute inset-0 opacity-[0.06] bg-cover bg-center"
            style={{ backgroundImage: art3ImageSet }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </motion.div>

        {/* Ambient orbs */}
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-pink-halo/10 rounded-full blur-[90px] animate-float-slow pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sage/10 rounded-full blur-[110px] animate-float-slow delay-500 pointer-events-none" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-brass/8 rounded-full blur-[70px] animate-pulse pointer-events-none" />

        <div className="relative container text-center z-10 max-w-3xl">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center gap-6"
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brass/25 bg-brass/5 text-xs font-semibold tracking-[0.2em] uppercase text-foreground/75">
                <Sparkles className="w-4 h-4 text-brass" />
                The Creator
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-serif text-5xl md:text-7xl font-bold leading-tight">
              Roshan <span className="text-gradient-ethereal italic">Pradhan</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Bridging the ancient and the modern — exploring the spiritual machinery of the human condition through contemporary figurative painting.
            </motion.p>

            {/* Stat strip */}
            <motion.div variants={fadeUp} className="flex items-center gap-8 pt-4 text-sm text-muted-foreground">
              <div className="flex flex-col items-center">
                <span className="font-bold text-foreground text-2xl font-serif">25+</span>
                <span>Years Active</span>
              </div>
              <div className="w-px h-10 bg-border/60" />
              <div className="flex flex-col items-center">
                <span className="font-bold text-foreground text-2xl font-serif">50+</span>
                <span>Exhibitions</span>
              </div>
              <div className="w-px h-10 bg-border/60" />
              <div className="flex flex-col items-center">
                <span className="font-bold text-foreground text-2xl font-serif">15+</span>
                <span>Countries</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Profile + Bio ────────────────────────────────────────────────── */}
      <section className="container mt-20 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">

          {/* ── Left: sticky profile ── */}
          <motion.div
            className="lg:col-span-5"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <div className="sticky top-28 space-y-6">
              {/* Profile image */}
              <div className="relative group">
                <div className="absolute -inset-3 bg-gradient-to-br from-pink-halo/20 via-transparent to-sage/20 rounded-3xl opacity-40 blur-xl transition-opacity duration-700 group-hover:opacity-80 pointer-events-none" />

                <div className="relative rounded-2xl overflow-hidden glass-ethereal p-[6px]">
                  {profileImageUrl ? (
                    <div className="relative rounded-xl overflow-hidden">
                      <div
                        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${profileImageLoaded ? 'opacity-0' : 'opacity-100 blur-lg scale-110'}`}
                        style={profileImageBlurUrl ? { backgroundImage: `url('${profileImageBlurUrl}')` } : undefined}
                      />
                      <motion.img
                        src={profileImageUrl}
                        srcSet={profileImageSrcSet}
                        sizes="(max-width: 1024px) 88vw, 34vw"
                        alt="Roshan Pradhan"
                        className={`w-full aspect-[4/5] object-cover rounded-xl transition-opacity duration-500 ${profileImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                        onLoad={() => setProfileImageLoaded(true)}
                        onError={() => setProfileImageLoaded(true)}
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-[4/5] rounded-xl bg-muted animate-pulse" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none" />
                </div>

                {/* Corner accents */}
                <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-brass/50 rounded-tl-xl pointer-events-none" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-brass/50 rounded-br-xl pointer-events-none" />
              </div>

              {/* Details card */}
              <div className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm divide-y divide-border/40 overflow-hidden">
                <div className="p-5 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Personal</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-brass flex-shrink-0" />
                      <span className="text-foreground/70">Born 17 July 1977</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-sage flex-shrink-0" />
                      <span className="text-foreground/70">Tinkune Subidhanagar-32, Kathmandu, Nepal</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-pink-halo flex-shrink-0" />
                      <a
                        href="mailto:roshanhanger71@gmail.com"
                        className="text-foreground/70 hover:text-foreground transition-colors break-all"
                      >
                        roshanhanger71@gmail.com
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-tiger flex-shrink-0" />
                      <span className="text-foreground/70">Nepal</span>
                    </div>
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Education</p>
                  <p className="text-sm text-foreground/80 font-medium">Master's Degree in Fine Arts</p>
                  <p className="text-xs text-muted-foreground">Tribhuvan University, Kirtipur, Nepal</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Right: narrative content ── */}
          <div className="lg:col-span-7 space-y-20">

            {/* Biography */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-px bg-pink-halo" />
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground m-0">Biography</h2>
              </div>
              <p className="text-lg leading-[1.85] text-foreground/80 first-letter:text-6xl first-letter:font-serif first-letter:text-pink-halo first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]">
                {data?.bio ||
                  'Roshan Pradhan is a contemporary visual artist from Nepal. Born on 17th July 1977, he is based in Tinkune Subidhanagar-32, Kathmandu, Nepal. He holds a Master\'s Degree in Fine Arts from Tribhuvan University, Kirtipur, Nepal.'}
              </p>
            </motion.div>

            {/* Artist Statement */}
            {(data?.statement) && (
              <motion.div
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                className="relative p-10 rounded-[2.5rem] glass-ethereal overflow-hidden"
              >
                <motion.div
                  className="absolute top-6 right-6 text-brass/10"
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Quote className="w-28 h-28" />
                </motion.div>
                <p className="text-xs font-semibold uppercase tracking-widest text-pink-halo mb-5 relative z-10">
                  Artist Statement
                </p>
                <blockquote className="relative z-10 font-serif text-2xl md:text-3xl leading-snug text-foreground/90 italic">
                  "{data.statement}"
                </blockquote>
              </motion.div>
            )}

            {/* Roles & Affiliations */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              <SectionHeading accent="bg-pink-halo" icon={Briefcase}>
                Roles &amp; Affiliations
              </SectionHeading>
              <motion.ul
                className="space-y-3"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
              >
                {ROLES.map((role, i) => (
                  <motion.li
                    key={i}
                    variants={listItem}
                    className="flex gap-4 p-5 rounded-2xl border border-border/50 bg-card/20 hover:bg-card/40 hover:border-pink-halo/20 transition-colors duration-300"
                  >
                    <span className="mt-[6px] flex-shrink-0 w-2.5 h-2.5 rounded-full border-2 border-pink-halo bg-pink-halo/10" />
                    <p className="text-foreground/80 leading-relaxed">{role}</p>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            {/* Achievements */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              <SectionHeading accent="bg-brass" icon={Award}>
                Awards &amp; Recognition
              </SectionHeading>
              <motion.div
                className="space-y-3"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
              >
                {ACHIEVEMENTS.map((item, i) => (
                  <motion.div
                    key={i}
                    variants={listItem}
                    className="group flex gap-5 p-5 rounded-2xl border border-border/50 bg-card/20 hover:bg-card/40 hover:border-brass/20 transition-colors duration-300"
                  >
                    <div className="flex-shrink-0 min-w-[3.5rem] text-center">
                      <span className="text-xs font-bold text-brass tracking-widest">{item.year}</span>
                    </div>
                    <div className="w-px bg-border/50 group-hover:bg-brass/30 transition-colors duration-300" />
                    <p className="text-foreground/80 leading-relaxed">{item.text}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Solo Exhibitions ─────────────────────────────────────────────── */}
      <motion.section
        className="container mt-28 max-w-7xl"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        <SectionHeading accent="bg-sage" icon={GraduationCap}>
          Solo Exhibitions
        </SectionHeading>
        <motion.div
          className="grid md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {SOLO_EXHIBITIONS.map((ex, i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
              className="relative p-7 rounded-2xl border border-border/50 bg-card/20 hover:bg-card/50 hover:border-sage/30 transition-colors duration-300 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-sage/80 to-sage/10 rounded-l-2xl" />
              <span className="block text-3xl font-serif font-bold text-sage/70 mb-3">{ex.year}</span>
              <h3 className="font-serif text-lg font-semibold text-foreground/90 mb-2 italic">{ex.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{ex.venue}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ─── Group Exhibitions ────────────────────────────────────────────── */}
      <motion.section
        className="container mt-20 pb-8 max-w-7xl"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        <SectionHeading accent="bg-brass" icon={Globe}>
          Selected Group Exhibitions
        </SectionHeading>

        <motion.div
          className="space-y-2"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {GROUP_EXHIBITIONS.map((ex, i) => (
            <motion.div
              key={i}
              variants={listItem}
              className="group flex items-baseline gap-5 px-5 py-4 rounded-xl border border-transparent hover:border-border/40 hover:bg-card/20 transition-colors duration-200"
            >
              <span className="flex-shrink-0 w-11 text-xs font-bold text-brass/80 tracking-widest text-right">
                {ex.year}
              </span>
              <div className="flex-shrink-0 mt-[1px] w-1.5 h-1.5 rounded-full bg-brass/30 group-hover:bg-brass/60 transition-colors duration-300" />
              <p className="text-foreground/75 group-hover:text-foreground/90 text-sm leading-relaxed transition-colors duration-200">
                {ex.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ─── Travel footer strip ──────────────────────────────────────────── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container max-w-7xl mt-10"
      >
        <div className="rounded-2xl border border-border/50 bg-card/20 px-7 py-5 flex flex-wrap items-center gap-4">
          <Globe className="w-5 h-5 text-sage flex-shrink-0" />
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">International Travel</span>
          <div className="h-px flex-1 bg-border/40 hidden sm:block" />
          <span className="text-sm text-foreground/70">India · Bangladesh · Thailand · Philippines · China</span>
        </div>
      </motion.div>
    </div>
  );
}
