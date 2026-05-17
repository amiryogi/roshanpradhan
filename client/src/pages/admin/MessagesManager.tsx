import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, MailOpen } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Message } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

export default function MessagesManager() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: async () => (await api.get('/messages')).data.data as Message[],
  });

  const readMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/messages/${id}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-messages'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/messages/${id}`),
    onSuccess: () => {
      toast.success('Deleted');
      qc.invalidateQueries({ queryKey: ['admin-messages'] });
    },
  });

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-8">Messages</h1>
      <div className="space-y-3">
        {data?.length === 0 && <p className="text-muted-foreground">No messages yet</p>}
        {data?.map((m) => (
          <div key={m._id} className="border rounded-lg p-4 bg-background">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{m.subject}</h3>
                  {!m.isRead && <Badge>New</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">
                  From {m.name} ({m.email}) · {formatDate(m.createdAt)}
                </p>
              </div>
              <div className="flex gap-2">
                {!m.isRead && (
                  <Button size="sm" variant="outline" onClick={() => readMutation.mutate(m._id)}>
                    <MailOpen className="h-3 w-3" />
                  </Button>
                )}
                <Button size="sm" variant="destructive" onClick={() => confirm('Delete?') && deleteMutation.mutate(m._id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <p className="text-sm whitespace-pre-line mt-3 pt-3 border-t">{m.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
