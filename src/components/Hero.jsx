import React, { useEffect, useMemo, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { ArrowRight, Play, Building2, Building, Users } from 'lucide-react'
import SwarmAgents from './SwarmAgents'
import Starfield from './Starfield'
import HeroCrest from './HeroCrest'
import HeroStory from './HeroStory'

const glow = {
  initial: { opacity: 0.45 },
  animate: { opacity: [0.35, 0.75, 0.35], scale: [1, 1.06, 1], transition: { duration: 6, repeat: Infinity } }
}

const tiers = ['small','medium','enterprise']

const tierCopy = {
  small: {
    label: 'Small team',
    sub: 'Start small with tool agents. Compound wins every week without process overhead.',
    impact: { title: 'Agent impact (last 7 days)', a: '12+ tasks automated', b: '5 scoped PRs', c: '~2d cycle time' },
  },
  medium: {
    label: 'Mid-size',
    sub: 'Coordinate agents across repos and squads. Ship with predictable quality.',
    impact: { title: 'Agent impact (last 7 days)', a: '48+ tasks automated', b: '22 scoped PRs', c: '~1.5d cycle time' },
  },
  enterprise: {
    label: 'Enterprise',
    sub: 'Swarms plan, code, and evaluate safely at scale with policy guardrails.',
    impact: { title: 'Agent impact (last 7 days)', a: '200+ tasks automated', b: '95 PRs with tests', c: '~1d cycle time' },
  },
}

export default function Hero() {
  // Fixed fast speed (no user controls)
  const speed = 'fast'
  // Default tier is enterprise for the most impressive visual
  const [tier, setTier] = useState('enterprise') // small | medium | enterprise

  // Mouse parallax
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const smx = useSpring(mx, { stiffness: 60, damping: 12 })
  const smy = useSpring(my, { stiffness: 60, damping: 12 })
  const rotateX = useTransform(smy, [ -50, 50 ], [ 6, -6 ])
  const rotateY = useTransform(smx, [ -50, 50 ], [ -6, 6 ])
  const translateHero = useTransform(smx, [-60,60], [-8,8])

  useEffect(() => {
    const onMove = (e) => {
      const { innerWidth, innerHeight } = window
      const x = (e.clientX / innerWidth) * 2 - 1
      const y = (e.clientY / innerHeight) * 2 - 1
      mx.set(x * 50)
      my.set(y * 50)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [mx, my])

  const copy = useMemo(() => tierCopy[tier], [tier])

  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden bg-slate-950">
      {/* Starfield and background grid */}
      <div className="pointer-events-none absolute inset-0">
        <Starfield />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.18),transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.06)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
      </div>

      {/* Unique swarm agents animation with tier-based complexity */}
      <div className="absolute inset-y-0 right-0 h-full w-full md:w-1/2" aria-hidden>
        <SwarmAgents speed={speed} tier={tier} parallax={{ x: (translateHero.get?.() ?? 0), y: 0 }} />
      </div>

      <motion.div style={{ rotateX, rotateY }} className="relative z-10 mx-auto flex max-w-7xl flex-col gap-10 px-6 pt-14 sm:pt-20 md:flex-row md:items-center md:gap-16 will-change-transform">
        {/* Copy + Brand */}
        <motion.div style={{ x: translateHero }} className="max-w-2xl">
          {/* Crest */}
          <HeroCrest />

          {/* Majestic Brand Lockup */}
          <div className="relative mt-4">
            {/* Subtle rotating rune ring behind the brand */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -inset-6 -z-10 rounded-full border border-emerald-400/20 bg-emerald-500/5"
              style={{ filter: 'blur(8px)' }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            />
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
              <span className="bg-gradient-to-b from-white via-emerald-100 to-emerald-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(16,185,129,0.25)]">
                Odin Labs
              </span>
            </h1>
            <div className="mt-2 text-lg font-medium text-emerald-300/90">
              AI Swarm Orchestration for Product Teams
            </div>
            {/* Emerald underline glow */}
            <div className="mt-3 h-1 w-28 rounded-full bg-emerald-400/60 shadow-[0_0_30px_rgba(16,185,129,0.55)]" />
          </div>

          <AnimatePresence mode="wait">
            <motion.p key={tier} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }} className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
              {copy.sub}
            </motion.p>
          </AnimatePresence>

          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.7 }} className="mt-8 flex flex-wrap gap-3">
            <a href="#cta" className="group inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-medium text-slate-900 transition hover:bg-emerald-400 hover:shadow-[0_0_40px_rgba(16,185,129,0.45)]">
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href="#use-cases" className="group inline-flex items-center gap-2 rounded-xl border border-emerald-500/50 bg-slate-900/60 px-5 py-3 font-medium text-emerald-300 hover:bg-slate-900/80 hover:shadow-[0_0_40px_rgba(16,185,129,0.35)]">
              <Play className="h-4 w-4" />
              See Use Cases by Tier
            </a>
          </motion.div>

          {/* Tier segmented control */}
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="mt-6 inline-flex items-center gap-1 rounded-2xl border border-emerald-500/30 bg-slate-900/70 p-1 text-sm backdrop-blur">
            {tiers.map((t) => (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={`group flex items-center gap-2 rounded-xl px-3.5 py-2 transition ${tier===t? 'bg-emerald-500 text-slate-900 shadow-[0_0_30px_rgba(16,185,129,0.45)]':'text-slate-300 hover:bg-slate-800/70'}`}
              >
                {t==='small' && <Users className="h-4 w-4"/>}
                {t==='medium' && <Building className="h-4 w-4"/>}
                {t==='enterprise' && <Building2 className="h-4 w-4"/>}
                <span>{tierCopy[t].label}</span>
              </button>
            ))}
          </motion.div>

          {/* Impact HUD that swaps per tier */}
          <AnimatePresence mode="wait">
            <motion.div key={tier+':hud'} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }} className="mt-8 w-full max-w-md overflow-hidden rounded-2xl border border-emerald-500/25 bg-slate-900/60 p-4">
              <div className="mb-2 text-xs uppercase tracking-wide text-emerald-300/80">{copy.impact.title}</div>
              <div className="grid grid-cols-3 gap-3 text-sm text-slate-200">
                <div className="rounded-lg border border-emerald-500/20 bg-slate-800/60 p-3 text-center">{copy.impact.a}</div>
                <div className="rounded-lg border border-emerald-500/20 bg-slate-800/60 p-3 text-center">{copy.impact.b}</div>
                <div className="rounded-lg border border-emerald-500/20 bg-slate-800/60 p-3 text-center">{copy.impact.c}</div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Storytelling wave tied to architecture */}
          <HeroStory tier={tier} />

          {/* Micro points under hero */}
          <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-slate-400 sm:max-w-lg">
            {[
              'Crested brand reveal',
              'Staged network activation',
              'Emerald accents, elevated',
              'Designed for teams of all sizes',
            ].map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 * i }} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {t}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Ambient glow */}
      <motion.div variants={glow} initial="initial" animate="animate" className="pointer-events-none absolute -bottom-20 left-1/2 h-72 w-[48rem] -translate-x-1/2 rounded-full bg-emerald-500/30 blur-3xl" />
    </section>
  )
}
