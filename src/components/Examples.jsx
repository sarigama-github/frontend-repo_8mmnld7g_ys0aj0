import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Building, Building2 } from 'lucide-react'

const tiers = ['small','medium','enterprise']

const examplesByTier = {
  small: [
    { title: 'Ship weekly roadmap in days', desc: '1-2 agents automate chores, devs focus on features.' },
    { title: 'Automated release notes & changelogs', desc: 'Instant docs from PR labels and commits.' },
    { title: 'Onboarding bots that prep repos for hires', desc: 'GH templates, envs, and scaffolds ready-to-run.' },
  ],
  medium: [
    { title: 'Repo-wide refactors at PR quality', desc: 'Multi-repo changes with eval + tests.' },
    { title: 'Integration tests from user stories', desc: 'Agents translate specs into high-signal tests.' },
    { title: 'Legacy-to-modern stack upgrades', desc: 'Language and framework migration with guardrails.' },
  ],
  enterprise: [
    { title: 'Standards enforcement with MCP tools', desc: 'Policy-aware agents create safe, compliant diffs.' },
    { title: 'Cross-org security patches', desc: 'Swarms roll out fixes with approvals + audit.' },
    { title: 'Continuous modernization', desc: 'Roadmapped upgrades across portfolios.' },
  ],
}

export default function Examples() {
  const [tier, setTier] = useState('small')
  const items = useMemo(() => examplesByTier[tier], [tier])

  return (
    <section id="use-cases" className="relative w-full bg-slate-950 py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_50%)]" />
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
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Real Examples</h2>
          <p className="mt-3 text-slate-300">Switch tiers to see what resonates for your team.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div key={item.title} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }} className="group relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-slate-900 to-slate-950 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-400/0 via-emerald-400/0 to-emerald-400/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative">
                  <div className="h-32 rounded-xl bg-slate-800/50 backdrop-blur-sm" />
                  <div className="pointer-events-none absolute inset-x-0 -bottom-10 h-10 bg-gradient-to-b from-transparent to-slate-950/90" />
                </div>
                <div className="relative mt-4">
                  <h3 className="text-base font-medium text-white">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{item.desc}</p>
                </div>
                <div className="absolute inset-0 scale-105 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100" style={{ boxShadow: '0 0 60px rgba(16,185,129,0.25) inset' }} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
