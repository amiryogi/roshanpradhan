import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { api } from '@/lib/api';
import { CloudinaryImage } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Props {
  images: CloudinaryImage[];
  onChange: (images: CloudinaryImage[]) => void;
  multiple?: boolean;
}

export const ImageUploader = ({ images, onChange, multiple = true }: Props) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    try {
      const uploaded: CloudinaryImage[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('image', file);
        const res = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        uploaded.push(res.data.data);
      }
      onChange(multiple ? [...images, ...uploaded] : uploaded);
      toast.success('Images uploaded');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (publicId: string) => {
    try {
      await api.delete(`/upload/${encodeURIComponent(publicId)}`);
      onChange(images.filter((img) => img.publicId !== publicId));
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-3">
        {images.map((img) => (
          <div key={img.publicId} className="relative group aspect-square">
            <img
              src={img.url}
              alt="Uploaded artwork preview"
              className="w-full h-full object-cover rounded-md"
            />
            <button
              type="button"
              onClick={() => handleRemove(img.publicId)}
              className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      <label>
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleUpload}
          className="hidden"
        />
        <Button type="button" variant="outline" asChild disabled={uploading}>
          <span className="cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Image'}
          </span>
        </Button>
      </label>
    </div>
  );
};
