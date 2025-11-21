import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Building, Building2, ShieldCheck, Lock, CircuitBoard, CheckCircle2 } from 'lucide-react'

const tiers = ['small','medium','enterprise']

const pointsByTier = {
  small: [
    'Right-sized guardrails (no heavy process)',
    'Local-first execution when needed',
    'Capability isolation & circuit breakers',
    'Deterministic diffs with human-in-the-loop',
    'Auditability without bureaucracy',
    'Secure MCP gateway for tools',
  ],
  medium: [
    'Scoped permissions per squad',
    'Replayable runs with context',
    'Secrets management baked-in',
    'Static + runtime analysis gates',
    'Org-level visibility dashboards',
    'Break-glass procedures for incidents',
  ],
  enterprise: [
    'Policy-aware execution and approvals',
    'Air-gapped/local modes for sensitive code',
    'Granular RBAC and audit trails',
    'PII-safe evaluation + redaction',
    'Vendor risk controls and SLAs',
    'Compliance exports (SOX, ISO, SOC2)',
  ],
}

export default function EnterpriseSafety() {
  const [tier, setTier] = useState('small')
  const points = useMemo(() => pointsByTier[tier], [tier])

  return (
    <section className="relative w-full bg-slate-950 py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.08),transparent_50%)]" />
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
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Safety & Control Model</h2>
          <p className="mt-3 text-slate-300">Confidence without slowdown — tailored controls per company size</p>
        </div>

        <div className="grid items-start gap-8 md:grid-cols-2">
          {/* Graphic */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-emerald-400/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-slate-900/50 p-8">
              <div className="relative h-64 rounded-2xl border border-emerald-500/20 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.25),transparent_40%)]">
                <motion.div initial={{ scale: 0.95, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="absolute left-6 top-6 rounded-xl border border-emerald-500/20 bg-slate-800/60 p-3">
                  <Lock className="h-6 w-6 text-emerald-400" />
                </motion.div>
                <motion.div initial={{ y: 12, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.15, duration: 0.8 }} className="absolute right-6 top-12 rounded-xl border border-emerald-500/20 bg-slate-800/60 p-3">
                  <CircuitBoard className="h-6 w-6 text-emerald-400" />
                </motion.div>
                <motion.div initial={{ y: -12, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/30 bg-emerald-400/10 p-6">
                  <ShieldCheck className="h-10 w-10 text-emerald-400" />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Points */}
          <AnimatePresence mode="wait">
            <div className="grid gap-3">
              {points.map((p, i) => (
                <motion.div key={tier+':'+p} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ delay: i * 0.04, duration: 0.3 }} className="flex items-center gap-3 rounded-xl border border-emerald-500/25 bg-slate-900/60 p-4">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <span className="text-slate-200">{p}</span>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
