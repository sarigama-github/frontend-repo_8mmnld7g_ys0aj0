import React, { useEffect, useRef } from 'react'

// Enhanced swarm/agents canvas animation with pseudo-3D depth, hubs, and tier-based complexity
// Props: speed ("calm" | "normal" | "fast"), tier ("small" | "medium" | "enterprise"), parallax {x,y}
export default function SwarmAgents({ speed = 'normal', tier = 'small', parallax = { x: 0, y: 0 } }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(0)
  const agentsRef = useRef([])
  const cfgRef = useRef({})

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
      small: { hubCount: 3, density: 13000, nodeGlow: 0.18, maxConn: 95 },
      medium: { hubCount: 4, density: 12000, nodeGlow: 0.22, maxConn: 110 },
      enterprise: { hubCount: 5, density: 10000, nodeGlow: 0.28, maxConn: 130 },
    }

    const init = () => {
      const tcfg = tierConfig[tier] || tierConfig.small
      const count = Math.floor((w * h) / tcfg.density) + 80
      const nodes = tcfg.hubCount
      const s = speed === 'fast' ? 1.6 : speed === 'calm' ? 0.7 : 1.0
      cfgRef.current = { count, nodes, s, nodeGlow: tcfg.nodeGlow, maxConn: tcfg.maxConn }

      // initialize hubs with depth layers
      const hubs = new Array(nodes).fill(0).map((_, i) => ({
        x: (w / (nodes + 1)) * (i + 1) + (Math.random() - 0.5) * 40,
        y: h * (0.35 + Math.sin(i * 1.3) * 0.12),
        r: 70 + Math.random() * 50,
        phase: Math.random() * Math.PI * 2,
        z: 0.6 + (i / Math.max(1, nodes - 1)) * 0.4, // 0.6..1.0 depth factor
      }))

      // agents with depth
      agentsRef.current = new Array(count).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        hub: Math.floor(Math.random() * nodes),
        z: 0.5 + Math.random() * 0.7, // depth 0.5..1.2
      }))

      cfgRef.current.hubs = hubs
    }

    init()

    let t = 0

    const step = () => {
      const { hubs, s, nodeGlow, maxConn } = cfgRef.current
      t += 0.005 * s

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

      // draw hubs glow first (depth-aware size)
      hubs.forEach((hub) => {
        const r = hub.r * (0.8 + hub.z * 0.4)
        const grad = ctx.createRadialGradient(hub.x, hub.y, 0, hub.x, hub.y, r)
        grad.addColorStop(0, `rgba(16,185,129,${nodeGlow})`)
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

      // update agents
      agentsRef.current.forEach((a) => {
        const hub = hubs[a.hub]
        const depth = a.z
        // attraction to hub + flow field steering
        const dx = hub.x + parX * (1.2 - depth) - a.x
        const dy = hub.y + parY * (1.2 - depth) - a.y
        const dist = Math.hypot(dx, dy) || 1
        const ax = (dx / dist) * 0.04 * s * (0.7 + depth * 0.6)
        const ay = (dy / dist) * 0.04 * s * (0.7 + depth * 0.6)

        const angle = field(a.x, a.y, depth) * Math.PI
        const fx = Math.cos(angle) * 0.05 * s * (0.6 + depth * 0.6)
        const fy = Math.sin(angle) * 0.05 * s * (0.6 + depth * 0.6)

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
        // node
        ctx.fillStyle = `rgba(16,185,129,${0.6 + depth * 0.4})`
        ctx.beginPath()
        ctx.arc(a.x, a.y, size * 0.8, 0, Math.PI * 2)
        ctx.fill()

        // connections to a few nearest in next N items for perf
        const localMax = maxConn * (0.8 + depth * 0.35)
        for (let j = i + 1; j < i + 10 && j < arr.length; j++) {
          const b = arr[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d = Math.hypot(dx, dy)
          if (d < localMax) {
            const alpha = 1 - d / localMax
            ctx.strokeStyle = `rgba(16,185,129,${alpha * (0.18 + depth * 0.15)})`
            ctx.lineWidth = 0.6 + depth * 0.7
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      })

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
