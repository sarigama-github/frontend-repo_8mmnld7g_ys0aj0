import React from 'react'
import { motion } from 'framer-motion'

const tierVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: (i) => ({ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.15, duration: 0.6 } })
}

export default function ValuePyramid() {
  const tiers = [
    {
      title: 'Tool Agents (Simple)',
      points: ['Automate repetitive actions', 'Safe, sandboxed execution', 'Deterministic behavior'],
      value: 'fast wins, instant productivity boost.',
    },
    {
      title: 'Agentic Workflows (Intermediate)',
      points: ['Multi-step planning', 'Memory-driven context', 'Collaboration between multiple agents'],
      value: 'eliminate weeks of manual engineering work, reliably and safely.',
    },
    {
      title: 'Autonomous Flows (Advanced)',
      points: ['Self-evaluating', 'Memory evolving', 'Continuous improvement'],
      value: "fully automated development pipelines running inside the client's local infrastructure.",
    },
  ]

  return (
    <section id="pyramid" className="relative w-full bg-slate-950 py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_50%)]" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">The Value Pyramid</h2>
          <p className="mt-3 text-slate-300">Simple → Agentic → Autonomous</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {tiers.map((t, i) => (
            <motion.div key={t.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }} variants={tierVariants} className="group relative rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-slate-900 to-slate-950 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              {/* Animated ladder step */}
              <div className="absolute inset-x-0 -top-0.5 h-1 rounded-t-2xl bg-gradient-to-r from-emerald-400/0 via-emerald-400/60 to-emerald-400/0 opacity-60 transition group-hover:opacity-100" />
              <h3 className="text-xl font-medium text-white">{t.title}</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {t.points.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-emerald-400" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-emerald-300/90">Value: {t.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
