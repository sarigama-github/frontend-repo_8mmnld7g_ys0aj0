import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Building, Building2 } from 'lucide-react'

const tiers = ['small','medium','enterprise']

const contentByTier = {
  small: {
    before: ['Manual refactors', 'Tool chaos', 'No memory', 'No safety', 'High review burden'],
    after: ['Memory-driven consistency', 'Safe execution', 'Deterministic behavior', 'Structured planning', 'Agents that learn over time'],
  },
  medium: {
    before: ['Inconsistent process across squads', 'Backlog churn', 'Slow reviews', 'Knowledge silos', 'Flaky tests'],
    after: ['Shared playbooks', 'Agentic triage + planning', 'PR quality gates', 'Org memory', 'Stabilized CI'],
  },
  enterprise: {
    before: ['Legacy inertia', 'Policy bottlenecks', 'Risk-heavy migrations', 'Multi-repo drift', 'Audit fatigue'],
    after: ['Policy-aware automation', 'Guardrailed execution', 'Safe migrations', 'Standardization at scale', 'Built-in auditability'],
  },
}

export default function WhyDifferent() {
  const [tier, setTier] = useState('small')
  const data = useMemo(() => contentByTier[tier], [tier])

  return (
    <section className="relative w-full bg-slate-950 py-24">
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-6 flex max-w-max items-center gap-2 rounded-2xl border border-emerald-500/30 bg-slate-900/70 p-1">
          {tiers.map((t) => (
            <button key={t} onClick={() => setTier(t)} className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm transition ${tier===t? 'bg-emerald-500 text-slate-900 shadow-[0_0_30px_rgba(16,185,129,0.45)]':'text-slate-300 hover:bg-slate-800/70'}`}>
              {t==='small' && <Users className="h-4 w-4"/>}
              {t==='medium' && <Building className="h-4 w-4"/>}
              {t==='enterprise' && <Building2 className="h-4 w-4"/>}
              <span className="capitalize">{t}</span>
            </button>
          ))}
        </div>
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Why Odin-Labs is Different</h2>
          <p className="mt-3 text-slate-300">Slide between before and after per company size</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Before */}
          <AnimatePresence mode="wait">
            <motion.div key={tier+':before'} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.35 }} className="rounded-3xl border border-red-500/20 bg-gradient-to-b from-slate-900 to-slate-950 p-6">
              <div className="mb-4 inline-flex rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-red-300">Before</div>
              <ul className="space-y-2 text-slate-300">
                {data.before.map((b) => (
                  <li key={b} className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>

          {/* After */}
          <AnimatePresence mode="wait">
            <motion.div key={tier+':after'} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.35 }} className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-slate-900 to-slate-950 p-6">
              <div className="absolute -inset-8 -z-0 rounded-3xl bg-[conic-gradient(from_180deg_at_50%_50%,rgba(16,185,129,0.1),transparent_40%)] blur-2xl" />
              <div className="relative mb-4 inline-flex rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-emerald-300">After (Odin-Labs)</div>
              <ul className="space-y-2 text-slate-300">
                {data.after.map((a) => (
                  <li key={a} className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {a}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
