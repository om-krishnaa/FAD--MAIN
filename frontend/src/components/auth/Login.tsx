import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import {
  loginUser,
  requestResetPassword,
  resendVerification,
  resetPassword,
  registerUser,
  verifyEmail,
} from './auth';
import toast from 'react-hot-toast';
import { formatTime } from '../../utils';
import SignupForm from '../forms/SignupForm';
import LoginForm from '../forms/LoginForm';
import { User } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

const resetSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  newPassword: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

type ResetForm = z.infer<typeof resetSchema>;

const ROTATING_WORDS = [
  'Next Level',
  'Next Generation',
  'Next Experience',
  'Next Vision',
];

const RotatingWords = () => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const typingSpeed = 150;
  const deletingSpeed = 50;
  const pauseTime = 1000;

  useEffect(() => {
    let timeoutId: number | undefined;

    const handleTyping = () => {
      const fullText = ROTATING_WORDS[index];

      if (isDeleting) {
        setText(fullText.substring(0, text.length - 1));
      } else {
        setText(fullText.substring(0, text.length + 1));
      }

      if (!isDeleting && text === fullText) {
        timeoutId = window.setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
      }

      timeoutId = window.setTimeout(
        handleTyping,
        isDeleting ? deletingSpeed : typingSpeed
      );
    };

    timeoutId = window.setTimeout(handleTyping, typingSpeed);

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [text, isDeleting, index]);

  return (
    <h1 className="mb-4 text-5xl font-bold text-white md:text-4xl">
      Taking advertisement to <span className="text-blue-500">{text}</span>
      <span className="text-blue-500 animate-pulse">|</span>
    </h1>
  );
};

