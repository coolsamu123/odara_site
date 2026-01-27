import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Database, RefreshCw, Files, Globe } from 'lucide-react'

const useCases = [
  {
    icon: Database,
    title: 'Data Warehouse Loading',
    description: 'Consolidate data from 10+ sources into Snowflake in minutes',
    color: '#4F46E5',
    visual: (
      <svg viewBox="0 0 200 100" className="w-full h-24">
        <defs>
          <linearGradient id="warehouse-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        {/* Multiple sources converging */}
        <motion.circle cx="30" cy="20" r="10" fill="#4F46E5" opacity="0.8" />
        <motion.circle cx="30" cy="50" r="10" fill="#7C3AED" opacity="0.8" />
        <motion.circle cx="30" cy="80" r="10" fill="#06B6D4" opacity="0.8" />
        <motion.path d="M45,20 Q100,50 150,50" stroke="url(#warehouse-grad)" strokeWidth="2" fill="none" />
        <motion.path d="M45,50 L150,50" stroke="url(#warehouse-grad)" strokeWidth="2" fill="none" />
        <motion.path d="M45,80 Q100,50 150,50" stroke="url(#warehouse-grad)" strokeWidth="2" fill="none" />
        <motion.rect x="150" y="35" width="40" height="30" rx="4" fill="#10B981" />
        <text x="170" y="55" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">DW</text>
      </svg>
    ),
  },
  {
    icon: RefreshCw,
    title: 'Real-Time Data Sync',
    description: 'Keep systems in sync with change data capture',
    color: '#06B6D4',
    visual: (
      <svg viewBox="0 0 200 100" className="w-full h-24">
        <defs>
          <linearGradient id="sync-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
        <rect x="20" y="35" width="50" height="30" rx="4" fill="#06B6D4" />
        <text x="45" y="55" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">System A</text>
        <rect x="130" y="35" width="50" height="30" rx="4" fill="#10B981" />
        <text x="155" y="55" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">System B</text>
        {/* Bidirectional arrows */}
        <motion.path d="M75,45 L125,45" stroke="url(#sync-grad)" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
        <motion.path d="M125,55 L75,55" stroke="url(#sync-grad)" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
        <defs>
          <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#10B981" />
          </marker>
        </defs>
      </svg>
    ),
  },
  {
    icon: Files,
    title: 'File Processing at Scale',
    description: 'Process millions of files from S3 with parallel execution',
    color: '#7C3AED',
    visual: (
      <svg viewBox="0 0 200 100" className="w-full h-24">
        {/* File icons stacking */}
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.g key={i} transform={`translate(${20 + i * 10}, ${50 - i * 5})`}>
            <rect width="30" height="35" rx="2" fill="#7C3AED" opacity={0.3 + i * 0.15} />
            <rect y="0" width="20" height="8" rx="1" fill="#7C3AED" opacity={0.5 + i * 0.1} />
          </motion.g>
        ))}
        {/* Arrow */}
        <path d="M90,50 L130,50" stroke="#7C3AED" strokeWidth="3" fill="none" />
        <polygon points="130,45 145,50 130,55" fill="#7C3AED" />
        {/* Processed output */}
        <rect x="155" y="30" width="35" height="40" rx="4" fill="#10B981" />
        <text x="172" y="55" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Done</text>
      </svg>
    ),
  },
  {
    icon: Globe,
    title: 'API Integration',
    description: 'Turn any REST API into a data source with pagination support',
    color: '#10B981',
    visual: (
      <svg viewBox="0 0 200 100" className="w-full h-24">
        {/* API endpoint */}
        <rect x="20" y="35" width="50" height="30" rx="4" fill="#10B981" />
        <text x="45" y="55" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">REST</text>
        {/* Multiple data streams */}
        <motion.path d="M75,40 Q110,20 150,40" stroke="#10B981" strokeWidth="2" fill="none" strokeDasharray="4,2" />
        <motion.path d="M75,50 L150,50" stroke="#10B981" strokeWidth="2" fill="none" strokeDasharray="4,2" />
        <motion.path d="M75,60 Q110,80 150,60" stroke="#10B981" strokeWidth="2" fill="none" strokeDasharray="4,2" />
        {/* Database */}
        <ellipse cx="165" cy="45" rx="20" ry="8" fill="#4F46E5" />
        <rect x="145" y="45" width="40" height="20" fill="#4F46E5" />
        <ellipse cx="165" cy="65" rx="20" ry="8" fill="#4F46E5" />
      </svg>
    ),
  },
]

const UseCases = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A14] to-background" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-accent text-sm font-semibold tracking-wider uppercase mb-4 block">
            Use Cases
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Odara in <span className="gradient-text">Action</span>
          </h2>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            From simple data moves to complex orchestration, Odara handles it
            all with elegance.
          </p>
        </motion.div>

        {/* Use Case Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{
                y: -5,
                boxShadow: `0 20px 40px ${useCase.color}20`,
              }}
              className="glass rounded-2xl p-8 cursor-pointer group relative overflow-hidden"
            >
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at bottom right, ${useCase.color}15, transparent 70%)`,
                }}
              />

              <div className="relative z-10">
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${useCase.color}20` }}
                >
                  <useCase.icon size={28} style={{ color: useCase.color }} />
                </div>

                {/* Visual */}
                <div className="mb-6 opacity-60 group-hover:opacity-100 transition-opacity">
                  {useCase.visual}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {useCase.title}
                </h3>
                <p className="text-text-muted">{useCase.description}</p>

                {/* Learn more link */}
                <motion.div
                  className="mt-4 flex items-center gap-2 text-sm font-medium"
                  style={{ color: useCase.color }}
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ x: 5 }}
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more →
                  </span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional use cases hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-text-muted">
            And many more:{' '}
            <span className="text-white">
              CDC pipelines, ML feature stores, data lake management, log
              aggregation...
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default UseCases
