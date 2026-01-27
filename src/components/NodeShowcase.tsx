import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Database,
  Cloud,
  FileText,
  Globe,
  MessageSquare,
  Code,
  Filter,
  GitMerge,
  Timer,
  RotateCcw,
  ArrowRight,
} from 'lucide-react'

const categories = [
  {
    id: 'sources',
    name: 'Sources',
    description: 'Connect to any data source',
    color: '#4F46E5',
    nodes: [
      { icon: Database, name: 'PostgreSQL', desc: 'Full CDC support' },
      { icon: Database, name: 'MySQL', desc: 'Binary log streaming' },
      { icon: Database, name: 'MongoDB', desc: 'Document extraction' },
      { icon: Cloud, name: 'Snowflake', desc: 'Native connector' },
      { icon: Cloud, name: 'S3', desc: 'All file formats' },
      { icon: FileText, name: 'CSV/Excel', desc: 'Auto-schema detection' },
      { icon: Globe, name: 'REST API', desc: 'Pagination support' },
      { icon: MessageSquare, name: 'RabbitMQ', desc: 'Queue consumer' },
    ],
  },
  {
    id: 'transforms',
    name: 'Transforms',
    description: 'Reshape your data with power',
    color: '#06B6D4',
    nodes: [
      { icon: Code, name: 'SQL Transform', desc: 'DataFusion powered' },
      { icon: Code, name: 'Python', desc: 'Custom logic' },
      { icon: GitMerge, name: 'Mapper', desc: 'N inputs, M outputs' },
      { icon: Filter, name: 'Filter', desc: 'Conditional routing' },
      { icon: GitMerge, name: 'Join', desc: 'Multiple join types' },
      { icon: GitMerge, name: 'Aggregate', desc: 'Group & summarize' },
    ],
  },
  {
    id: 'targets',
    name: 'Targets',
    description: 'Deliver data anywhere',
    color: '#10B981',
    nodes: [
      { icon: Database, name: 'PostgreSQL', desc: 'Upsert support' },
      { icon: Cloud, name: 'Snowflake', desc: 'Bulk loading' },
      { icon: Cloud, name: 'S3', desc: 'Partitioned output' },
      { icon: Cloud, name: 'BigQuery', desc: 'Streaming insert' },
      { icon: Globe, name: 'REST API', desc: 'Webhook delivery' },
      { icon: FileText, name: 'Parquet', desc: 'Columnar storage' },
    ],
  },
  {
    id: 'control',
    name: 'Control Flow',
    description: 'Orchestrate with precision',
    color: '#F59E0B',
    nodes: [
      { icon: Timer, name: 'Sleep', desc: 'Timed delays' },
      { icon: ArrowRight, name: 'RunAfter', desc: 'Sync execution' },
      { icon: RotateCcw, name: 'LoopWhile', desc: 'Conditional loops' },
      { icon: GitMerge, name: 'Branch', desc: 'Conditional paths' },
    ],
  },
]

const NodeShowcase = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [activeCategory, setActiveCategory] = useState('sources')

  const currentCategory = categories.find((c) => c.id === activeCategory)!

  return (
    <section id="nodes" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#0A0A14] to-background" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-accent text-sm font-semibold tracking-wider uppercase mb-4 block">
            Node Gallery
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Beautiful Components,{' '}
            <span className="gradient-text">Infinite Possibilities</span>
          </h2>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            Every node is crafted for elegance and power. Connect them to build
            any data pipeline imaginable.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeCategory === cat.id
                  ? 'text-white'
                  : 'text-text-muted hover:text-white glass'
              }`}
              style={{
                backgroundColor:
                  activeCategory === cat.id ? cat.color : undefined,
                boxShadow:
                  activeCategory === cat.id
                    ? `0 0 30px ${cat.color}40`
                    : undefined,
              }}
            >
              {cat.name}
            </button>
          ))}
        </motion.div>

        {/* Category Description */}
        <AnimatePresence mode="wait">
          <motion.p
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center text-text-muted mb-8"
          >
            {currentCategory.description}
          </motion.p>
        </AnimatePresence>

        {/* Node Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {currentCategory.nodes.map((node, index) => (
              <motion.div
                key={node.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: `0 0 40px ${currentCategory.color}30`,
                }}
                className="glass rounded-xl p-5 cursor-pointer group relative overflow-hidden"
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `radial-gradient(circle at center, ${currentCategory.color}20, transparent 70%)`,
                  }}
                />

                <div className="relative z-10">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all group-hover:scale-110"
                    style={{ backgroundColor: `${currentCategory.color}20` }}
                  >
                    <node.icon
                      size={24}
                      style={{ color: currentCategory.color }}
                    />
                  </div>
                  <h3 className="text-white font-semibold mb-1">{node.name}</h3>
                  <p className="text-text-muted text-sm">{node.desc}</p>
                </div>

                {/* Data flow animation on hover */}
                <motion.div
                  className="absolute top-0 right-0 w-2 h-full"
                  style={{ backgroundColor: currentCategory.color }}
                  initial={{ scaleY: 0 }}
                  whileHover={{ scaleY: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Interactive Demo Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass text-text-muted">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>Click on any node to see sample data flow</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default NodeShowcase
