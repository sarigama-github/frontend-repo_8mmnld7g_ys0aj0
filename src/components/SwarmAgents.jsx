import React, { useEffect, useRef } from 'react'

// Swarm/agents canvas animation with pseudo-3D depth, hubs, tier-based complexity,
// 3D scaffold arcs, and a pulsing coordination core. Adds staged startup: hubs → core →
// scaffold → nodes/links. Story mode weaves a looping sequence of beats that modulate
// the network AND overlays premium, value-centric KPI beacons to clearly show "what's
// in it for me" to prospective customers.
// Props: speed ("calm" | "normal" | "fast"), tier ("small" | "medium" | "enterprise"),
// parallax {x,y}, story (boolean)
export default function SwarmAgents({ speed = 'normal', tier = 'small', parallax = { x: 0, y: 0 }, story = true }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(0)
  const agentsRef = useRef([])
  const cfgRef = useRef({})
  const startTsRef = useRef(0)
  const coverageRef = useRef(new Set()) // track which hubs have been connected to by beacons in the current cycle
  const currentBeatRef = useRef(-1)
  const zoneRef = useRef(0)

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
      small: { hubCount: 3, density: 13000, nodeGlow: 0.18, maxConn: 95, corePulse: 0.7 },
      medium: { hubCount: 4, density: 12000, nodeGlow: 0.22, maxConn: 110, corePulse: 1.0 },
      enterprise: { hubCount: 5, density: 10000, nodeGlow: 0.28, maxConn: 130, corePulse: 1.35 },
    }

    // Beats with modulation and KPI sets per beat.
    const beats = [
      { name: 'Intent & Governance', hue: 158, core: 1.00, links: 1.00, spawn: 1.00, kpis: [
        { label: 'Policy coverage', value: '100%' },
        { label: 'Risky ops blocked', value: '-37%' },
        { label: 'Approval latency', value: '-42%' },
      ]},
      { name: 'Cognitive Planning', hue: 156, core: 1.05, links: 1.10, spawn: 1.08, kpis: [
        { label: 'Decomposition speed', value: '+68%' },
        { label: 'Plan coherence', value: '+35%' },
        { label: 'Handoff errors', value: '-54%' },
      ]},
      { name: 'Memory & Context', hue: 160, core: 1.08, links: 1.12, spawn: 1.15, kpis: [
        { label: 'Retrieval precision', value: '+22%' },
        { label: 'Context window', value: '80k' },
        { label: 'Duped work', value: '-41%' },
      ]},
      { name: 'Tooling & Execution', hue: 158, core: 1.12, links: 1.18, spawn: 1.22, kpis: [
        { label: 'Tasks automated', value: '+48' },
        { label: 'Lead time', value: '-36%' },
        { label: 'PR throughput', value: '+95' },
      ]},
      { name: 'Agent Runtime', hue: 162, core: 1.15, links: 1.22, spawn: 1.25, kpis: [
        { label: 'Concurrent agents', value: '32' },
        { label: 'Throughput', value: '+120%' },
        { label: 'SLO adherence', value: '99.9%' },
      ]},
      { name: 'Safety & Operations', hue: 155, core: 1.10, links: 1.08, spawn: 1.00, kpis: [
        { label: 'Incidents', value: '-62%' },
        { label: 'Audit trails', value: '100%' },
        { label: 'Policy hits', value: '1.2k' },
      ]},
      { name: 'Evolution & Learning', hue: 166, core: 1.18, links: 1.25, spawn: 1.28, kpis: [
        { label: 'Cycle time', value: '-52%' },
        { label: 'Win rate', value: '+27%' },
        { label: 'Cost / task', value: '-38%' },
      ]},
    ]

    // Tier influence on story intensity
    const tierStoryBoost = {
      small: 0.9,
      medium: 1.0,
      enterprise: 1.15,
    }

    // Three presentation zones for KPI beacons: right (default), left-top, lower-right
    const zones = [
      { x: 0.62, y: 0.18, anchor: 'left' },  // original
      { x: 0.12, y: 0.22, anchor: 'right' }, // left side
      { x: 0.55, y: 0.65, anchor: 'left' },  // lower right
    ]

    const init = () => {
      const tcfg = tierConfig[tier] || tierConfig.small
      const count = Math.floor((w * h) / tcfg.density) + 80
      const nodes = tcfg.hubCount
      const s = speed === 'fast' ? 1.6 : speed === 'calm' ? 0.7 : 1.0
      cfgRef.current = { count, nodes, s, nodeGlow: tcfg.nodeGlow, maxConn: tcfg.maxConn, corePulse: tcfg.corePulse }

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
      coverageRef.current = new Set() // reset cycle coverage on init (resize/tier change)
      currentBeatRef.current = -1
      zoneRef.current = 0
    }

    init()

    let t = 0

    const clamp01 = (v) => Math.max(0, Math.min(1, v))
    const ease = (p) => p * p * (3 - 2 * p) // smoothstep-like

    // HSL emerald helper with optional hue shift
    const emerald = (alpha, hueShift = 0, light = 55) => `hsla(${158 + hueShift}, 72%, ${light}%, ${alpha})`

    // Accent palette for KPI beacon borders/text
    const accent = (alpha, i = 0) => {
      const palette = [
        { h: 322, s: 85, l: 62 }, // pink
        { h: 262, s: 85, l: 72 }, // purple
        { h: 199, s: 92, l: 68 }, // sky
      ]
      const c = palette[i % palette.length]
      return `hsla(${c.h}, ${c.s}%, ${c.l}%, ${alpha})`
    }

    // draw a subtle scaffold of bezier arcs between hubs
    const drawScaffold = (hubs, time, intensity, hueShift = 0) => {
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
          const normalX = -dy / (dist || 1)
          const normalY = dx / (dist || 1)
          const wobble = Math.sin(time * 1.6 + i * 0.9 + j * 0.6)
          const bulge = Math.min(120, 40 + dist * 0.08)
          const cx = midx + normalX * bulge * (0.6 + 0.4 * wobble)
          const cy = midy + normalY * bulge * (0.6 + 0.4 * wobble)

          const z = (a.z + b.z) / 2
          ctx.save()
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.quadraticCurveTo(cx, cy, b.x, b.y)
          const alpha = 0.05 + z * 0.08
          ctx.strokeStyle = emerald(alpha, hueShift)
          ctx.lineWidth = 1 + z * 1.2
          ctx.shadowColor = emerald(0.35, hueShift)
          ctx.shadowBlur = 6 + 10 * z
          ctx.stroke()
          ctx.restore()
        }
      }
    }

    // central coordination core pulse
    const drawCore = (time, intensity, hueShift = 0) => {
      if (intensity <= 0.001) return
      const cx = w * 0.36
      const cy = h * 0.48
      const baseR = Math.min(w, h) * 0.08
      const pulse = (Math.sin(time * 2.1) + 1) / 2 // 0..1
      const r = baseR * (0.9 + pulse * 0.25 * intensity)

      // radial glow
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.2)
      grad.addColorStop(0, emerald(0.10 * intensity, hueShift))
      grad.addColorStop(1, 'rgba(16,185,129,0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(cx, cy, r * 2.2, 0, Math.PI * 2)
      ctx.fill()

      // inner core
      const innerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
      innerGrad.addColorStop(0, emerald(0.25 + 0.25 * pulse * intensity, hueShift))
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
        ctx.strokeStyle = emerald(0.18 - i * 0.04, hueShift)
        ctx.lineWidth = 1.2
        ctx.arc(cx, cy, rr, start, start + sweep)
        ctx.stroke()
        ctx.restore()
      }
    }

    // KPI Beacon cards: glassy plaques with glowing gradient numbers
    const drawKPIBeacons = (kpis, time, opacity, hubs, coverage, zone) => {
      if (!kpis || kpis.length === 0 || opacity <= 0) return
      const baseX = w * zone.x
      const baseY = h * zone.y

      kpis.slice(0,3).forEach((k, i) => {
        const x = baseX + Math.sin(time * (0.7 + i * 0.2) + i) * 18 * (i + 1)
        const y = baseY + i * 82 + Math.cos(time * (0.6 + i * 0.25)) * 6
        const width = Math.min(300, Math.max(220, w * 0.24))
        const height = 64
        const r = 14
        const pad = 16

        // subtle connector to farthest hub, ensuring coverage across a cycle
        if (hubs && hubs.length) {
          const ax = zone.anchor === 'left' ? x : x + width
          const ay = y + height / 2

          let farIdx = 0
          let farD = -Infinity
          let farIdxUncovered = -1
          let farDUncovered = -Infinity

          for (let hbi = 0; hbi < hubs.length; hbi++) {
            const hb = hubs[hbi]
            const d = Math.hypot(hb.x - ax, hb.y - ay)
            if (d > farD) { farD = d; farIdx = hbi }
            if (!coverage.has(hbi) && d > farDUncovered) { farDUncovered = d; farIdxUncovered = hbi }
          }

          const chosenIdx = farIdxUncovered !== -1 ? farIdxUncovered : farIdx
          const targetHub = hubs[chosenIdx]
          coverage.add(chosenIdx)

          // quadratic curve with slight bow toward mid
          const midx = (targetHub.x + ax) / 2
          const midy = (targetHub.y + ay) / 2
          const dx = ax - targetHub.x
          const dy = ay - targetHub.y
          const dist = Math.hypot(dx, dy) || 1
          const nx = -dy / dist
          const ny = dx / dist
          const bulge = Math.min(60, 20 + dist * 0.06)
          const cx = midx + nx * bulge
          const cy = midy + ny * bulge

          ctx.save()
          ctx.globalAlpha = 0.75 * opacity
          ctx.beginPath()
          ctx.moveTo(targetHub.x, targetHub.y)
          ctx.quadraticCurveTo(cx, cy, ax, ay)
          ctx.strokeStyle = accent(0.6, i)
          ctx.lineWidth = 1.5
          ctx.setLineDash([6, 6])
          ctx.lineDashOffset = (time * 40) % 12
          ctx.shadowColor = accent(0.75, i)
          ctx.shadowBlur = 8
          ctx.stroke()
          ctx.restore()
        }

        // card background
        ctx.save()
        ctx.globalAlpha = 0.9 * opacity
        ctx.beginPath()
        ctx.moveTo(x + r, y)
        ctx.lineTo(x + width - r, y)
        ctx.quadraticCurveTo(x + width, y, x + width, y + r)
        ctx.lineTo(x + width, y + height - r)
        ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
        ctx.lineTo(x + r, y + height)
        ctx.quadraticCurveTo(x, y + height, x, y + height - r)
        ctx.lineTo(x, y + r)
        ctx.quadraticCurveTo(x, y, x + r, y)
        ctx.closePath()

        // glass fill
        const glass = ctx.createLinearGradient(x, y, x, y + height)
        glass.addColorStop(0, 'rgba(2,6,23,0.85)')
        glass.addColorStop(1, 'rgba(2,6,23,0.65)')
        ctx.fillStyle = glass
        ctx.fill()

        // border glow with accent
        ctx.shadowColor = accent(0.8, i)
        ctx.shadowBlur = 20
        ctx.lineWidth = 1
        ctx.strokeStyle = accent(0.8, i)
        ctx.stroke()
        ctx.restore()

        // content layout: stack big value on top, label below to prevent overlap
        ctx.save()
        ctx.globalAlpha = opacity
        // dynamic font sizing for value to avoid overflow
        let valueFontSize = 22
        ctx.font = `700 ${valueFontSize}px Inter, system-ui, -apple-system, Segoe UI, Roboto`
        let valueWidth = ctx.measureText(k.value).width
        const avail = width - pad * 2
        if (valueWidth > avail) {
          const scale = avail / valueWidth
          valueFontSize = Math.max(16, Math.floor(valueFontSize * scale))
          ctx.font = `700 ${valueFontSize}px Inter, system-ui, -apple-system, Segoe UI, Roboto`
          valueWidth = ctx.measureText(k.value).width
        }
        ctx.textBaseline = 'top'
        ctx.fillStyle = accent(0.95, i)
        ctx.fillText(k.value, x + pad, y + 10)

        // label on second line
        ctx.font = '500 12px Inter, system-ui, -apple-system, Segoe UI, Roboto'
        ctx.fillStyle = 'rgba(226,232,240,0.92)'
        ctx.fillText(k.label, x + pad, y + 10 + valueFontSize + 6)
        ctx.restore()
      })
    }

    const step = () => {
      const { hubs, s, nodeGlow, maxConn, corePulse } = cfgRef.current
      t += 0.005 * s

      // elapsed time in seconds since init for staged startup
      const elapsed = (performance.now() - startTsRef.current) / 1000
      const hubProgress = ease(clamp01((elapsed - 0.2) / 1.0))
      const coreProgress = ease(clamp01((elapsed - 0.5) / 1.0))
      const scaffoldProgress = ease(clamp01((elapsed - 0.9) / 1.6))

      // story modulation (kicks in after initial 1.6s)
      let coreMod = 1, linkMod = 1, spawnMod = 1, hueShift = 0
      let beatIdx = 0
      if (story && elapsed > 1.6) {
        const beatDur = 3.6 // longer for readability
        const startOffset = 0.0
        const ti = Math.max(0, elapsed - 1.6 - startOffset)
        beatIdx = Math.floor(ti / beatDur) % beats.length
        const local = (ti % beatDur) / beatDur // 0..1 in-beat
        const smoothIn = ease(Math.min(local * 2, 1))
        const b = beats[beatIdx]
        const scale = (tierStoryBoost[tier] || 1)
        coreMod = 1 + (b.core - 1) * (0.65 + 0.35 * smoothIn) * scale
        linkMod = 1 + (b.links - 1) * (0.65 + 0.35 * smoothIn) * scale
        spawnMod = 1 + (b.spawn - 1) * (0.65 + 0.35 * smoothIn) * scale
        hueShift = (b.hue - 158)

        // pick a new KPI zone at beat boundaries (stable within the beat)
        if (currentBeatRef.current !== beatIdx) {
          const prev = zoneRef.current
          let next = Math.floor(Math.random() * zones.length)
          if (zones.length > 1 && next === prev) {
            next = (next + 1) % zones.length
          }
          zoneRef.current = next
          currentBeatRef.current = beatIdx
        }
      }

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
        grad.addColorStop(0, emerald(nodeGlow * hubProgress * 1.0, hueShift))
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
      drawScaffold(hubs, t * (1.1 + 0.2 * s), corePulse * scaffoldProgress * (story ? 0.9 * linkMod : 1), hueShift)

      // update agents with activation + story spawn modulation
      agentsRef.current.forEach((a) => {
        const act = ease(clamp01((elapsed - a.delay) / (0.9 / (story ? spawnMod : 1))))
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
          ctx.fillStyle = emerald(alphaNode, hueShift)
          ctx.beginPath()
          ctx.arc(a.x, a.y, size * 0.8, 0, Math.PI * 2)
          ctx.fill()
        }

        // connections to a few nearest in next N items for perf
        const localMax = (maxConn * (0.8 + depth * 0.35)) * (0.5 + 0.5 * a.act) * (story ? (linkMod || 1) : 1)
        if (a.act > 0.15) {
          for (let j = i + 1; j < i + 10 && j < arr.length; j++) {
            const b = arr[j]
            const dx = a.x - b.x
            const dy = a.y - b.y
            const d = Math.hypot(dx, dy)
            if (d < localMax && b.act > 0.15) {
              const alpha = (1 - d / localMax) * Math.min(a.act, b.act)
              ctx.strokeStyle = emerald(alpha * (0.18 + depth * 0.15), hueShift)
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
      drawCore(t, corePulse * coreProgress * (story ? (coreMod || 1) : 1), hueShift)

      // KPI Beacons (prominent, readable, value-forward)
      if (story && elapsed > 1.6) {
        // reset cycle coverage once all hubs have been connected at least once
        if (coverageRef.current.size >= hubs.length) {
          coverageRef.current = new Set()
        }
        const beatDur = 3.6
        const ti = Math.max(0, elapsed - 1.6)
        const local = (ti % beatDur) / beatDur
        const fade = local < 0.2 ? ease(local / 0.2) : local > 0.85 ? ease((1 - local) / 0.15) : 1
        const idx = Math.floor(ti / beatDur) % beats.length
        const zone = zones[zoneRef.current] || zones[0]
        drawKPIBeacons(beats[idx].kpis, t, fade, hubs, coverageRef.current, zone)
      }

      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [speed, tier, parallax.x, parallax.y, story])

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      style={{ display: 'block' }}
      aria-hidden
    />
  )
}
