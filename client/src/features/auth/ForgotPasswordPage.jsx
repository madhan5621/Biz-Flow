import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../providers/ToastProvider';
import api from '../../lib/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const ForgotPasswordPage = () => {
  const [sent, setSent] = useState(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data) => {
    try {
      await api.post('/auth/forgot-password', data);
      setSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email.');
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-success-50 dark:bg-success-900/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-success-500" />
        </div>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">
          Check your email
        </h2>
        <p className="text-surface-500 dark:text-surface-400 mb-6">
          We've sent a password reset link to your email address. Please check your inbox.
        </p>
        <Link to="/login">
          <Button variant="outline" leftIcon={ArrowLeft}>
            Back to Sign in
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-1">
        Forgot your password?
      </h2>
      <p className="text-surface-500 dark:text-surface-400 mb-8">
        Enter your email and we'll send you a reset link
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email"
          type="email"
          placeholder="name@company.com"
          leftIcon={Mail}
          error={errors.email?.message}
          {...register('email')}
        />

        <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
          Send Reset Link
        </Button>
      </form>

      <p className="mt-6 text-center">
        <Link
          to="/login"
          className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign in
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
