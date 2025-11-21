import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Lock, CircuitBoard, CheckCircle2 } from 'lucide-react'

const points = [
  'Right-sized guardrails (no heavy process)',
  'Local-first execution when needed',
  'Capability isolation & circuit breakers',
  'Deterministic diffs with human-in-the-loop',
  'Auditability without bureaucracy',
  'Secure MCP gateway for tools',
]

export default function EnterpriseSafety() {
  return (
    <section className="relative w-full bg-slate-950 py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.08),transparent_50%)]" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Safety & Control Model</h2>
          <p className="mt-3 text-slate-300">Designed for startups and growing teams—confidence without slowdown</p>
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
          <div className="grid gap-3">
            {points.map((p, i) => (
              <motion.div key={p} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ delay: i * 0.06 }} className="flex items-center gap-3 rounded-xl border border-emerald-500/25 bg-slate-900/60 p-4">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span className="text-slate-200">{p}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
