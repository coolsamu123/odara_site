import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Sparkles, Eye, Zap, Lock } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'AI-First Design',
    description: 'Describe your pipeline in plain English. Odara builds it.',
    color: '#06B6D4',
  },
  {
    icon: Eye,
    title: 'Visual Elegance',
    description: "A canvas that's a joy to work with, not a chore.",
    color: '#7C3AED',
  },
  {
    icon: Zap,
    title: 'Rust Performance',
    description: 'Blazing fast. No JVM overhead. No garbage collection pauses.',
    color: '#F59E0B',
  },
  {
    icon: Lock,
    title: 'Open Source',
    description: 'No vendor lock-in. Your data, your rules.',
    color: '#10B981',
  },
]

const Solution = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="features" className="py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-accent text-sm font-semibold tracking-wider uppercase mb-4 block">
            The Solution
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Meet <span className="gradient-text">Odara</span>
          </h2>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            The elegant way to move data. AI-powered. Rust-powered. Beautiful.
          </p>
        </motion.div>

        {/* Interface Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mb-20"
        >
          <div className="gradient-border p-1 rounded-2xl">
            <div className="bg-background rounded-xl overflow-hidden">
              {/* Mock Interface */}
              <div className="bg-[#0D0D14] border-b border-white/10 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-text-muted text-sm ml-4">Odara ETL — Customer Data Pipeline</span>
              </div>

              <div className="flex">
                {/* Sidebar */}
                <div className="w-64 bg-[#0D0D14] border-r border-white/10 p-4 hidden md:block">
                  <div className="space-y-2">
                    <div className="text-xs text-text-muted uppercase tracking-wider mb-3">Nodes</div>
                    {['Sources', 'Transforms', 'Targets', 'Control'].map((cat) => (
                      <div key={cat} className="px-3 py-2 rounded-lg hover:bg-white/5 text-text-muted text-sm cursor-pointer">
                        {cat}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 h-80 md:h-96 bg-[#08080C] relative overflow-hidden">
                  {/* Grid pattern */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }}
                  />

                  {/* Animated Pipeline Preview */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400">
                    <defs>
                      <linearGradient id="flow1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4F46E5" />
                        <stop offset="100%" stopColor="#06B6D4" />
                      </linearGradient>
                      <linearGradient id="flow2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06B6D4" />
                        <stop offset="100%" stopColor="#10B981" />
                      </linearGradient>
                    </defs>

                    {/* Connection Lines */}
                    <motion.path
                      d="M200,200 L350,200"
                      stroke="url(#flow1)"
                      strokeWidth="3"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={isInView ? { pathLength: 1 } : {}}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                    <motion.path
                      d="M450,200 L600,200"
                      stroke="url(#flow2)"
                      strokeWidth="3"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={isInView ? { pathLength: 1 } : {}}
                      transition={{ duration: 1, delay: 0.8 }}
                    />

                    {/* Source Node */}
                    <motion.g
                      initial={{ scale: 0, opacity: 0 }}
                      animate={isInView ? { scale: 1, opacity: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <rect x="100" y="160" width="100" height="80" rx="12" fill="#1a1a2e" stroke="#4F46E5" strokeWidth="2" />
                      <rect x="100" y="160" width="100" height="24" rx="12" fill="#4F46E5" />
                      <text x="150" y="177" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">PostgreSQL</text>
                      <text x="150" y="210" textAnchor="middle" fill="#A1A1AA" fontSize="10">customers</text>
                    </motion.g>

                    {/* Transform Node */}
                    <motion.g
                      initial={{ scale: 0, opacity: 0 }}
                      animate={isInView ? { scale: 1, opacity: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <rect x="350" y="160" width="100" height="80" rx="12" fill="#1a1a2e" stroke="#06B6D4" strokeWidth="2" />
                      <rect x="350" y="160" width="100" height="24" rx="12" fill="#06B6D4" />
                      <text x="400" y="177" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">SQL Transform</text>
                      <text x="400" y="210" textAnchor="middle" fill="#A1A1AA" fontSize="10">filter active</text>
                    </motion.g>

                    {/* Target Node */}
                    <motion.g
                      initial={{ scale: 0, opacity: 0 }}
                      animate={isInView ? { scale: 1, opacity: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.9 }}
                    >
                      <rect x="600" y="160" width="100" height="80" rx="12" fill="#1a1a2e" stroke="#10B981" strokeWidth="2" />
                      <rect x="600" y="160" width="100" height="24" rx="12" fill="#10B981" />
                      <text x="650" y="177" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">S3 Bucket</text>
                      <text x="650" y="210" textAnchor="middle" fill="#A1A1AA" fontSize="10">parquet</text>
                    </motion.g>

                    {/* Animated particles */}
                    <motion.circle
                      r="4"
                      fill="#06B6D4"
                      animate={isInView ? {
                        cx: [200, 350, 450, 600],
                        cy: [200, 200, 200, 200],
                      } : {}}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  </svg>

                  {/* AI Chat Bubble */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1.2 }}
                    className="absolute bottom-4 right-4 glass rounded-xl p-4 max-w-xs"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Sparkles size={12} className="text-white" />
                      </div>
                      <span className="text-sm font-medium text-white">Odara AI</span>
                    </div>
                    <p className="text-xs text-text-muted">
                      Pipeline configured! Filtering active customers and exporting to S3 in Parquet format.
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating elements */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-6 -right-6 w-20 h-20 rounded-2xl glass flex items-center justify-center"
          >
            <Sparkles className="text-accent" size={32} />
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="glass rounded-2xl p-6 cursor-pointer group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${feature.color}20` }}
              >
                <feature.icon size={24} style={{ color: feature.color }} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-text-muted text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Solution
