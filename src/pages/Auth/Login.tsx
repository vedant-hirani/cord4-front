import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-[#080b14] flex">

      {/* ── Left panel — branding ─────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
        {/* Blobs */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-violet-600/15 blur-[100px]" />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">SpendAI</span>
        </div>

        {/* Quote */}
        <div className="relative">
          <p className="text-3xl font-bold text-white leading-snug mb-4">
            "Finally, an expense tracker that actually understands my receipts."
          </p>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500" />
            <div>
              <p className="text-sm font-semibold text-white">Alex M.</p>
              <p className="text-xs text-gray-400">Product Designer</p>
            </div>
          </div>
        </div>

        {/* Mini stats */}
        <div className="relative grid grid-cols-3 gap-4">
          {[
            { val: '10k+', label: 'Users' },
            { val: '99.9%', label: 'Uptime' },
            { val: 'Free', label: 'To start' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/8 bg-white/[0.04] p-4 text-center">
              <p className="text-xl font-extrabold text-white">{s.val}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel — form ────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Sparkles size={15} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white">SpendAI</span>
          </div>

          <h1 className="text-3xl font-extrabold text-white mb-1 tracking-tight">Welcome back</h1>
          <p className="text-gray-400 text-sm mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
              >
                <AlertCircle size={15} className="flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                Email address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                  className="w-full rounded-xl border border-white/8 bg-white/[0.04] pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-600
                             focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.06] transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  className="w-full rounded-xl border border-white/8 bg-white/[0.04] pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-600
                             focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.06] transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60
                         text-white font-semibold py-3.5 text-sm transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/35
                         hover:-translate-y-0.5 disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>Sign in <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              Create one free
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
