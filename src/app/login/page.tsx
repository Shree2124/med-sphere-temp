'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Activity,
  Loader2,
  AlertCircle,
  User as UserIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login State
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('admin@medsphere.com');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);

  // Register State
  const [regRole, setRegRole] = useState('doctor');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [regError, setRegError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  const resetFields = () => {
    setError(null);
    setRegError(null);
    setRegName('');
    setRegEmail('');
    setRegPass('');
    setRegConfirmPass('');
  };

  const togglePanel = (toRegister: boolean) => {
    resetFields();
    setShowRegister(toRegister);
  };

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (
          res.status === 403 ||
          data.message?.toLowerCase().includes('role')
        ) {
          Toast.fire({
            icon: 'error',
            title: 'Access Denied',
            text: "The selected role does not match this account's registered role.",
            background: '#fff',
            color: '#dc2626',
            iconColor: '#dc2626',
          });
        }
        setError(data.message || 'Authentication failed');
        return;
      }

      Toast.fire({
        icon: 'success',
        title: 'Login Successful',
        text: `Welcome back, ${data.user.name}`,
        iconColor: '#10b981',
      });

      setUser(data.user, data.user.role);
      router.replace('/dashboard');
      router.refresh();
      window.location.assign('/dashboard');
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPass !== regConfirmPass) {
      setRegError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setRegError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPass,
          confirmPassword: regConfirmPass,
          role: regRole,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setRegError(data.message || 'Registration failed');
        return;
      }

      Toast.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'Your healthcare account has been created.',
        iconColor: '#10b981',
      });

      router.push('/dashboard');
      router.refresh();
    } catch {
      setRegError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen flex overflow-hidden font-sans">
      {/* Left Panel - Branding (Static) */}
      <div className="hidden lg:flex lg:w-1/2 sidebar-gradient relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        <div className="relative flex flex-col items-center justify-center w-full p-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 rounded-2xl bg-brand-400 flex items-center justify-center mb-6 shadow-xl"
          >
            <Activity size={40} className="text-white" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-white mb-2 font-outfit"
          >
            MedSphere
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-teal-200/70 text-sm uppercase tracking-[0.3em] mb-8"
          >
            Hospital Information Management System
          </motion.p>
          <div className="max-w-sm space-y-4">
            {[
              'Complete Patient Lifecycle Management',
              'Electronic Medical Records (EMR/EHR)',
              'Real-time Analytics & Reporting',
              'Pharmacy, Lab & Billing Integration',
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3 text-teal-100/80"
              >
                <div className="w-6 h-6 rounded-full bg-brand-400/30 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-brand-300" />
                </div>
                <span className="text-sm font-inter">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Cards with Motion */}
      <div className="flex-1 flex flex-col bg-medical-bg relative min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center gap-3 p-8 pb-0 justify-center">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
            <Activity size={24} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900 font-outfit">
            MedSphere
          </span>
        </div>

        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {!showRegister ? (
              /* Login Card Panel */
              <motion.div
                key="login"
                initial={{ x: 0, opacity: 1 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0, filter: 'blur(4px)' }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="absolute inset-0 flex items-center justify-center p-8"
              >
                <div className="w-full max-w-md bg-white rounded-2xl shadow-(--shadow-soft) p-8 border border-gray-100">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 font-outfit">
                      Welcome Back
                    </h2>
                    <p className="text-gray-500 text-sm mt-1 font-inter">
                      Sign in to access the HIMS
                    </p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700 font-inter">
                        Login As
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['admin', 'doctor', 'nurse'].map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setRole(r)}
                            disabled={isLoading}
                            className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all cursor-pointer capitalize font-inter ${role === r
                              ? 'bg-brand-50 border-brand-500 text-brand-700'
                              : 'border-gray-200 text-gray-500 hover:border-gray-300'
                              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 font-inter"
                      >
                        Email
                      </label>
                      <div className="relative">
                        <Mail
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isLoading}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-inter"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 font-inter"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <Lock
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isLoading}
                          className={`w-full pl-10 pr-10 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-inter ${error ? 'border-red-500' : 'border-gray-300'
                            }`}
                          placeholder="Enter your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      {error && (
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-red-500">
                          <AlertCircle size={14} />
                          <span>{error}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                        />
                        <span className="text-gray-600 font-inter">
                          Remember me
                        </span>
                      </label>
                      <a
                        href="#"
                        className="text-sm text-brand-600 hover:underline font-inter"
                      >
                        Forgot password?
                      </a>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        'Sign In'
                      )}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 font-inter">
                      New here?{' '}
                      <button
                        onClick={() => togglePanel(true)}
                        className="text-brand-600 font-semibold hover:underline cursor-pointer"
                      >
                        Create an account
                      </button>
                    </p>
                  </div>

                  <p className="text-center text-xs text-gray-400 mt-8 font-inter">
                    Protected by HIPAA-compliant security · v2.1.0
                  </p>
                </div>
              </motion.div>
            ) : (
              /* Register Card Panel */
              <motion.div
                key="register"
                initial={{ x: 100, opacity: 0, filter: 'blur(4px)' }}
                animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
                exit={{ x: 100, opacity: 0, filter: 'blur(4px)' }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="absolute inset-0 flex items-center justify-center p-8"
              >
                <div className="w-full max-w-md bg-white rounded-2xl shadow-(--shadow-soft) p-8 border border-gray-100">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 font-outfit">
                      Create Account
                    </h2>
                    <p className="text-gray-500 text-sm mt-1 font-inter">
                      Register to access the HIMS
                    </p>
                  </div>

                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700 font-inter">
                        Register As
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['admin', 'doctor', 'nurse'].map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setRegRole(r)}
                            disabled={isLoading}
                            className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all cursor-pointer capitalize font-inter ${regRole === r
                              ? 'bg-brand-50 border-brand-500 text-brand-700'
                              : 'border-gray-200 text-gray-500 hover:border-gray-300'
                              }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="regName"
                        className="block text-sm font-medium text-gray-700 font-inter"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <UserIcon
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          id="regName"
                          type="text"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          disabled={isLoading}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-inter"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="regEmail"
                        className="block text-sm font-medium text-gray-700 font-inter"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          id="regEmail"
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          disabled={isLoading}
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-inter ${regError?.includes('Email')
                            ? 'border-red-500'
                            : 'border-gray-300'
                            }`}
                          placeholder="patient@medsphere.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-1">
                        <label
                          htmlFor="regPass"
                          className="block text-sm font-medium text-gray-700 font-inter"
                        >
                          Password
                        </label>
                        <div className="relative">
                          <Lock
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                          <input
                            id="regPass"
                            type={showPassword ? 'text' : 'password'}
                            value={regPass}
                            onChange={(e) => setRegPass(e.target.value)}
                            disabled={isLoading}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-inter"
                            placeholder="••••••••"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="regConfirmPass"
                          className="block text-sm font-medium text-gray-700 font-inter"
                        >
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                          <input
                            id="regConfirmPass"
                            type={showPassword ? 'text' : 'password'}
                            value={regConfirmPass}
                            onChange={(e) => setRegConfirmPass(e.target.value)}
                            disabled={isLoading}
                            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-inter ${regError?.includes('match')
                              ? 'border-red-500'
                              : 'border-gray-300'
                              }`}
                            placeholder="••••••••"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {regError && (
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-red-500 font-inter">
                        <AlertCircle size={14} />
                        <span>{regError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2 font-inter"
                    >
                      {isLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        'Sign Up'
                      )}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 font-inter">
                      Already have an account?{' '}
                      <button
                        onClick={() => togglePanel(false)}
                        className="text-brand-600 font-semibold hover:underline cursor-pointer"
                      >
                        Sign In
                      </button>
                    </p>
                  </div>

                  <p className="text-center text-xs text-gray-400 mt-8 font-inter">
                    Protected by HIPAA-compliant security · v2.1.0
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
