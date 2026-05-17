import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { Artwork, PaginatedResponse } from '@/types';
import { ArtworkCard } from '@/components/public/ArtworkCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, ChevronRight } from 'lucide-react';

export default function Home() {
  const { data } = useQuery({
    queryKey: ['artworks', 'featured'],
    queryFn: async () => {
      const res = await api.get('/artworks?featured=true&limit=6');
      return res.data.data as PaginatedResponse<Artwork>;
    },
  });

  return (
    <div className="relative">
      {/* ─── Immersive Ethereal Hero ─── */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
        {/* Abstract Ethereal Background based on art3 */}
        <div className="absolute inset-0 bg-background overflow-hidden pointer-events-none">
          {/* Main Background Art */}
          <div className="absolute inset-0 opacity-[0.15] mix-blend-screen scale-110">
            <img src="/art3.jpeg" alt="" className="w-full h-full object-cover" />
          </div>

          {/* Ambient glowing orbs (representing the halos) */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-pink-halo/20 rounded-full blur-[100px] animate-float-slow" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-sage/20 rounded-full blur-[120px] animate-float-slow delay-300" />
          <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-brass/10 rounded-full blur-[80px] animate-pulse" />

          {/* Gradient overlays to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-background/20 to-background/80" />
        </div>

        <div className="relative container grid lg:grid-cols-2 gap-12 lg:gap-8 items-center pt-20 pb-16 z-10">
          
          {/* Left Column: Typography & CTA */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-pink-halo/20 bg-pink-halo/5 backdrop-blur-md animate-fade-up">
              <Sparkles className="w-4 h-4 text-pink-halo" />
              <span className="text-sm font-medium tracking-wide text-foreground/80">New Exhibition 2026</span>
            </div>

            <div className="space-y-4 animate-fade-up delay-100">
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] tracking-tight">
                Mythology <br className="hidden sm:block"/>
                <span className="italic font-normal text-muted-foreground">&</span> <span className="text-gradient-ethereal">Surrealism</span>
              </h1>
              <p className="text-lg md:text-xl text-foreground/70 max-w-lg leading-relaxed pt-2">
                Step into the visionary world of Roshan Pradhan. A confluence of ancient deities, mechanical gears, and ethereal realms.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 animate-fade-up delay-200">
              <Button asChild size="lg" className="rounded-full px-8 bg-foreground hover:bg-foreground/90 text-background font-semibold h-14 group">
                <Link to="/gallery">
                  Explore Portfolio 
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="rounded-full px-8 h-14 hover:bg-pink-halo/10 hover:text-pink-halo transition-colors">
                <Link to="/about">About the Artist</Link>
              </Button>
            </div>

            <div className="pt-8 flex items-center gap-6 text-sm text-muted-foreground animate-fade-up delay-300">
              <div className="flex flex-col">
                <span className="font-bold text-foreground text-2xl">15+</span>
                <span>Years Experience</span>
              </div>
              <div className="w-px h-10 bg-border/50" />
              <div className="flex flex-col">
                <span className="font-bold text-foreground text-2xl">50+</span>
                <span>Exhibitions Worldwide</span>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Hero Image */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-full animate-fade-up delay-300">
            {/* The halo effect behind image */}
            <div className="absolute inset-0 bg-pink-halo/10 rounded-full blur-3xl animate-glow-pulse-ethereal" />
            
            <div className="relative aspect-[4/5] lg:aspect-square rounded-[2.5rem] overflow-hidden glass-ethereal p-2">
              <div className="w-full h-full rounded-[2rem] overflow-hidden relative group">
                <img 
                  src="/art3.jpeg" 
                  alt="Featured Artwork" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate/80 via-slate/20 to-transparent opacity-80" />
                
                {/* Overlay Text */}
                <div className="absolute bottom-0 left-0 p-8">
                  <p className="text-pink-halo text-sm font-semibold tracking-widest uppercase mb-2">Featured Work</p>
                  <h3 className="font-serif text-3xl font-bold text-white mb-2">The Mechanical Deity</h3>
                  <Link to="/gallery" className="inline-flex items-center text-sm text-white/80 hover:text-white transition-colors">
                    View Details <ChevronRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Decorative Floating Gear/Ornament */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full border border-brass/30 bg-background/50 backdrop-blur-md flex items-center justify-center animate-spin-slow">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-brass/50" />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground animate-fade-up delay-500">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-muted-foreground to-transparent" />
        </div>
      </section>

      {/* ─── Statement Banner ─── */}
      <section className="border-y border-border/50 bg-card/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/art3.jpeg')] opacity-[0.03] mix-blend-luminosity bg-cover bg-fixed" />
        <div className="container py-24 relative z-10 text-center max-w-4xl">
          <Sparkles className="w-8 h-8 text-brass mx-auto mb-8 opacity-50" />
          <h2 className="font-serif text-3xl md:text-5xl leading-tight text-foreground/90">
            "Art is the bridge between the <span className="text-pink-halo italic">divine mythology</span> of the past and the <span className="text-brass italic">mechanical reality</span> of our present."
          </h2>
          <p className="mt-8 text-muted-foreground uppercase tracking-widest text-sm">— Roshan Pradhan</p>
        </div>
      </section>

      {/* ─── Selected Works Grid ─── */}
      <section className="container py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-pink-halo" />
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-pink-halo">
                Curated Portfolio
              </p>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold">
              Selected Works
            </h2>
          </div>
          <Button asChild variant="outline" className="rounded-full border-border/50 hover:bg-sage/10 hover:border-sage/30 hover:text-foreground group">
            <Link to="/gallery">
              View All Collection 
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {data?.artworks.map((a, i) => (
            <div key={a._id} style={{ animationDelay: `${i * 150}ms` }} className="animate-fade-up">
              <ArtworkCard artwork={a} />
            </div>
          ))}
        </div>
      </section>

      {/* ─── Ethereal CTA ─── */}
      <section className="relative py-32 overflow-hidden mx-4 md:mx-12 lg:mx-20 mb-20 rounded-[3rem] glass-ethereal">
        <div className="absolute inset-0 bg-[url('/art3.jpeg')] opacity-10 bg-cover bg-center mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate/90 via-slate/60 to-slate/90" />
        
        <div className="relative container text-center z-10">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-white">
            Acquire a Masterpiece
          </h2>
          <p className="text-white/70 max-w-lg mx-auto mb-10 text-lg">
            Connect directly with the studio for commissions, available works, and exhibition opportunities.
          </p>
          <Button asChild size="lg" className="rounded-full px-10 h-14 bg-pink-halo text-slate font-bold hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(235,160,185,0.3)]">
            <Link to="/contact">
              Inquire Now
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
