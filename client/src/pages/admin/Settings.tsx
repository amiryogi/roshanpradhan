import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const schema = z
  .object({
    currentPassword: z.string().min(8, 'At least 8 characters'),
    newPassword: z.string().min(8, 'At least 8 characters'),
    confirmPassword: z.string().min(8, 'At least 8 characters'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

function PasswordField({
  id,
  label,
  registration,
  error,
}: {
  id: string;
  label: string;
  registration: object;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? 'text' : 'password'}
          className="pr-10"
          {...registration}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
          tabIndex={-1}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export default function Settings() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await api.put('/auth/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password updated successfully');
      reset();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Failed to update password';
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-10 max-w-lg">
      <div>
        <h1 className="font-serif text-4xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground text-lg">Manage your account security.</p>
      </div>

      {/* Change Password Card */}
      <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md p-8 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-brass/10 flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-brass" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-semibold text-foreground">Change Password</h2>
            <p className="text-sm text-muted-foreground">Use a strong password of at least 8 characters.</p>
          </div>
        </div>

        <div className="h-px bg-border/50" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <PasswordField
            id="currentPassword"
            label="Current Password"
            registration={register('currentPassword')}
            error={errors.currentPassword?.message}
          />
          <PasswordField
            id="newPassword"
            label="New Password"
            registration={register('newPassword')}
            error={errors.newPassword?.message}
          />
          <PasswordField
            id="confirmPassword"
            label="Confirm New Password"
            registration={register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 rounded-xl bg-brass hover:bg-brass/90 text-slate font-semibold gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            {isSubmitting ? 'Updating…' : 'Update Password'}
          </Button>
        </form>
      </div>
    </div>
  );
}
