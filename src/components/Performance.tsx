import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Zap, Cpu, Database, Layers } from 'lucide-react'

const stats = [
  { value: 10, suffix: 'x', label: 'Faster than Java-based ETL', icon: Zap },
  { value: 0, suffix: '', label: 'GC pauses with Rust', icon: Cpu },
  { value: 100, suffix: '%', label: 'Apache Arrow native', icon: Database },
  { value: 16, suffix: '+', label: 'Parallel core utilization', icon: Layers },
]

const AnimatedCounter = ({ value, suffix, isInView }: { value: number; suffix: string; isInView: boolean }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return

    const duration = 2000
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(easeOut * value)

      setCount(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }, [value, isInView])

  return (
    <span className="gradient-text">
      {count}
      {suffix}
    </span>
  )
}

const Performance = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="performance" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      </div>

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-accent text-sm font-semibold tracking-wider uppercase mb-4 block">
            Performance
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Built for <span className="gradient-text">Speed</span>
          </h2>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            Rust's zero-cost abstractions meet Apache Arrow's columnar format.
            The result? Blazing fast data processing.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass rounded-2xl p-8 text-center group hover:border-primary/30 transition-colors"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <stat.icon size={28} className="text-primary" />
              </div>
              <div className="text-5xl font-bold mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} isInView={isInView} />
              </div>
              <p className="text-text-muted">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Architecture Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="glass rounded-2xl p-8 md:p-12"
        >
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            Data Flow Architecture
          </h3>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            {[
              { name: 'Source', desc: 'Any connector', color: '#4F46E5' },
              { name: 'Arrow', desc: 'RecordBatch', color: '#06B6D4' },
              { name: 'Transform', desc: 'Vectorized ops', color: '#7C3AED' },
              { name: 'Target', desc: 'Zero-copy output', color: '#10B981' },
            ].map((step, index) => (
              <div key={index} className="flex items-center gap-4 md:gap-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.15 }}
                  className="flex flex-col items-center"
                >
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-3 relative"
                    style={{ backgroundColor: `${step.color}20` }}
                  >
                    {/* Pulse effect */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      style={{ backgroundColor: step.color }}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3,
                      }}
                    />
                    <span
                      className="text-2xl font-bold relative z-10"
                      style={{ color: step.color }}
                    >
                      {index + 1}
                    </span>
                  </div>
                  <h4 className="text-white font-semibold">{step.name}</h4>
                  <p className="text-text-muted text-sm">{step.desc}</p>
                </motion.div>

                {index < 3 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.15 }}
                    className="hidden md:block"
                  >
                    <svg width="60" height="24" viewBox="0 0 60 24">
                      <defs>
                        <linearGradient id={`arrow-grad-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={step.color} />
                          <stop offset="100%" stopColor={[
                            { name: 'Source', desc: 'Any connector', color: '#4F46E5' },
                            { name: 'Arrow', desc: 'RecordBatch', color: '#06B6D4' },
                            { name: 'Transform', desc: 'Vectorized ops', color: '#7C3AED' },
                            { name: 'Target', desc: 'Zero-copy output', color: '#10B981' },
                          ][index + 1]?.color || step.color} />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,12 L50,12 M40,4 L50,12 L40,20"
                        stroke={`url(#arrow-grad-${index})`}
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Performance comparison bars */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <h4 className="text-white font-semibold mb-6 text-center">
              Benchmark: Processing 10M Records
            </h4>
            <div className="space-y-4 max-w-2xl mx-auto">
              {[
                { name: 'Odara (Rust + Arrow)', time: 0.8, color: '#10B981' },
                { name: 'Python pandas', time: 4.2, color: '#F59E0B' },
                { name: 'Java-based ETL', time: 8.5, color: '#EF4444' },
              ].map((tool, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-text-muted text-sm w-32 md:w-40">
                    {tool.name}
                  </span>
                  <div className="flex-1 h-8 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${(tool.time / 8.5) * 100}%` } : {}}
                      transition={{ duration: 1, delay: 1 + index * 0.2 }}
                      className="h-full rounded-full flex items-center justify-end pr-3"
                      style={{ backgroundColor: tool.color }}
                    >
                      <span className="text-white text-xs font-medium">
                        {tool.time}s
                      </span>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Performance
