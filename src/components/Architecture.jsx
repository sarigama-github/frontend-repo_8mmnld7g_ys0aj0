import React from 'react'
import { motion } from 'framer-motion'

const layers = [
  'Intent & Governance',
  'Cognitive Planning',
  'Memory & Context',
  'Tooling & Execution',
  'Agent Runtime',
  'Safety & Operations',
  'Evolution & Learning',
]

export default function Architecture() {
  return (
    <section className="relative w-full bg-slate-950 py-24">
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Odin-Labs Architecture</h2>
          <p className="mt-3 text-slate-300">This is how Odin-Labs safely transforms human intent into engineered, autonomous outcomes.</p>
        </div>

        <div className="grid items-center gap-10 md:grid-cols-2">
          {/* Diagram */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-emerald-400/5 blur-2xl" />
            <div className="relative rounded-3xl border border-emerald-500/20 bg-slate-900/60 p-4 backdrop-blur">
              <div className="relative space-y-3">
                {layers.map((l, i) => (
                  <motion.div key={l} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ delay: i * 0.08 }} className="relative overflow-hidden rounded-xl border border-white/5 bg-gradient-to-r from-slate-900 to-slate-800 p-4">
                    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-emerald-400/0 via-emerald-400/70 to-emerald-400/0" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">{l}</span>
                      <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.08 + 0.3 }} className="text-xs text-slate-400">Layer {i + 1}</motion.span>
                    </div>
                  </motion.div>
                ))}

                {/* Flow lines */}
                <motion.svg initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="pointer-events-none absolute inset-0" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="g" x1="0" x2="1">
                      <stop offset="0%" stopColor="#34d399" stopOpacity="0.0" />
                      <stop offset="50%" stopColor="#34d399" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#34d399" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {layers.map((_, i) => (
                    <motion.line key={i} x1="8" x2="95%" y1={30 + i * 58} y2={30 + (i + 1) * 58} stroke="url(#g)" strokeWidth="1.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ delay: i * 0.12, duration: 0.8 }} />
                  ))}
                </motion.svg>
              </div>
            </div>
          </div>

          {/* Copy list */}
          <div className="space-y-6">
            {layers.map((l, i) => (
              <motion.div key={l} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ delay: i * 0.08 }} className="rounded-xl border border-emerald-500/10 bg-slate-900/50 p-4">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <h4 className="font-medium text-white">{l}</h4>
                </div>
                <p className="mt-2 text-sm text-slate-300">Layered controls ensure safety, reliability, and measurable outcomes across the entire agent lifecycle.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
