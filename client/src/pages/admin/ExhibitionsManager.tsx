import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Exhibition, CloudinaryImage } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { formatDate } from '@/lib/utils';

interface FormData {
  title: string;
  venue: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  type: 'solo' | 'group';
}

export default function ExhibitionsManager() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Exhibition | null>(null);
  const [cover, setCover] = useState<CloudinaryImage[]>([]);
  const { register, handleSubmit, reset } = useForm<FormData>();

  const { data } = useQuery({
    queryKey: ['admin-exhibitions'],
    queryFn: async () => (await api.get('/exhibitions')).data.data as Exhibition[],
  });

  const saveMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const payload = { ...formData, coverImage: cover[0] };
      if (editing) return api.put(`/exhibitions/${editing._id}`, payload);
      return api.post('/exhibitions', payload);
    },
    onSuccess: () => {
      toast.success('Saved');
      qc.invalidateQueries({ queryKey: ['admin-exhibitions'] });
      setOpen(false);
      reset();
      setCover([]);
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/exhibitions/${id}`),
    onSuccess: () => {
      toast.success('Deleted');
      qc.invalidateQueries({ queryKey: ['admin-exhibitions'] });
    },
  });

  const openEdit = (ex: Exhibition) => {
    setEditing(ex);
    setCover(ex.coverImage ? [ex.coverImage] : []);
    reset({
      title: ex.title,
      venue: ex.venue,
      location: ex.location,
      startDate: ex.startDate.split('T')[0],
      endDate: ex.endDate.split('T')[0],
      description: ex.description,
      type: ex.type,
    });
    setOpen(true);
  };

  const openNew = () => {
    setEditing(null);
    setCover([]);
    reset({ title: '', venue: '', location: '', startDate: '', endDate: '', description: '', type: 'solo' });
    setOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl font-bold">Exhibitions</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" /> Add</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Exhibition</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-3">
              <div><Label>Cover Image</Label><ImageUploader images={cover} onChange={setCover} multiple={false} /></div>
              <div><Label>Title</Label><Input {...register('title', { required: true })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Venue</Label><Input {...register('venue', { required: true })} /></div>
                <div><Label>Location</Label><Input {...register('location', { required: true })} /></div>
                <div><Label>Start Date</Label><Input type="date" {...register('startDate', { required: true })} /></div>
                <div><Label>End Date</Label><Input type="date" {...register('endDate', { required: true })} /></div>
              </div>
              <div>
                <Label>Type</Label>
                <select {...register('type')} className="w-full h-9 rounded-md border px-3 text-sm">
                  <option value="solo">Solo</option>
                  <option value="group">Group</option>
                </select>
              </div>
              <div><Label>Description</Label><Textarea {...register('description', { required: true })} /></div>
              <Button type="submit" className="w-full" disabled={cover.length === 0}>Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {data?.map((ex) => (
          <div key={ex._id} className="border rounded-lg p-4 flex justify-between items-center bg-background">
            <div>
              <h3 className="font-semibold">{ex.title}</h3>
              <p className="text-sm text-muted-foreground">
                {ex.venue} · {formatDate(ex.startDate)} – {formatDate(ex.endDate)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => openEdit(ex)}><Pencil className="h-3 w-3" /></Button>
              <Button size="sm" variant="destructive" onClick={() => confirm('Delete?') && deleteMutation.mutate(ex._id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
