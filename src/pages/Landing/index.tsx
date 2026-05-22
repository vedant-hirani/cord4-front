import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, PieChart, TrendingUp, ShieldCheck,
  ArrowRight, Sparkles, ReceiptText, BrainCircuit,
} from 'lucide-react';

// ── Animation variants ───────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.55, ease: 'easeOut' as const } },
};
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

// ── Data ─────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: BrainCircuit,
    color: 'from-violet-500 to-indigo-500',
    title: 'AI Receipt Parsing',
    desc:  'Paste text, upload a photo or CSV — Grok extracts amount, category, date instantly.',
  },
  {
    icon: PieChart,
    color: 'from-cyan-500 to-blue-500',
    title: 'Smart Analytics',
    desc:  'Daily, weekly, monthly, yearly charts. See exactly where your money goes.',
  },
  {
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-500',
    title: 'Budget Alerts',
    desc:  'Set per-category limits. Get real-time green / amber / red progress gauges.',
  },
  {
    icon: ShieldCheck,
    color: 'from-rose-500 to-pink-500',
    title: 'Secure by Default',
    desc:  'JWT auth, refresh-token rotation, and encrypted storage — always.',
  },
];

const STATS = [
  { value: '10k+', label: 'Expenses tracked' },
  { value: '99.9%', label: 'Uptime' },
  { value: '<200ms', label: 'API response' },
  { value: '6', label: 'Expense categories' },
];

// ── Component ────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#080b14] text-white overflow-x-hidden">

      {/* ── Ambient blobs ─────────────────────────────────── */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] rounded-full bg-cyan-600/10 blur-[100px]" />
      </div>

      {/* ── Navbar ────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-6 lg:px-16 py-5 border-b border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">SpendAI</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#stats"    className="hover:text-white transition-colors">Stats</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-4 py-2"
          >
            Sign in
          </button>
          <button
            onClick={() => navigate('/register')}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40"
          >
            Get started
            <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative z-10 pt-24 pb-20 px-6 lg:px-16 text-center">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 mb-8">
            <Zap size={12} className="text-indigo-400" />
            Powered by Grok AI · Built for speed
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight mb-6"
          >
            Track every cent.{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Effortlessly.
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            SpendAI turns receipts, SMS alerts, and spreadsheets into structured expense data —
            then gives you beautiful analytics and smart budget alerts.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 text-base transition-all shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              Start for free
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-3.5 text-base transition-all hover:-translate-y-0.5"
            >
              Sign in
            </button>
          </motion.div>
        </motion.div>

        {/* ── Dashboard preview mockup ── */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-20 max-w-5xl mx-auto"
        >
          {/* Glow under card */}
          <div className="absolute inset-x-10 -bottom-6 h-20 bg-indigo-600/20 blur-2xl rounded-full" />

          <div className="relative rounded-2xl border border-white/8 bg-[#0d1117] overflow-hidden shadow-2xl shadow-black/60">
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
              <span className="h-3 w-3 rounded-full bg-rose-500/70" />
              <span className="h-3 w-3 rounded-full bg-amber-500/70" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
              <div className="ml-4 flex-1 h-5 rounded-md bg-white/5 max-w-xs" />
            </div>

            {/* Mock dashboard content */}
            <div className="p-6 space-y-4">
              {/* Stats row */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Total Spending', val: '$1,284.50', color: 'bg-indigo-500/20 border-indigo-500/20' },
                  { label: 'Transactions',   val: '47',        color: 'bg-violet-500/20 border-violet-500/20' },
                  { label: 'Budget Used',    val: '68.4%',     color: 'bg-emerald-500/20 border-emerald-500/20' },
                  { label: 'Alerts',         val: '2',         color: 'bg-amber-500/20 border-amber-500/20' },
                ].map((s) => (
                  <div key={s.label} className={`rounded-xl border p-3 ${s.color}`}>
                    <p className="text-[10px] text-gray-500 mb-1">{s.label}</p>
                    <p className="text-lg font-bold text-white">{s.val}</p>
                  </div>
                ))}
              </div>

              {/* Chart placeholder */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 rounded-xl border border-white/5 bg-white/[0.02] p-4 h-32 flex flex-col justify-between">
                  <p className="text-xs text-gray-500">Spending Trend</p>
                  <div className="flex items-end gap-1 h-16">
                    {[30, 55, 40, 70, 45, 80, 60, 90, 50, 75, 85, 65].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-indigo-500/40"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 h-32 space-y-2">
                  <p className="text-xs text-gray-500">Top Categories</p>
                  {[
                    { cat: 'Food',      pct: 42, color: 'bg-rose-500' },
                    { cat: 'Transport', pct: 28, color: 'bg-blue-500' },
                    { cat: 'Shopping',  pct: 18, color: 'bg-violet-500' },
                  ].map((c) => (
                    <div key={c.cat} className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden">
                        <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.pct}%` }} />
                      </div>
                      <span className="text-[10px] text-gray-500 w-14 text-right">{c.cat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────── */}
      <section id="stats" className="relative z-10 py-16 px-6 lg:px-16 border-y border-white/5">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {STATS.map((s) => (
            <motion.div key={s.label} variants={fadeUp}>
              <p className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                {s.value}
              </p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section id="features" className="relative z-10 py-24 px-6 lg:px-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">
              Everything you need
            </p>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
              Built for real finance control
            </h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">
              From AI-powered receipt parsing to real-time budget gauges — every feature is designed to save you time.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                custom={i}
                className="group relative rounded-2xl border border-white/6 bg-white/[0.03] p-6
                           hover:border-white/12 hover:bg-white/[0.06] transition-all duration-300"
              >
                <div className={`inline-flex rounded-xl bg-gradient-to-br ${f.color} p-3 mb-5 shadow-lg`}>
                  <f.icon size={20} className="text-white" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── How it works ──────────────────────────────────── */}
      <section className="relative z-10 py-24 px-6 lg:px-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">
              How it works
            </p>
            <h2 className="text-4xl font-extrabold tracking-tight">Three steps to clarity</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: ReceiptText, title: 'Add an expense',   desc: 'Paste text, upload a receipt photo, or enter manually.' },
              { step: '02', icon: BrainCircuit, title: 'AI extracts data', desc: 'Grok reads the receipt and fills amount, category, and date.' },
              { step: '03', icon: PieChart,    title: 'See your insights', desc: 'Charts, budget gauges, and alerts update in real time.' },
            ].map((item) => (
              <motion.div key={item.step} variants={fadeUp} className="relative text-center">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl border border-white/8 bg-white/[0.04] mb-5 mx-auto">
                  <item.icon size={22} className="text-indigo-400" />
                </div>
                <span className="absolute top-0 right-1/2 translate-x-8 -translate-y-1 text-[10px] font-bold text-indigo-500/60 tracking-widest">
                  {item.step}
                </span>
                <h3 className="text-base font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="relative z-10 py-24 px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-600/10 to-violet-600/10 px-8 py-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 mb-6">
            <Sparkles size={12} />
            Free to get started
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-5">
            Take control of your finances today
          </h2>
          <p className="text-gray-400 mb-10 max-w-lg mx-auto">
            Join SpendAI and stop guessing where your money goes.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-10 py-4 text-base transition-all shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
          >
            Create free account
            <ArrowRight size={16} />
          </button>
        </motion.div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/5 px-6 lg:px-16 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Sparkles size={12} className="text-white" />
          </div>
          <span className="font-semibold text-gray-400">SpendAI</span>
        </div>
        <p>© {new Date().getFullYear()} SpendAI. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
        </div>
      </footer>

    </div>
  );
}
