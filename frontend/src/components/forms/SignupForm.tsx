import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type SignupFormData = z.infer<typeof signupSchema>;

interface Props {
  onSubmit: (data: SignupFormData) => void;
  switchToLogin: () => void;
  isLoading?: boolean;
}

const SignupForm = ({ onSubmit, switchToLogin, isLoading = false }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
      <div>
        <label className="block mb-1 font-medium text-gray-300">
          Full Name
        </label>
        <input
          type="text"
          {...register('name')}
          className="w-full px-4 py-3 text-black bg-white border border-gray-500 outline-none rounded-xl focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your full name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label className="block mb-1 font-medium text-gray-300">Email</label>
        <input
          type="email"
          {...register('email')}
          className="w-full px-4 py-3 text-black bg-white border border-gray-500 outline-none rounded-xl focus:ring-2 focus:ring-blue-500"
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
          className="w-full px-4 py-3 text-black bg-white border border-gray-500 outline-none rounded-xl focus:ring-2 focus:ring-blue-500"
          placeholder="Create a password"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
        )}
      </div>
      <div>
        <label className="block mb-1 font-medium text-gray-300">
          Confirm Password
        </label>
        <input
          type="password"
          {...register('confirmPassword')}
          className="w-full px-4 py-3 text-black bg-white border border-gray-500 outline-none rounded-xl focus:ring-2 focus:ring-blue-500"
          placeholder="Confirm your password"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-400">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 font-semibold text-white transition bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-xl"
      >
        {isLoading ? 'Creating Account...' : 'CREATE ACCOUNT'}
      </button>
      {/* Switch to Login */}
      <p className="mt-4 text-sm text-center text-gray-400">
        Already have an account?{' '}
        <button
          type="button"
          className="text-blue-400 hover:underline"
          onClick={switchToLogin}
        >
          Login
        </button>
      </p>
    </form>
  );
};

export default SignupForm;
