import React, { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, Play, Zap, Turtle, Gauge } from 'lucide-react'
import SwarmAgents from './SwarmAgents'

const glow = {
  initial: { opacity: 0.45 },
  animate: { opacity: [0.35, 0.75, 0.35], scale: [1, 1.06, 1], transition: { duration: 6, repeat: Infinity } }
}

export default function Hero() {
  const [speed, setSpeed] = useState('normal') // calm | normal | fast

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

  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden bg-slate-950">
      {/* Background gradient + grid with stronger emerald accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.18),transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.06)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
      </div>

      {/* Unique swarm agents animation replacing generic Spline scene */}
      <div className="absolute inset-y-0 right-0 h-full w-full md:w-1/2" aria-hidden>
        <SwarmAgents speed={speed} parallax={{ x: (translateHero.get?.() ?? 0), y: 0 }} />
      </div>

      <motion.div style={{ rotateX, rotateY }} className="relative z-10 mx-auto flex max-w-7xl flex-col gap-10 px-6 pt-24 sm:pt-28 md:flex-row md:items-center md:gap-16 will-change-transform">
        {/* Copy */}
        <motion.div style={{ x: translateHero }} className="max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-emerald-300 shadow-[0_0_60px_rgba(16,185,129,0.25)]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Agentic Engineering
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05, duration: 0.7 }} className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
            10x your product velocity with AI agents.
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.7 }} className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
            Start small with simple tool agents. Scale to autonomous swarms that plan, code, and ship. Built for lean teams and fast-moving startups.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.7 }} className="mt-8 flex flex-wrap gap-3">
            <a href="#cta" className="group inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-medium text-slate-900 transition hover:bg-emerald-400 hover:shadow-[0_0_40px_rgba(16,185,129,0.45)]">
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href="#use-cases" className="group inline-flex items-center gap-2 rounded-xl border border-emerald-500/50 bg-slate-900/60 px-5 py-3 font-medium text-emerald-300 hover:bg-slate-900/80 hover:shadow-[0_0_40px_rgba(16,185,129,0.35)]">
              <Play className="h-4 w-4" />
              See Startup Use Cases
            </a>
          </motion.div>

          {/* Speed control micro-interaction */}
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.25 }} className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-slate-900/60 p-1 text-sm text-slate-300">
            <span className="px-2 text-xs text-emerald-300">Motion</span>
            <button onClick={() => setSpeed('calm')} className={`flex items-center gap-1 rounded-full px-3 py-1 transition ${speed==='calm' ? 'bg-emerald-500 text-slate-900' : 'hover:bg-slate-800/60'}`}>
              <Turtle className="h-4 w-4" /> Calm
            </button>
            <button onClick={() => setSpeed('normal')} className={`flex items-center gap-1 rounded-full px-3 py-1 transition ${speed==='normal' ? 'bg-emerald-500 text-slate-900' : 'hover:bg-slate-800/60'}`}>
              <Gauge className="h-4 w-4" /> Normal
            </button>
            <button onClick={() => setSpeed('fast')} className={`flex items-center gap-1 rounded-full px-3 py-1 transition ${speed==='fast' ? 'bg-emerald-500 text-slate-900' : 'hover:bg-slate-800/60'}`}>
              <Zap className="h-4 w-4" /> Fast
            </button>
          </motion.div>

          {/* Micro points under hero */}
          <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-slate-400 sm:max-w-lg">
            {[
              'Swarm agent orchestration',
              'Parallax + live motion control',
              'Emerald accents, elevated',
              'Designed for lean teams',
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
