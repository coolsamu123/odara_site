import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, ArrowRight } from 'lucide-react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  targetNode: number
  progress: number
}

interface Node {
  x: number
  y: number
  radius: number
  color: string
  pulsePhase: number
  label: string
}

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let width = window.innerWidth
    let height = window.innerHeight

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    resize()
    window.addEventListener('resize', resize)

    // Define pipeline nodes
    const nodes: Node[] = [
      { x: width * 0.15, y: height * 0.4, radius: 40, color: '#4F46E5', pulsePhase: 0, label: 'PostgreSQL' },
      { x: width * 0.35, y: height * 0.3, radius: 35, color: '#7C3AED', pulsePhase: 1, label: 'Transform' },
      { x: width * 0.35, y: height * 0.55, radius: 35, color: '#7C3AED', pulsePhase: 2, label: 'Filter' },
      { x: width * 0.55, y: height * 0.4, radius: 40, color: '#06B6D4', pulsePhase: 3, label: 'AI Agent' },
      { x: width * 0.75, y: height * 0.35, radius: 35, color: '#10B981', pulsePhase: 4, label: 'S3' },
      { x: width * 0.75, y: height * 0.55, radius: 35, color: '#10B981', pulsePhase: 5, label: 'Snowflake' },
    ]

    // Define connections
    const connections = [
      [0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5]
    ]

    // Create particles
    const particles: Particle[] = []
    const maxParticles = 50

    const createParticle = () => {
      if (particles.length >= maxParticles) return
      const connIdx = Math.floor(Math.random() * connections.length)
      const [from] = connections[connIdx]
      const fromNode = nodes[from]
      particles.push({
        x: fromNode.x,
        y: fromNode.y,
        vx: 0,
        vy: 0,
        targetNode: connIdx,
        progress: 0
      })
    }

    let time = 0
    const animate = () => {
      time += 0.016
      ctx.clearRect(0, 0, width, height)

      // Draw connection lines
      connections.forEach(([from, to]) => {
        const fromNode = nodes[from]
        const toNode = nodes[to]

        const gradient = ctx.createLinearGradient(fromNode.x, fromNode.y, toNode.x, toNode.y)
        gradient.addColorStop(0, fromNode.color + '60')
        gradient.addColorStop(1, toNode.color + '60')

        ctx.beginPath()
        ctx.moveTo(fromNode.x, fromNode.y)
        ctx.lineTo(toNode.x, toNode.y)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.stroke()

        // Animated flow effect
        const flowOffset = (time * 50) % 20
        ctx.setLineDash([5, 15])
        ctx.lineDashOffset = -flowOffset
        ctx.strokeStyle = gradient
        ctx.lineWidth = 3
        ctx.stroke()
        ctx.setLineDash([])
      })

      // Draw and animate nodes
      nodes.forEach((node, i) => {
        const pulse = Math.sin(time * 2 + node.pulsePhase) * 0.15 + 1
        const glowSize = node.radius * pulse

        // Outer glow
        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowSize * 2)
        glow.addColorStop(0, node.color + '40')
        glow.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(node.x, node.y, glowSize * 2, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()

        // Node circle
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        const nodeGradient = ctx.createRadialGradient(
          node.x - node.radius * 0.3, node.y - node.radius * 0.3, 0,
          node.x, node.y, node.radius
        )
        nodeGradient.addColorStop(0, node.color)
        nodeGradient.addColorStop(1, node.color + '80')
        ctx.fillStyle = nodeGradient
        ctx.fill()

        // Node border
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(255,255,255,0.2)'
        ctx.lineWidth = 2
        ctx.stroke()

        // Node label
        ctx.font = '12px Inter, sans-serif'
        ctx.fillStyle = 'rgba(255,255,255,0.8)'
        ctx.textAlign = 'center'
        ctx.fillText(node.label, node.x, node.y + node.radius + 20)

        // Icon in center (simplified)
        ctx.font = '16px Inter, sans-serif'
        ctx.fillStyle = 'white'
        ctx.fillText(i === 0 ? 'DB' : i === 3 ? 'AI' : i >= 4 ? '→' : '⚡', node.x, node.y + 5)
      })

      // Update and draw particles
      if (Math.random() < 0.1) createParticle()

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        const [from, to] = connections[p.targetNode]
        const fromNode = nodes[from]
        const toNode = nodes[to]

        p.progress += 0.015

        if (p.progress >= 1) {
          particles.splice(i, 1)
          continue
        }

        p.x = fromNode.x + (toNode.x - fromNode.x) * p.progress
        p.y = fromNode.y + (toNode.y - fromNode.y) * p.progress

        // Draw particle
        const particleGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 8)
        particleGlow.addColorStop(0, '#06B6D4')
        particleGlow.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2)
        ctx.fillStyle = particleGlow
        ctx.fill()

        ctx.beginPath()
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
        ctx.fillStyle = '#06B6D4'
        ctx.fill()
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ background: 'radial-gradient(ellipse at center, #0A0A1F 0%, #0A0A0F 100%)' }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-text-muted">Open Source • Apache Arrow • Rust-Powered • AI-Native</span>
          </motion.div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white">Data Pipelines,</span>
            <br />
            <span className="gradient-text">Beautifully Orchestrated</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-10">
            Odara is the AI-native ETL platform that turns natural language into
            production-ready data flows. No more wrestling with complexity.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="#getting-started"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold text-lg overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Building
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary-light to-accent opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </motion.a>

            <motion.a
              href="#demo"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white font-semibold text-lg hover:bg-white/5 transition-colors"
            >
              <Play size={20} />
              Watch Demo
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-white"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
