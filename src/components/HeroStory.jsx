import React, { useEffect } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { Sparkles, Gauge, ShieldCheck, Brain, Boxes, Rocket } from 'lucide-react'

// Storytelling rail that visualizes how each architecture layer upgrades outcomes.
// Auto-plays a wave of reveals. Copy adapts to tier, but message stays: scale your output.
const layers = [
  { name: 'Intent & Governance', icon: ShieldCheck },
  { name: 'Cognitive Planning', icon: Brain },
  { name: 'Memory & Context', icon: Boxes },
  { name: 'Tooling & Execution', icon: Rocket },
  { name: 'Agent Runtime', icon: Gauge },
  { name: 'Safety & Operations', icon: ShieldCheck },
  { name: 'Evolution & Learning', icon: Sparkles },
]

const tierBoost = {
  small: { pct: [8, 10, 12, 14, 16, 18, 20], label: 'Compounded lift' },
  medium: { pct: [12, 15, 18, 22, 25, 28, 32], label: 'Programmatic lift' },
  enterprise: { pct: [18, 22, 28, 34, 40, 46, 52], label: 'Scaled lift' },
}

export default function HeroStory({ tier = 'enterprise' }) {
  const controls = useAnimationControls()

  useEffect(() => {
    // Stagger the wave in a loop with a brief idle pause
    async function run() {
      while (true) {
        for (let i = 0; i < layers.length; i++) {
          await controls.start((idx) => idx === i ? {
            opacity: 1, y: 0, filter: 'blur(0px)',
            transition: { duration: 0.5, ease: 'easeOut' }
          } : {})
          // subtle pulse on the connector during each step
          controls.start('linePulse')
          await new Promise(r => setTimeout(r, 200))
        }
        await new Promise(r => setTimeout(r, 2500))
        controls.set((idx) => ({ opacity: 0.12, y: 8, filter: 'blur(2px)' }))
      }
    }
    run()
  }, [controls])

  const boosts = tierBoost[tier] || tierBoost.enterprise

  return (
    <section className="relative mt-14">
      {/* Soft backdrop and grid accent */}
      <div className="absolute -inset-x-8 -inset-y-6 rounded-3xl border border-emerald-500/15 bg-slate-900/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]" />

      <div className="relative px-2 py-6">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">From intent to impact</h3>
            <p className="mt-1 text-sm text-slate-300">Each layer compounds capability. Same clarity, bigger outcomes — for every team size.</p>
          </div>
          <div className="text-sm text-emerald-300/90">Tier: {tier[0].toUpperCase()+tier.slice(1)}</div>
        </div>

        {/* Connector line with pulsing sweep */}
        <motion.div
          variants={{ linePulse: { boxShadow: [
            '0 0 0px rgba(16,185,129,0.0)',
            '0 0 24px rgba(16,185,129,0.25)',
            '0 0 0px rgba(16,185,129,0.0)'
          ], transition: { duration: 0.9 } } }}
          animate={controls}
          className="relative mb-5 h-1.5 w-full overflow-hidden rounded-full bg-gradient-to-r from-emerald-500/20 via-emerald-500/40 to-emerald-500/20"
        >
          <motion.span
            initial={{ x: '-20%' }}
            animate={{ x: ['-20%', '120%'] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'linear' }}
            className="pointer-events-none absolute -top-2 h-5 w-24 rotate-6 rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-30"
          />
        </motion.div>

        {/* Steps */}
        <div className="grid gap-3 sm:grid-cols-2">
          {layers.map((l, i) => {
            const Icon = l.icon
            const pct = boosts.pct[i]
            return (
              <motion.div
                key={l.name}
                custom={i}
                initial={{ opacity: 0.12, y: 8, filter: 'blur(2px)' }}
                animate={controls}
                className="relative overflow-hidden rounded-xl border border-white/5 bg-slate-900/60 p-4"
              >
                {/* Sweep highlight */}
                <motion.div
                  initial={{ x: '-120%' }}
                  animate={{ x: ['-120%', '120%'] }}
                  transition={{ delay: i * 0.15 + 0.4, duration: 1.2, repeat: Infinity }}
                  className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/2 rotate-6 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  style={{ mixBlendMode: 'screen' }}
                />

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="text-sm font-medium text-white">{l.name}</div>
                      <div className="text-xs text-slate-400">Improves routing, context fidelity, and execution quality.</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-wide text-emerald-300/80">{boosts.label}</div>
                    <div className="text-sm font-semibold text-emerald-300">+{pct}%</div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
