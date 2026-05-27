import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface Props {
  onSubmit: (data: LoginFormData) => void;
  switchToSignup: () => void;
  switchToReset: () => void;
  isLoading?: boolean;
}

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = ({
  onSubmit,
  switchToSignup,
  switchToReset,
  isLoading = false,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium text-gray-300">Email</label>
        <input
          type="email"
          {...register('email')}
          className="px-4 py-3 w-full text-black bg-white rounded-xl border border-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-300">Password</label>
        <input
          type="password"
          {...register('password')}
          className="px-4 py-3 w-full text-black bg-white rounded-xl border border-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="py-3 w-full font-semibold text-white bg-blue-600 rounded-xl transition hover:bg-blue-700 disabled:bg-blue-400"
      >
        {isLoading ? 'Logging in...' : 'LOGIN'}
      </button>

      <div className="mt-4 space-y-2 text-sm text-center text-gray-400">
        <p>
          Don't have an account?{' '}
          <button
            type="button"
            className="text-blue-400 hover:underline"
            onClick={switchToSignup}
          >
            Sign up
          </button>
        </p>
        <p>
          Forgot your password?{' '}
          <button
            type="button"
            className="text-blue-400 hover:underline"
            onClick={switchToReset}
          >
            Reset
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
