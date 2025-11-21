import React from 'react'
import { motion } from 'framer-motion'

const items = [
  'Ship weekly roadmap in days',
  'Legacy-to-modern stack upgrades',
  'Automated release notes & changelogs',
  'Repo-wide refactors at PR quality',
  'Integration tests from user stories',
  'Onboarding bots that prep repos for hires',
]

export default function Examples() {
  return (
    <section id="use-cases" className="relative w-full bg-slate-950 py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_50%)]" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Real Examples for Startups</h2>
          <p className="mt-3 text-slate-300">Lean teams, 10x output. Practical, compounding wins.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <motion.div key={t} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ delay: i * 0.06 }} className="group relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-slate-900 to-slate-950 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-400/0 via-emerald-400/0 to-emerald-400/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative">
                <div className="h-32 rounded-xl bg-slate-800/50 backdrop-blur-sm" />
                <div className="pointer-events-none absolute inset-x-0 -bottom-10 h-10 bg-gradient-to-b from-transparent to-slate-950/90" />
              </div>
              <div className="relative mt-4">
                <h3 className="text-base font-medium text-white">{t}</h3>
                <p className="mt-1 text-sm text-slate-400">Tap to see how agentic flows create leverage with minimal process overhead.</p>
              </div>
              <div className="absolute inset-0 scale-105 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100" style={{ boxShadow: '0 0 60px rgba(16,185,129,0.25) inset' }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
