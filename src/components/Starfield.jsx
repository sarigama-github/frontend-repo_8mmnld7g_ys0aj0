import React, { useEffect, useRef } from 'react'

// Subtle starfield canvas with twinkle and slow drift
export default function Starfield({ density = 0.00008, tint = '16,185,129', opacity = 0.35 }) {
  const ref = useRef(null)
  const raf = useRef(0)
  const stars = useRef([])

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const DPR = Math.min(2, window.devicePixelRatio || 1)
    let w = canvas.clientWidth
    let h = canvas.clientHeight
    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.floor(w * DPR)
      canvas.height = Math.floor(h * DPR)
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      init()
    }

    const init = () => {
      const count = Math.max(40, Math.floor(w * h * density))
      stars.current = new Array(count).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: 0.4 + Math.random() * 0.6,
        r: Math.random() * 1.2 + 0.2,
        tw: Math.random() * Math.PI * 2,
        sp: 0.02 + Math.random() * 0.05,
      }))
    }

    const onResize = () => requestAnimationFrame(resize)
    window.addEventListener('resize', onResize)

    const step = () => {
      ctx.clearRect(0, 0, w, h)
      const time = performance.now() * 0.001
      stars.current.forEach((s) => {
        s.tw += 0.015 + s.sp * 0.5
        s.x += s.sp * s.z
        if (s.x > w + 5) s.x = -5
        const a = opacity * (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(s.tw + time * 0.3))) * (0.6 + 0.4 * s.z)
        ctx.fillStyle = `rgba(${tint},${a})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r * (0.6 + s.z * 0.7), 0, Math.PI * 2)
        ctx.fill()
      })
      raf.current = requestAnimationFrame(step)
    }

    resize()
    raf.current = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('resize', onResize)
    }
  }, [density, tint, opacity])

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />
}
