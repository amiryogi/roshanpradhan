import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { About, CloudinaryImage } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ImageUploader } from '@/components/admin/ImageUploader';

interface FormData {
  bio: string;
  statement: string;
  email: string;
  phone: string;
  instagram: string;
  twitter: string;
  facebook: string;
  linkedin: string;
}

export default function AboutManager() {
  const qc = useQueryClient();
  const [profile, setProfile] = useState<CloudinaryImage[]>([]);
  const { register, handleSubmit, reset } = useForm<FormData>();

  const { data } = useQuery({
    queryKey: ['admin-about'],
    queryFn: async () => (await api.get('/about')).data.data as About,
  });

  useEffect(() => {
    if (data) {
      reset({
        bio: data.bio, statement: data.statement,
        email: data.email, phone: data.phone,
        instagram: data.socialLinks?.instagram || '',
        twitter: data.socialLinks?.twitter || '',
        facebook: data.socialLinks?.facebook || '',
        linkedin: data.socialLinks?.linkedin || '',
      });
      if (data.profileImage?.url) setProfile([data.profileImage]);
    }
  }, [data, reset]);

  const saveMutation = useMutation({
    mutationFn: (formData: FormData) =>
      api.put('/about', {
        bio: formData.bio, statement: formData.statement,
        email: formData.email, phone: formData.phone,
        profileImage: profile[0],
        socialLinks: {
          instagram: formData.instagram, twitter: formData.twitter,
          facebook: formData.facebook, linkedin: formData.linkedin,
        },
      }),
    onSuccess: () => {
      toast.success('Saved');
      qc.invalidateQueries({ queryKey: ['admin-about'] });
    },
  });

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-8">About Page</h1>
      <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4 max-w-2xl">
        <div><Label>Profile Image</Label><ImageUploader images={profile} onChange={setProfile} multiple={false} /></div>
        <div><Label>Bio</Label><Textarea rows={6} {...register('bio')} /></div>
        <div><Label>Artist Statement</Label><Textarea rows={6} {...register('statement')} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label>Email</Label><Input type="email" {...register('email')} /></div>
          <div><Label>Phone</Label><Input {...register('phone')} /></div>
          <div><Label>Instagram</Label><Input {...register('instagram')} /></div>
          <div><Label>Twitter</Label><Input {...register('twitter')} /></div>
          <div><Label>Facebook</Label><Input {...register('facebook')} /></div>
          <div><Label>LinkedIn</Label><Input {...register('linkedin')} /></div>
        </div>
        <Button type="submit" disabled={saveMutation.isPending}>Save Changes</Button>
      </form>
    </div>
  );
}
