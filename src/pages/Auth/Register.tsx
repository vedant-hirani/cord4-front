import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

const PASSWORD_RULES = [
  { label: 'At least 8 characters',          test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter',            test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number',                      test: (p: string) => /\d/.test(p) },
  { label: 'One special character (!@#$…)',   test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [name, setName]                   = useState('');
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [confirmPassword, setConfirm]     = useState('');
  const [error, setError]                 = useState('');
  const [showRules, setShowRules]         = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    const failing = PASSWORD_RULES.find((r) => !r.test(password));
    if (failing) { setError(failing.label + ' is required.'); return; }
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  const inputCls = `w-full rounded-xl border border-white/8 bg-white/[0.04] pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-600
                    focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.06] transition-all disabled:opacity-50`;

  return (
    <div className="min-h-screen bg-[#080b14] flex">

      {/* ── Left branding panel ───────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-indigo-600/15 blur-[100px]" />
        </div>

        <div className="relative flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">SpendAI</span>
        </div>

        <div className="relative space-y-6">
          <h2 className="text-3xl font-bold text-white leading-snug">
            Your finances,<br />finally under control.
          </h2>
          <ul className="space-y-3">
            {[
              'AI parses receipts in under a second',
              'Budget alerts before you overspend',
              'Beautiful charts for every time range',
              'Secure JWT auth with token rotation',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-gray-300">
                <CheckCircle size={15} className="text-indigo-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative rounded-2xl border border-white/8 bg-white/[0.04] p-5">
          <p className="text-sm text-gray-300 italic mb-3">
            "SpendAI saved me hours every month. The AI parser is genuinely magic."
          </p>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500" />
            <div>
              <p className="text-xs font-semibold text-white">Jordan K.</p>
              <p className="text-xs text-gray-500">Freelance Developer</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ──────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
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

          <h1 className="text-3xl font-extrabold text-white mb-1 tracking-tight">Create account</h1>
          <p className="text-gray-400 text-sm mb-8">Start tracking your expenses for free</p>

          <form onSubmit={handleSubmit} className="space-y-4">

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

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Full name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe" required disabled={isLoading} className={inputCls} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" required disabled={isLoading} className={inputCls} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="password" value={password}
                  onChange={(e) => { setPassword(e.target.value); setShowRules(true); }}
                  placeholder="••••••••" required disabled={isLoading} className={inputCls} />
              </div>
              {/* Password strength rules */}
              {showRules && password.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-1">
                  {PASSWORD_RULES.map((r) => (
                    <div key={r.label} className={`flex items-center gap-1.5 text-[11px] ${r.test(password) ? 'text-emerald-400' : 'text-gray-500'}`}>
                      <CheckCircle size={10} className={r.test(password) ? 'text-emerald-400' : 'text-gray-600'} />
                      {r.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Confirm password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="password" value={confirmPassword} onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••" required disabled={isLoading}
                  className={`${inputCls} ${confirmPassword && confirmPassword !== password ? 'border-red-500/40' : ''}`} />
              </div>
              {confirmPassword && confirmPassword !== password && (
                <p className="mt-1 text-xs text-red-400">Passwords don't match</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60
                         text-white font-semibold py-3.5 text-sm transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/35
                         hover:-translate-y-0.5 disabled:hover:translate-y-0 mt-2"
            >
              {isLoading ? (
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>Create account <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              Sign in
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