const defaultCodeSet = Array(6).fill('');
export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showResetStep, setShowResetStep] = useState(1);
  const [showResetForm, setShowResetForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState(defaultCodeSet);
  const [resetCode, setResetCode] = useState(defaultCodeSet);
  const [timer, setTimer] = useState(300);
  const [canResend, setCanResend] = useState(false);

  const [searchParams] = useSearchParams();

  const ref = searchParams.get('ref');

  const { login } = useAuth();

  const {
    register: resetRegister,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetErrors },
    setError: setResetError,
    watch: watchReset,
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  useEffect(() => {
    let intervalId: number | undefined;

    if ((showVerificationForm || showResetStep === 2) && timer > 0) {
      intervalId = window.setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }

    return () => {
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [showVerificationForm, showResetStep, timer]);

  const onLoginSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);

    try {
      const result = (await loginUser(data.email, data.password)) as {
        success: boolean;
        message?: string;
        needsVerification?: boolean;
        user: User;
        token?: string;
      };

      if (result.success) {
        login(result.token!, {
          id: result.user.id,
          name: result.user.name,
          is_verified: result.user.is_verified === 1,
          role: result.user.role,
          email: result.user.email,
        });
        toast.success('Login successful!');
        if (
          result.user.role === 'admin' ||
          result.user.role === 'super_admin'
        ) {
          navigate('/dashboard');
        } else navigate('/user-dashboard');
      } else if (result.needsVerification) {
        setCurrentEmail(data.email);
        setShowVerificationForm(true);
        setTimer(300);
        setCanResend(false);
      } else {
        toast.error(result.message || 'Login failed');
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    }

    setIsLoading(false);
  };

  const onSignupSubmit = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    setIsLoading(true);

    try {
      const result = (await registerUser(
        data.name,
        data.email,
        data.password,
        ref
      )) as { success: boolean; message?: string };
      setIsLoading(false);

      if (result.success) {
        setCurrentEmail(data.email);
        setShowSignupForm(false);
        setShowVerificationForm(true);
        setTimer(300);
        setCanResend(false);
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    }

    setIsLoading(false);
  };

  const handleVerificationInput = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleResetCodeInput = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...resetCode];
    newCode[index] = value;
    setResetCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`reset-code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerification = async () => {
    const enteredCode = verificationCode.join('');

    if (enteredCode.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);

    try {
      const result = (await verifyEmail(currentEmail, enteredCode)) as {
        success: boolean;
        message?: string;
      };

      if (result.success) {
        toast.success('Email verified successfully! Welcome to FAD!');
        navigate('/dashboard');
      } else {
        toast.error(result.message || 'Verification failed');
        setVerificationCode(defaultCodeSet);
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.');
      setVerificationCode(defaultCodeSet);
    }

    setIsLoading(false);
  };

  const handleResend = async () => {
    setIsLoading(true);

    try {
      const result = (await resendVerification(currentEmail)) as {
        success: boolean;
        message?: string;
      };

      if (result.success) {
        setTimer(300);
        setCanResend(false);
        setVerificationCode(defaultCodeSet);
        toast.success('New verification code sent!');
      } else {
        toast.error(result.message || 'Failed to resend verification code');
      }
    } catch (error) {
      toast.error('Failed to resend verification code');
    }

    setIsLoading(false);
  };

  const handleResetRequest = async (email: string) => {
    setIsLoading(true);

    try {
      const result = (await requestResetPassword(email)) as {
        success: boolean;
        message?: string;
      };

      if (result.success) {
        setCurrentEmail(email);
        setShowResetStep(2);
        setTimer(300);
        setCanResend(false);
        toast.success(`Reset code sent to ${email}`);
      } else {
        toast.error(result.message || 'Failed to send reset code');
      }
    } catch (error) {
      toast.error('Failed to send reset code. Please try again.');
    }

    setIsLoading(false);
  };

  const onResetSubmit = async (data: ResetForm) => {
    const enteredCode = resetCode.join('');

    if (enteredCode.length !== 6) {
      toast.error('Please enter the complete 6-digit reset code');
      return;
    }

    setIsLoading(true);
    setResetError('root', { type: 'manual', message: '' });

    try {
      const result = (await resetPassword(
        currentEmail,
        enteredCode,
        data.newPassword
      )) as { success: boolean; message?: string };

      if (result.success) {
        toast.success(
          'Password reset successfully! You can now login with your new password.'
        );
        setShowResetForm(false);
        setShowResetStep(1);
        setResetCode(defaultCodeSet);
      } else {
        setResetError('root', {
          type: 'manual',
          message: result.message || 'Password reset failed',
        });
      }
    } catch (error) {
      setResetError('root', {
        type: 'manual',
        message: 'Password reset failed. Please try again.',
      });
    }

    setIsLoading(false);
  };

  const getCurrentTitle = () => {
    if (showVerificationForm) return 'Verify Email';
    if (showSignupForm) return 'Create Account';
    if (showResetForm) {
      return showResetStep === 1 ? 'Reset Password' : 'Enter Reset Code';
    }
    return 'FAD Admin Login';
  };

  return (
    <div className="flex w-full h-screen">
      {/* Left Side */}
      <div className="items-center justify-center hidden w-3/5 p-10 text-white bg-gradient-to-br from-black via-gray-900 to-gray-800 md:flex">
        <div className="mx-auto whitespace-nowrap">
          <img
            src="/FAD Logo.png"
            alt="FAD Logo"
            className="h-20 mx-auto mb-5"
          />
          <RotatingWords />
          <p className="text-2xl text-center text-gray-300">
            We Promote Your Business with Excellence
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center w-full px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black md:w-2/5">
        <div className="w-full max-w-md p-8 border shadow-2xl rounded-3xl backdrop-blur-md bg-white/10 border-white/20">
          <div className="flex flex-col items-center mt-4 mb-6">
            <h1 className="mb-2 text-3xl font-bold text-blue-500">
              {getCurrentTitle()}
            </h1>
            <p className="text-sm text-gray-300">Followers of Advertisement</p>
          </div>

          {showVerificationForm ? (
            <div className="space-y-4">
              <div className="px-4 py-3 text-blue-300 border border-blue-500 rounded-xl bg-blue-500/20">
                <p className="text-sm">
                  📧 Verification code sent to <strong>{currentEmail}</strong>
                </p>
              </div>

              <div className="text-center">
                <p className="mb-4 text-sm text-gray-300">
                  Enter the 6-digit code from your email:
                </p>

                <div className="flex justify-center gap-2 mb-4">
                  {verificationCode.map((digit, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) =>
                        handleVerificationInput(index, e.target.value)
                      }
                      className="w-10 h-12 text-xl font-bold text-center text-black bg-white border border-gray-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ))}
                </div>

                <div className="mb-4 text-sm text-gray-400">
                  Time remaining:{' '}
                  <span className="font-mono text-blue-400">
                    {formatTime(timer)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleVerification}
                disabled={isLoading || verificationCode.join('').length !== 6}
                className="w-full py-3 font-semibold text-white transition bg-blue-600 rounded-xl hover:bg-blue-700 disabled:bg-gray-600"
              >
                {isLoading ? 'Verifying...' : 'VERIFY EMAIL'}
              </button>

              <div className="space-y-2 text-center">
                <button
                  onClick={handleResend}
                  disabled={!canResend || isLoading}
                  className="text-sm text-blue-400 hover:underline disabled:text-gray-500 disabled:no-underline"
                >
                  {canResend ? 'Resend code' : `Resend in ${formatTime(timer)}`}
                </button>

                <p>
                  <button
                    type="button"
                    className="text-sm text-gray-400 hover:underline"
                    onClick={() => {
                      setShowVerificationForm(false);
                      setShowSignupForm(false);
                      setShowResetForm(false);
                      setCurrentEmail('');
                      setVerificationCode(defaultCodeSet);
                    }}
                  >
                    ← Back to login
                  </button>
                </p>
              </div>
            </div>
          ) : showSignupForm ? (
            <SignupForm
              onSubmit={onSignupSubmit}
              switchToLogin={() => {
                setShowVerificationForm(false);
                setShowSignupForm(false);
                setShowResetForm(false);
                setVerificationCode(defaultCodeSet);
              }}
              isLoading={isLoading}
            />
          ) : showResetForm ? (
            <div className="space-y-4">
              {showResetStep === 1 ? (
                <>
                  {resetErrors.email && (
                    <div className="px-4 py-2 text-sm text-red-300 border border-red-500 rounded-xl bg-red-500/20">
                      {resetErrors.email.message}
                    </div>
                  )}

                  <div>
                    <label className="block mb-1 font-medium text-gray-300">
                      Email
                    </label>
                    <input
                      type="email"
                      {...resetRegister('email')}
                      className="w-full px-4 py-3 text-black bg-white border border-gray-500 outline-none rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const email = watchReset('email');
                      if (email) {
                        handleResetRequest(email);
                      } else {
                        toast.error('Please enter your email address');
                      }
                    }}
                    disabled={isLoading}
                    className="w-full py-3 font-semibold text-white transition bg-blue-600 rounded-xl hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Code'}
                  </button>
                </>
              ) : (
                <form
                  onSubmit={handleResetSubmit(onResetSubmit)}
                  className="space-y-4"
                >
                  {resetErrors.root && (
                    <div className="px-4 py-2 text-sm text-red-300 border border-red-500 rounded-xl bg-red-500/20">
                      {resetErrors.root.message}
                    </div>
                  )}

                  <div className="px-4 py-3 text-blue-300 border border-blue-500 rounded-xl bg-blue-500/20">
                    <p className="text-sm">
                      📧 Reset code sent to <strong>{currentEmail}</strong>
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="mb-4 text-sm text-gray-300">
                      Enter the 6-digit reset code:
                    </p>

                    <div className="flex justify-center gap-2 mb-4">
                      {resetCode.map((digit, index) => (
                        <input
                          key={index}
                          id={`reset-code-${index}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleResetCodeInput(index, e.target.value)
                          }
                          className="w-10 h-12 text-xl font-bold text-center text-black bg-white border border-gray-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ))}
                    </div>

                    <div className="mb-4 text-sm text-gray-400">
                      Time remaining:{' '}
                      <span className="font-mono text-blue-400">
                        {formatTime(timer)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-300">
                      New Password
                    </label>
                    <input
                      type="password"
                      {...resetRegister('newPassword')}
                      className="w-full px-4 py-3 text-black bg-white border border-gray-500 outline-none rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter new password"
                    />
                    {resetErrors.newPassword && (
                      <p className="mt-1 text-sm text-red-400">
                        {resetErrors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || resetCode.join('').length !== 6}
                    className="w-full py-3 font-semibold text-white transition bg-blue-600 rounded-xl hover:bg-blue-700 disabled:bg-gray-600"
                  >
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                  </button>

                  <div className="text-center">
                    <button
                      onClick={async () => {
                        if (canResend) {
                          handleResetRequest(currentEmail);
                        }
                      }}
                      disabled={!canResend || isLoading}
                      className="text-sm text-blue-400 hover:underline disabled:text-gray-500 disabled:no-underline"
                    >
                      {canResend
                        ? 'Resend reset code'
                        : `Resend in ${formatTime(timer)}`}
                    </button>
                  </div>
                </form>
              )}

              <p className="mt-4 text-sm text-center text-gray-400">
                Back to login?{' '}
                <button
                  type="button"
                  className="text-blue-400 hover:underline"
                  onClick={() => {
                    setShowResetForm(false);
                    setShowResetStep(1);
                    setResetCode(defaultCodeSet);
                    setCurrentEmail('');
                    setTimer(300);
                    setCanResend(false);
                  }}
                >
                  Login
                </button>
              </p>
            </div>
          ) : (
            <LoginForm
              onSubmit={onLoginSubmit}
              switchToSignup={() => setShowSignupForm(true)}
              isLoading={isLoading}
              switchToReset={() => {
                setShowResetForm(true);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
