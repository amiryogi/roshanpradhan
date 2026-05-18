import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, ArrowUpRight } from 'lucide-react';

const footerLinks = [
  { to: '/gallery', label: 'Gallery' },
  { to: '/exhibitions', label: 'Exhibitions' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export const Footer = () => (
  <footer className="relative mt-20 border-t border-border/50">
    {/* Warm gradient glow at top */}
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

    <div className="container py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
        {/* Brand */}
        <div className="space-y-4">
          <Link to="/" className="inline-block">
            <h3 className="font-serif text-2xl font-bold">
              Roshan<span className="text-gold ml-1.5">Pradhan</span>
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            Contemporary Nepalese artist exploring mythology, surrealism, and the human condition through oil and mixed media.
          </p>
        </div>

        {/* Navigation */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Navigate
          </h4>
          <nav className="flex flex-col gap-2">
            {footerLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {l.label}
                <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
              </Link>
            ))}
          </nav>
        </div>

        {/* Social */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Connect
          </h4>
          <div className="flex gap-3">
            {[
              { icon: Instagram, href: 'https://www.instagram.com/roshanartist_?igsh=ZzdmM3c3bmtuNzI4', label: 'Instagram' },
              { icon: Facebook, href: 'https://www.facebook.com/share/16rCv4VrdW/?mibextid=wwXIfr', label: 'Facebook' },
              { icon: Mail, href: 'https://mail.google.com/mail/?view=cm&fs=1&to=roshanhanger71@gmail.com', label: 'Email' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                aria-label={label}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-border/50 text-muted-foreground hover:text-gold hover:border-gold/50 hover:bg-gold/5 transition-all duration-300"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-12 pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} Roshan Pradhan. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span className="text-xs text-muted-foreground/60">Kathmandu, Nepal</span>
        </div>
      </div>
    </div>
  </footer>
);
