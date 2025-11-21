import React from 'react'
import { motion } from 'framer-motion'

export default function WhyDifferent() {
  const before = ['Manual refactors', 'Tool chaos', 'No memory', 'No safety', 'High review burden']
  const after = ['Memory-driven consistency', 'Safe execution', 'Deterministic behavior', 'Structured planning', 'Agents that learn over time']

  return (
    <section className="relative w-full bg-slate-950 py-24">
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Why Odin-Labs is Different</h2>
          <p className="mt-3 text-slate-300">A premium approach to agentic engineering</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Before */}
          <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="rounded-3xl border border-red-500/20 bg-gradient-to-b from-slate-900 to-slate-950 p-6">
            <div className="mb-4 inline-flex rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-red-300">Before</div>
            <ul className="space-y-2 text-slate-300">
              {before.map((b) => (
                <li key={b} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  {b}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* After */}
          <motion.div initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-slate-900 to-slate-950 p-6">
            <div className="absolute -inset-8 -z-0 rounded-3xl bg-[conic-gradient(from_180deg_at_50%_50%,rgba(16,185,129,0.1),transparent_40%)] blur-2xl" />
            <div className="relative mb-4 inline-flex rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-emerald-300">After (Odin-Labs)</div>
            <ul className="space-y-2 text-slate-300">
              {after.map((a) => (
                <li key={a} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {a}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
