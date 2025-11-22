import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, ArrowRight } from 'lucide-react'

const quotes = [
  {
    text: 'Agentic systems aren\'t monoliths — they\'re markets. Orchestrate incentives and evaluation, not steps.',
    cite: 'Odin Labs White Paper',
  },
  {
    text: 'Quality emerges from structured collaboration between specialist agents with shared context and hard feedback.',
    cite: 'Odin Labs White Paper',
  },
  {
    text: 'Safety is a control loop, not a checklist — policy, tests, and human review close the gap.',
    cite: 'Odin Labs White Paper',
  },
]

export default function WhitePaper() {
  useEffect(() => {
    // No-op: reserved for future intersection observers or analytics
  }, [])

  return (
    <section id="whitepaper" className="relative overflow-hidden bg-slate-950 py-24">
      {/* Background drama: radial glow + grid + vignette */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:40px_40px] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Heading row */}
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur">
              <BookOpen className="h-3.5 w-3.5" />
              White Paper
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
              The Odin Labs Moat
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-300">
              We distilled years of agent orchestration into a pragmatic playbook: incentives, evaluation, and safety loops that scale from one repo to an enterprise network.
            </p>
          </div>

          <motion.a
            href="/whitepaper.pdf"
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -1 }}
            whileTap={{ y: 0 }}
            className="group mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-slate-900 shadow-[0_10px_40px_-10px_rgba(255,255,255,0.6)] transition hover:bg-slate-100"
          >
            Read the White Paper
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </motion.a>
        </div>

        {/* Dramatic animated quotes */}
        <div className="relative mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quotes.map((q, i) => (
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: 0.06 * i }}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 text-white shadow-[0_30px_60px_-20px_rgba(2,6,23,0.7)] backdrop-blur"
            >
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10 blur-2xl"
                animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.05, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <p className="relative text-lg leading-relaxed text-white/95">“{q.text}”</p>
              <footer className="relative mt-4 text-sm text-slate-300">— {q.cite}</footer>
            </motion.blockquote>
          ))}
        </div>

        {/* Motion underline & callout */}
        <div className="relative mt-10 flex items-center justify-between gap-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-5">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -left-8 -top-8 h-40 w-40 rounded-full bg-emerald-400/20 blur-2xl"
            animate={{ opacity: [0.2, 0.45, 0.2], scale: [1, 1.08, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="relative max-w-3xl text-slate-200">
            <div className="text-sm uppercase tracking-wider text-emerald-300/90">Don\'t sleep on this</div>
            <div className="mt-1 text-xl font-semibold text-white">The playbook explains how swarms ship reliably — and safely — in real orgs.</div>
          </div>
          <motion.a
            href="/whitepaper.pdf"
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -1 }}
            whileTap={{ y: 0 }}
            className="relative inline-flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-slate-900/70 px-4 py-2 font-medium text-emerald-300 hover:bg-slate-900/90"
          >
            Open PDF
            <ArrowRight className="h-4 w-4" />
          </motion.a>
        </div>
      </div>

      {/* Floating ambience */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/10 blur-3xl"
        animate={{ opacity: [0.08, 0.18, 0.08], scale: [1, 1.06, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
    </section>
  )
}
