import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
  return (
    <section id="cta" className="relative w-full bg-slate-950 py-24">
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h3 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-3xl font-semibold text-white sm:text-4xl">
            Level Up Your Engineering Organization.
          </motion.h3>
          <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.6 }} className="mt-3 text-slate-300">
            Start with simple agents, scale to fully autonomous development flows.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.6 }} className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#" className="group inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-medium text-slate-900 transition hover:bg-emerald-400">
              Book a Demo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href="#use-cases" className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-slate-900/50 px-6 py-3 font-medium text-emerald-300 hover:bg-slate-900/80">
              Explore Agent Use Cases
            </a>
          </motion.div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-emerald-500/10 to-transparent" />
    </section>
  )
}
