import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send, Mail, User, MessageSquare, MapPin, Phone } from 'lucide-react';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => api.post('/messages', data),
    onSuccess: () => {
      toast.success('Message sent! I\'ll get back to you soon.');
      reset();
    },
  });

  return (
    <div className="relative pb-24">
      {/* ─── Immersive Page Header ─── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-[url('/art3.jpeg')] opacity-5 mix-blend-overlay bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        
        {/* Floating ethereal orbs */}
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-brass/10 rounded-full blur-[80px] animate-float-slow" />

        <div className="relative container text-center z-10 max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-pink-halo mb-4 animate-fade-up">
            Get in Touch
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 animate-fade-up delay-100 leading-tight">
            Contact
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-fade-up delay-200">
            Interested in commissions, exhibitions, or collaborations? Send a message and I'll respond promptly.
          </p>
        </div>
      </section>

      {/* ─── Main Content ─── */}
      <section className="container mt-20 max-w-6xl">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          
          {/* Left Column: Contact Info */}
          <div className="lg:col-span-2 space-y-12 animate-fade-up delay-300">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-6 text-foreground">Contact Details</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Whether you have a question about my portfolio, want to discuss a custom piece, or just want to say hello, my inbox is always open.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 rounded-2xl glass-ethereal group hover:border-pink-halo/30 transition-colors duration-300">
                <div className="p-3 rounded-full bg-pink-halo/10 text-pink-halo group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Email</h3>
                  <a href="mailto:roshanhanger71@gmail.com" className="text-muted-foreground hover:text-pink-halo transition-colors">
                    roshanhanger71@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 rounded-2xl glass-ethereal group hover:border-brass/30 transition-colors duration-300">
                <div className="p-3 rounded-full bg-brass/10 text-brass group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                  <a href="tel:+977123456789" className="text-muted-foreground hover:text-brass transition-colors">
                    +977 (123) 456-789
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-2xl glass-ethereal group hover:border-sage/30 transition-colors duration-300">
                <div className="p-3 rounded-full bg-sage/10 text-sage group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Studio Location</h3>
                  <p className="text-muted-foreground">
                    Tinkune Subidhanagar -32<br/>
                    Kathmandu, Nepal<br/>
                    (By Appointment Only)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-3 animate-fade-up delay-400">
            <div className="relative p-8 md:p-12 rounded-[2.5rem] glass-ethereal border border-border/50 bg-card/20 overflow-hidden">
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-pink-halo/5 rounded-full blur-[60px] pointer-events-none" />
              
              <h2 className="font-serif text-3xl font-bold mb-8 relative z-10 text-foreground">Send a Message</h2>
              
              <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6 relative z-10">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                      <User className="h-3.5 w-3.5 text-sage" /> Name
                    </Label>
                    <Input id="name" {...register('name')} className="h-12 bg-background/50 border-border/50 focus:border-pink-halo/50 focus:ring-pink-halo/20 transition-all rounded-xl" placeholder="Your name" />
                    {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                      <Mail className="h-3.5 w-3.5 text-sage" /> Email
                    </Label>
                    <Input id="email" type="email" {...register('email')} className="h-12 bg-background/50 border-border/50 focus:border-pink-halo/50 focus:ring-pink-halo/20 transition-all rounded-xl" placeholder="your.email@example.com" />
                    {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="flex items-center gap-2 text-sm font-medium">
                    <MessageSquare className="h-3.5 w-3.5 text-brass" /> Subject
                  </Label>
                  <Input id="subject" {...register('subject')} className="h-12 bg-background/50 border-border/50 focus:border-brass/50 focus:ring-brass/20 transition-all rounded-xl" placeholder="How can I help you?" />
                  {errors.subject && <p className="text-xs text-destructive mt-1">{errors.subject.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="flex items-center gap-2 text-sm font-medium">
                    <MessageSquare className="h-3.5 w-3.5 text-pink-halo" /> Message
                  </Label>
                  <Textarea id="message" rows={6} {...register('message')} className="bg-background/50 border-border/50 focus:border-pink-halo/50 focus:ring-pink-halo/20 resize-none transition-all rounded-xl p-4" placeholder="Write your message here..." />
                  {errors.message && <p className="text-xs text-destructive mt-1">{errors.message.message}</p>}
                </div>
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full h-14 rounded-full bg-pink-halo hover:bg-white text-slate font-bold shadow-lg shadow-pink-halo/20 hover:shadow-pink-halo/40 hover:scale-[1.02] transition-all duration-300 mt-4"
                >
                  {mutation.isPending ? 'Sending...' : (<><Send className="mr-2 h-5 w-5" /> Send Message</>)}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
