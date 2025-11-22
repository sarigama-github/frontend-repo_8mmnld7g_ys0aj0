import React, { useEffect, useRef } from 'react'

// Enhanced swarm/agents canvas animation with pseudo-3D depth, hubs, tier-based complexity,
// plus a 3D network scaffold (bezier arcs + depth blur) and a central coordination core
// that pulses stronger as tiers increase. Adds staged startup: hubs, core, scaffold, then nodes/links
// fade in sequentially for a dramatic entrance, with tier-driven timing (enterprise = longer, more epic).
// Props: speed ("calm" | "normal" | "fast"), tier ("small" | "medium" | "enterprise"), parallax {x,y}
export default function SwarmAgents({ speed = 'normal', tier = 'small', parallax = { x: 0, y: 0 } }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(0)
  const agentsRef = useRef([])
  const cfgRef = useRef({})
  const startTsRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const DPR = Math.min(2, window.devicePixelRatio || 1)

    let w = canvas.clientWidth
    let h = canvas.clientHeight
    canvas.width = Math.floor(w * DPR)
    canvas.height = Math.floor(h * DPR)
    ctx.scale(DPR, DPR)

    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.floor(w * DPR)
      canvas.height = Math.floor(h * DPR)
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      init()
    }

    const onResize = () => requestAnimationFrame(resize)
    window.addEventListener('resize', onResize)

    const tierConfig = {
      small: { hubCount: 3, density: 13000, nodeGlow: 0.18, maxConn: 95, corePulse: 0.7, timingScale: 0.9 },
      medium: { hubCount: 4, density: 12000, nodeGlow: 0.22, maxConn: 110, corePulse: 1.0, timingScale: 1.0 },
      enterprise: { hubCount: 5, density: 10000, nodeGlow: 0.28, maxConn: 130, corePulse: 1.35, timingScale: 1.25 },
    }

    const init = () => {
      const tcfg = tierConfig[tier] || tierConfig.small
      const count = Math.floor((w * h) / tcfg.density) + 80
      const nodes = tcfg.hubCount
      const s = speed === 'fast' ? 1.6 : speed === 'calm' ? 0.7 : 1.0
      cfgRef.current = { count, nodes, s, nodeGlow: tcfg.nodeGlow, maxConn: tcfg.maxConn, corePulse: tcfg.corePulse, timingScale: tcfg.timingScale }

      // initialize hubs with depth layers
      const hubs = new Array(nodes).fill(0).map((_, i) => ({
        x: (w / (nodes + 1)) * (i + 1) + (Math.random() - 0.5) * 40,
        y: h * (0.35 + Math.sin(i * 1.3) * 0.12),
        r: 70 + Math.random() * 50,
        phase: Math.random() * Math.PI * 2,
        z: 0.6 + (i / Math.max(1, nodes - 1)) * 0.4, // 0.6..1.0 depth factor
      }))

      // agents with depth + staged activation
      agentsRef.current = new Array(count).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        hub: Math.floor(Math.random() * nodes),
        z: 0.5 + Math.random() * 0.7, // depth 0.5..1.2
        delay: Math.random() * 2.6 + 0.2, // seconds before it "comes alive"
        act: 0, // 0..1 activation
      }))

      cfgRef.current.hubs = hubs
      startTsRef.current = performance.now()
    }

    init()

    let t = 0

    const clamp01 = (v) => Math.max(0, Math.min(1, v))
    const ease = (p) => p * p * (3 - 2 * p) // smoothstep-like

    // draw a subtle scaffold of bezier arcs between hubs
    const drawScaffold = (hubs, time, intensity) => {
      if (!hubs || hubs.length < 2 || intensity <= 0.001) return
      const maxPairs = Math.min(6 + Math.floor(intensity * 4), (hubs.length * (hubs.length - 1)) / 2)
      let drawn = 0
      for (let i = 0; i < hubs.length; i++) {
        for (let j = i + 1; j < hubs.length; j++) {
          if (drawn++ > maxPairs) return
          const a = hubs[i]
          const b = hubs[j]
          const midx = (a.x + b.x) / 2
          const midy = (a.y + b.y) / 2
          const dx = b.x - a.x
          const dy = b.y - a.y
          const dist = Math.hypot(dx, dy)
          // control point offset creates a soft arc, animated by time
          const normalX = -dy / (dist || 1)
          const normalY = dx / (dist || 1)
          const wobble = Math.sin(time * 1.6 + i * 0.9 + j * 0.6)
          const bulge = Math.min(120, 40 + dist * 0.08) * (0.6 + intensity * 0.5)
          const cx = midx + normalX * bulge * (0.6 + 0.4 * wobble)
          const cy = midy + normalY * bulge * (0.6 + 0.4 * wobble)

          // depth-aware blur based on hub depths
          const z = (a.z + b.z) / 2
          ctx.save()
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.quadraticCurveTo(cx, cy, b.x, b.y)
          const alpha = 0.05 + z * 0.08 * (0.8 + intensity * 0.6)
          ctx.strokeStyle = `rgba(16,185,129,${alpha})`
          ctx.lineWidth = 1 + z * 1.2
          ctx.shadowColor = 'rgba(16,185,129,0.35)'
          ctx.shadowBlur = 6 + 10 * z
          ctx.stroke()
          ctx.restore()
        }
      }
    }

    // central coordination core pulse
    const drawCore = (time, intensity) => {
      if (intensity <= 0.001) return
      const cx = w * 0.36 // slightly left of center so content overlay feels balanced
      const cy = h * 0.48
      const baseR = Math.min(w, h) * 0.08
      const pulse = (Math.sin(time * 2.1) + 1) / 2 // 0..1
      const r = baseR * (0.9 + pulse * 0.25 * intensity)

      // radial glow
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.2)
      grad.addColorStop(0, `rgba(16,185,129,${0.10 * intensity})`)
      grad.addColorStop(1, 'rgba(16,185,129,0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(cx, cy, r * 2.2, 0, Math.PI * 2)
      ctx.fill()

      // inner core
      const innerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
      innerGrad.addColorStop(0, `rgba(16,185,129,${0.25 + 0.25 * pulse * intensity})`)
      innerGrad.addColorStop(1, 'rgba(16,185,129,0)')
      ctx.fillStyle = innerGrad
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fill()

      // rotating ring accents
      const ringCount = 2 + Math.round(intensity)
      for (let i = 0; i < ringCount; i++) {
        const rr = r * (1.2 + i * 0.25)
        const start = time * (0.6 + 0.2 * i)
        const sweep = Math.PI * (0.6 + 0.15 * i)
        ctx.save()
        ctx.beginPath()
        ctx.strokeStyle = `rgba(16,185,129,${0.18 - i * 0.04})`
        ctx.lineWidth = 1.2
        ctx.arc(cx, cy, rr, start, start + sweep)
        ctx.stroke()
        ctx.restore()
      }
    }

    const step = () => {
      const { hubs, s, nodeGlow, maxConn, corePulse, timingScale } = cfgRef.current
      t += 0.005 * s

      // elapsed time in seconds since init for staged startup
      const elapsed = (performance.now() - startTsRef.current) / 1000
      // tier-driven timing: enterprise holds each stage longer for a bigger crescendo
      const tg = timingScale || 1.0
      const hubProgress = ease(clamp01((elapsed - 0.2 * tg) / (1.0 * tg)))
      const coreProgress = ease(clamp01((elapsed - 0.5 * tg) / (1.0 * tg)))
      const scaffoldProgress = ease(clamp01((elapsed - 0.9 * tg) / (1.6 * tg)))

      // clear with subtle trail for flow
      const bgAlpha = 0.08
      ctx.fillStyle = `rgba(2, 6, 23, ${bgAlpha})` // slate-950 with alpha
      ctx.fillRect(0, 0, w, h)

      // animate hubs
      hubs.forEach((hub, i) => {
        hub.x += Math.cos(t * (1.2 + i * 0.08)) * 0.25
        hub.y += Math.sin(t * (1.35 + i * 0.07)) * 0.22
        hub.phase += 0.01
      })

      // draw hubs glow first (depth-aware size) with staged opacity
      hubs.forEach((hub) => {
        const r = hub.r * (0.8 + hub.z * 0.4)
        const grad = ctx.createRadialGradient(hub.x, hub.y, 0, hub.x, hub.y, r)
        grad.addColorStop(0, `rgba(16,185,129,${nodeGlow * hubProgress})`)
        grad.addColorStop(1, 'rgba(16,185,129,0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(hub.x, hub.y, r, 0, Math.PI * 2)
        ctx.fill()
      })

      // parallax influence subtly alters desired center (depth weighted)
      const parX = (parallax?.x || 0)
      const parY = (parallax?.y || 0)

      // Precompute a flow field via trig noise
      const field = (x, y, z) => {
        const n = Math.sin((x + t * 200) * 0.002 * (1 + (z - 1) * 0.2)) + Math.cos((y - t * 160) * 0.0023 * (1 + (z - 1) * 0.25))
        return n
      }

      // subtle network scaffold connecting hubs (staged in)
      drawScaffold(hubs, t * (1.1 + 0.2 * s), corePulse * scaffoldProgress)

      // update agents with activation
      agentsRef.current.forEach((a) => {
        // activation based on individual delay (scale delays by tier timing)
        const act = ease(clamp01((elapsed - a.delay * tg) / (0.9 * tg)))
        a.act = act
        const hub = hubs[a.hub]
        const depth = a.z
        // attraction to hub + flow field steering, scaled by activation
        const dx = hub.x + parX * (1.2 - depth) - a.x
        const dy = hub.y + parY * (1.2 - depth) - a.y
        const dist = Math.hypot(dx, dy) || 1
        const ax = (dx / dist) * 0.04 * s * (0.5 + 0.5 * act) * (0.7 + depth * 0.6)
        const ay = (dy / dist) * 0.04 * s * (0.5 + 0.5 * act) * (0.7 + depth * 0.6)

        const angle = field(a.x, a.y, depth) * Math.PI
        const fx = Math.cos(angle) * 0.05 * s * (0.3 + 0.7 * act) * (0.6 + depth * 0.6)
        const fy = Math.sin(angle) * 0.05 * s * (0.3 + 0.7 * act) * (0.6 + depth * 0.6)

        a.vx += ax + fx
        a.vy += ay + fy

        // limit speed (depth aware)
        const sp = Math.hypot(a.vx, a.vy)
        const lim = (0.9 * s) * (0.7 + depth * 0.6)
        if (sp > lim) {
          a.vx = (a.vx / sp) * lim
          a.vy = (a.vy / sp) * lim
        }

        a.x += a.vx
        a.y += a.vy

        // wrap bounds softly
        if (a.x < -10) a.x = w + 10
        if (a.x > w + 10) a.x = -10
        if (a.y < -10) a.y = h + 10
        if (a.y > h + 10) a.y = -10
      })

      // draw connections and nodes (sorted by depth for pseudo-3D layering)
      const arr = agentsRef.current.slice().sort((a, b) => a.z - b.z)
      arr.forEach((a, i) => {
        const depth = a.z
        const size = 1 + depth * 1.2
        const alphaNode = (0.6 + depth * 0.4) * a.act
        if (alphaNode > 0.001) {
          // node
          ctx.fillStyle = `rgba(16,185,129,${alphaNode})`
          ctx.beginPath()
          ctx.arc(a.x, a.y, size * 0.8, 0, Math.PI * 2)
          ctx.fill()
        }

        // connections to a few nearest in next N items for perf
        const localMax = (maxConn * (0.8 + depth * 0.35)) * (0.5 + 0.5 * a.act) // ramp distance with activation
        if (a.act > 0.15) {
          for (let j = i + 1; j < i + 10 && j < arr.length; j++) {
            const b = arr[j]
            const dx = a.x - b.x
            const dy = a.y - b.y
            const d = Math.hypot(dx, dy)
            if (d < localMax && b.act > 0.15) {
              const alpha = (1 - d / localMax) * Math.min(a.act, b.act)
              ctx.strokeStyle = `rgba(16,185,129,${alpha * (0.18 + depth * 0.15)})`
              ctx.lineWidth = 0.6 + depth * 0.7
              ctx.beginPath()
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(b.x, b.y)
              ctx.stroke()
            }
          }
        }
      })

      // draw central coordination core last so it sits above scaffold but under nodes
      drawCore(t, corePulse * coreProgress)

      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [speed, tier, parallax.x, parallax.y])

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      style={{ display: 'block' }}
      aria-hidden
    />
  )
}
