import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Sparkles } from 'lucide-react'

// Glyph crest with faint rotational shimmer and spotlight sweep
export default function HeroCrest() {
  return (
    <div className="relative inline-flex items-center gap-3">
      <motion.div
        className="relative grid h-12 w-12 place-items-center rounded-xl border border-emerald-400/25 bg-slate-900/70 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.25)]"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{ background: 'conic-gradient(from 180deg, rgba(16,185,129,0.0), rgba(16,185,129,0.18), rgba(16,185,129,0.0))' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />
        <Shield className="relative h-6 w-6" />
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{ background: 'linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)' }}
          animate={{ backgroundPosition: ['-150% 0%', '150% 0%'] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.2 }}
        />
      </motion.div>
      <div className="hidden sm:block text-emerald-300/80 text-sm">Trusted orchestration core</div>
    </div>
  )
}
