import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Artwork, CloudinaryImage, PaginatedResponse } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ImageUploader } from '@/components/admin/ImageUploader';

interface FormData {
  title: string;
  description: string;
  category: string;
  medium: string;
  dimensions: string;
  year: number;
  price: number | null;
  isForSale: boolean;
  isFeatured: boolean;
}

export default function ArtworksManager() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Artwork | null>(null);
  const [images, setImages] = useState<CloudinaryImage[]>([]);

  const { register, handleSubmit, reset } = useForm<FormData>();

  const { data } = useQuery({
    queryKey: ['admin-artworks'],
    queryFn: async () => {
      const res = await api.get('/artworks?limit=100');
      return res.data.data as PaginatedResponse<Artwork>;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const payload = { ...formData, images, tags: [] };
      if (editing) return api.put(`/artworks/${editing._id}`, payload);
      return api.post('/artworks', payload);
    },
    onSuccess: () => {
      toast.success(editing ? 'Artwork updated' : 'Artwork created');
      qc.invalidateQueries({ queryKey: ['admin-artworks'] });
      setOpen(false);
      reset();
      setImages([]);
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/artworks/${id}`),
    onSuccess: () => {
      toast.success('Deleted');
      qc.invalidateQueries({ queryKey: ['admin-artworks'] });
    },
  });

  const openEdit = (artwork: Artwork) => {
    setEditing(artwork);
    setImages(artwork.images);
    reset({
      title: artwork.title,
      description: artwork.description,
      category: artwork.category,
      medium: artwork.medium,
      dimensions: artwork.dimensions,
      year: artwork.year,
      price: artwork.price,
      isForSale: artwork.isForSale,
      isFeatured: artwork.isFeatured,
    });
    setOpen(true);
  };

  const openNew = () => {
    setEditing(null);
    setImages([]);
    reset({
      title: '', description: '', category: '', medium: '',
      dimensions: '', year: new Date().getFullYear(),
      price: null, isForSale: false, isFeatured: false,
    });
    setOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl font-bold">Artworks</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}>
              <Plus className="h-4 w-4 mr-2" /> Add Artwork
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit' : 'Add'} Artwork</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4">
              <div>
                <Label>Images</Label>
                <ImageUploader images={images} onChange={setImages} />
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register('title', { required: true })} />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register('description', { required: true })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" {...register('category', { required: true })} />
                </div>
                <div>
                  <Label htmlFor="medium">Medium</Label>
                  <Input id="medium" {...register('medium', { required: true })} />
                </div>
                <div>
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input id="dimensions" {...register('dimensions')} />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input id="year" type="number" {...register('year', { valueAsNumber: true })} />
                </div>
                <div>
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input id="price" type="number" step="0.01" {...register('price', { valueAsNumber: true })} />
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" {...register('isForSale')} />
                  <span className="text-sm">For Sale</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" {...register('isFeatured')} />
                  <span className="text-sm">Featured</span>
                </label>
              </div>
              <Button type="submit" disabled={saveMutation.isPending || images.length === 0} className="w-full">
                {saveMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.artworks.map((a) => (
          <div key={a._id} className="border rounded-lg p-4 bg-background">
            <img src={a.images[0]?.url} alt={a.title} className="w-full aspect-square object-cover rounded mb-3" />
            <h3 className="font-semibold truncate">{a.title}</h3>
            <p className="text-xs text-muted-foreground mb-3">{a.medium}, {a.year}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => openEdit(a)}>
                <Pencil className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => confirm('Delete this artwork?') && deleteMutation.mutate(a._id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
