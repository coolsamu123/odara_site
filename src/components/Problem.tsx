import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { AlertTriangle, Zap } from 'lucide-react'

const Problem = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ETL Shouldn't Feel Like This
          </h2>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            Traditional tools were built for a different era. It's time for something better.
          </p>
        </motion.div>

        {/* Before/After Comparison */}
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* The Old Way */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative glass rounded-2xl p-8 border border-red-500/20"
          >
            <div className="absolute -top-4 left-6 px-4 py-1 rounded-full bg-red-500/20 border border-red-500/30">
              <span className="text-red-400 text-sm font-medium flex items-center gap-2">
                <AlertTriangle size={14} />
                The Old Way
              </span>
            </div>

            {/* Chaotic Pipeline Visualization */}
            <div className="h-64 relative mb-6 overflow-hidden">
              <svg viewBox="0 0 400 200" className="w-full h-full">
                {/* Tangled mess of connections */}
                <motion.path
                  d="M50,100 Q100,20 150,80 T250,60 T350,100"
                  stroke="#EF4444"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : {}}
                  transition={{ duration: 2, delay: 0.5 }}
                />
                <motion.path
                  d="M50,100 Q80,150 120,120 T200,160 T300,80 T350,100"
                  stroke="#F97316"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : {}}
                  transition={{ duration: 2, delay: 0.7 }}
                />
                <motion.path
                  d="M50,100 Q150,180 200,100 T280,140 T350,100"
                  stroke="#EF4444"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : {}}
                  transition={{ duration: 2, delay: 0.9 }}
                />
                {/* Nodes */}
                <circle cx="50" cy="100" r="20" fill="#1F2937" stroke="#EF4444" strokeWidth="2" />
                <circle cx="350" cy="100" r="20" fill="#1F2937" stroke="#EF4444" strokeWidth="2" />
                <circle cx="150" cy="80" r="15" fill="#1F2937" stroke="#F97316" strokeWidth="2" />
                <circle cx="200" cy="140" r="15" fill="#1F2937" stroke="#F97316" strokeWidth="2" />
                <circle cx="280" cy="60" r="15" fill="#1F2937" stroke="#EF4444" strokeWidth="2" />
              </svg>
            </div>

            <ul className="space-y-3 text-text-muted">
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-1">✗</span>
                <span>Complex GUIs with endless configuration</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-1">✗</span>
                <span>Brittle pipelines that break at 2 AM</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-1">✗</span>
                <span>JVM overhead and garbage collection pauses</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-1">✗</span>
                <span>Expensive licenses and vendor lock-in</span>
              </li>
            </ul>
          </motion.div>

          {/* The Odara Way */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative glass rounded-2xl p-8 border border-success/20"
          >
            <div className="absolute -top-4 left-6 px-4 py-1 rounded-full bg-success/20 border border-success/30">
              <span className="text-success text-sm font-medium flex items-center gap-2">
                <Zap size={14} />
                The Odara Way
              </span>
            </div>

            {/* Clean Pipeline Visualization */}
            <div className="h-64 relative mb-6 overflow-hidden">
              <svg viewBox="0 0 400 200" className="w-full h-full">
                {/* Clean, organized connections */}
                <defs>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="50%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M50,100 L130,100"
                  stroke="url(#lineGrad)"
                  strokeWidth="3"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.8 }}
                />
                <motion.path
                  d="M170,100 L230,100"
                  stroke="url(#lineGrad)"
                  strokeWidth="3"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : {}}
                  transition={{ duration: 0.5, delay: 1.0 }}
                />
                <motion.path
                  d="M270,100 L350,100"
                  stroke="url(#lineGrad)"
                  strokeWidth="3"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : {}}
                  transition={{ duration: 0.5, delay: 1.2 }}
                />

                {/* Nodes with glow */}
                <motion.g
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <circle cx="50" cy="100" r="25" fill="#4F46E5" opacity="0.3" />
                  <circle cx="50" cy="100" r="20" fill="#4F46E5" />
                  <text x="50" y="105" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">DB</text>
                </motion.g>

                <motion.g
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.9 }}
                >
                  <circle cx="150" cy="100" r="25" fill="#7C3AED" opacity="0.3" />
                  <circle cx="150" cy="100" r="20" fill="#7C3AED" />
                  <text x="150" y="105" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">SQL</text>
                </motion.g>

                <motion.g
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 1.1 }}
                >
                  <circle cx="250" cy="100" r="25" fill="#06B6D4" opacity="0.3" />
                  <circle cx="250" cy="100" r="20" fill="#06B6D4" />
                  <text x="250" y="105" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">AI</text>
                </motion.g>

                <motion.g
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 1.3 }}
                >
                  <circle cx="350" cy="100" r="25" fill="#10B981" opacity="0.3" />
                  <circle cx="350" cy="100" r="20" fill="#10B981" />
                  <text x="350" y="105" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">S3</text>
                </motion.g>
              </svg>
            </div>

            <ul className="space-y-3 text-text-muted">
              <li className="flex items-start gap-3">
                <span className="text-success mt-1">✓</span>
                <span>Describe pipelines in plain English</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-success mt-1">✓</span>
                <span>Visual canvas that's a joy to use</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-success mt-1">✓</span>
                <span>Rust-powered performance, zero GC pauses</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-success mt-1">✓</span>
                <span>Free, open source, no vendor lock-in</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-2xl md:text-3xl text-white/80 italic max-w-3xl mx-auto">
            "You deserve better. Your data deserves better."
          </p>
        </motion.blockquote>
      </div>
    </section>
  )
}

export default Problem
