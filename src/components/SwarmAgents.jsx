import React, { useEffect, useRef } from 'react'

// A lightweight swarm/agents canvas animation with connection lines and subtle parallax responsiveness
// Props: speed ("calm" | "normal" | "fast"), accent color via CSS (uses emerald by default)
export default function SwarmAgents({ speed = 'normal', parallax = { x: 0, y: 0 } }) {
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

    // configuration
    const init = () => {
      const count = Math.floor((w * h) / 14000) + 80 // responsive number of agents
      const nodes = 4 // swarm attractor hubs
      const s = speed === 'fast' ? 1.6 : speed === 'calm' ? 0.7 : 1.0
      cfgRef.current = { count, nodes, s }

      // initialize hubs
      const hubs = new Array(nodes).fill(0).map((_, i) => ({
        x: (w / (nodes + 1)) * (i + 1) + (Math.random() - 0.5) * 40,
        y: h * (0.35 + Math.sin(i * 1.7) * 0.1),
        r: 80 + Math.random() * 40,
        phase: Math.random() * Math.PI * 2,
      }))

      // agents
      agentsRef.current = new Array(count).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        hub: Math.floor(Math.random() * nodes),
      }))

      cfgRef.current.hubs = hubs
    }

    init()

    let t = 0

    const step = () => {
      const { hubs, s } = cfgRef.current
      t += 0.005 * s
      // move hubs a little in Lissajous paths for life
      hubs.forEach((hub, i) => {
        const k = 0.6 + i * 0.08
        hub.x += Math.cos(t * (1.2 + i * 0.1)) * 0.2
        hub.y += Math.sin(t * (1.4 + i * 0.07)) * 0.18
        hub.phase += 0.01
      })

      // clear with subtle trail for flow
      const bgAlpha = 0.1
      ctx.fillStyle = `rgba(2, 6, 23, ${bgAlpha})` // slate-950 with alpha
      ctx.fillRect(0, 0, w, h)

      // draw hubs glow first
      hubs.forEach((hub) => {
        const grad = ctx.createRadialGradient(hub.x, hub.y, 0, hub.x, hub.y, hub.r)
        grad.addColorStop(0, 'rgba(16,185,129,0.18)')
        grad.addColorStop(1, 'rgba(16,185,129,0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(hub.x, hub.y, hub.r, 0, Math.PI * 2)
        ctx.fill()
      })

      // update + draw agents
      const maxConnDist = 110
      const MAX_SPEED = 0.9 * s

      // parallax influence subtly alters desired center
      const parX = (parallax?.x || 0) * 0.6
      const parY = (parallax?.y || 0) * 0.6

      // Precompute a flow field via trig noise
      const field = (x, y) => {
        const n = Math.sin((x + t * 200) * 0.002) + Math.cos((y - t * 160) * 0.0023)
        return n
      }

      // first pass: integration
      agentsRef.current.forEach((a) => {
        const hub = hubs[a.hub]
        // attraction to hub + flow field steering
        const dx = hub.x + parX - a.x
        const dy = hub.y + parY - a.y
        const dist = Math.hypot(dx, dy) || 1
        const ax = (dx / dist) * 0.04 * s
        const ay = (dy / dist) * 0.04 * s

        const angle = field(a.x, a.y) * Math.PI
        const fx = Math.cos(angle) * 0.05 * s
        const fy = Math.sin(angle) * 0.05 * s

        a.vx += ax + fx
        a.vy += ay + fy

        // limit speed
        const sp = Math.hypot(a.vx, a.vy)
        const lim = MAX_SPEED
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

      // second pass: connections + draw
      ctx.lineWidth = 1
      agentsRef.current.forEach((a, i) => {
        // node
        ctx.fillStyle = 'rgba(16,185,129,0.9)'
        ctx.beginPath()
        ctx.arc(a.x, a.y, 1.3, 0, Math.PI * 2)
        ctx.fill()

        // connections to a few nearest
        for (let j = i + 1; j < i + 12 && j < agentsRef.current.length; j++) {
          const b = agentsRef.current[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d = Math.hypot(dx, dy)
          if (d < maxConnDist) {
            const alpha = 1 - d / maxConnDist
            ctx.strokeStyle = `rgba(16,185,129,${alpha * 0.25})`
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
  }, [speed, parallax.x, parallax.y])

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      style={{ display: 'block' }}
      aria-hidden
    />
  )
}
