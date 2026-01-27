import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, X, Minus } from 'lucide-react'

const comparisonData = [
  {
    feature: 'Setup Time',
    odara: 'Minutes',
    traditional: 'Days/Weeks',
    odaraGood: true,
  },
  {
    feature: 'AI Generation',
    odara: 'Native',
    traditional: 'None/Bolt-on',
    odaraGood: true,
  },
  {
    feature: 'Performance',
    odara: 'Rust + Arrow',
    traditional: 'JVM Overhead',
    odaraGood: true,
  },
  {
    feature: 'Pricing',
    odara: 'Free & Open',
    traditional: '$$$$',
    odaraGood: true,
  },
  {
    feature: 'Learning Curve',
    odara: 'Intuitive',
    traditional: 'Steep',
    odaraGood: true,
  },
  {
    feature: 'Customization',
    odara: 'Full Control',
    traditional: 'Limited',
    odaraGood: true,
  },
  {
    feature: 'Visual Canvas',
    odara: 'Modern & Elegant',
    traditional: 'Dated UI',
    odaraGood: true,
  },
  {
    feature: 'Community',
    odara: 'Growing Fast',
    traditional: 'Enterprise Only',
    odaraGood: true,
  },
]

const Comparison = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-accent text-sm font-semibold tracking-wider uppercase mb-4 block">
            Comparison
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Odara <span className="gradient-text">Wins</span>
          </h2>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            See how Odara stacks up against traditional ETL tools.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass rounded-2xl overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-white/5 border-b border-white/10">
            <div className="p-6 text-text-muted font-medium">Feature</div>
            <div className="p-6 text-center">
              <span className="gradient-text font-bold text-lg">Odara</span>
            </div>
            <div className="p-6 text-center text-text-muted font-medium">
              Traditional ETL
            </div>
          </div>

          {/* Table Body */}
          {comparisonData.map((row, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
              className={`grid grid-cols-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${
                index % 2 === 0 ? '' : 'bg-white/[0.02]'
              }`}
            >
              <div className="p-5 text-white font-medium flex items-center">
                {row.feature}
              </div>
              <div className="p-5 text-center flex items-center justify-center gap-2">
                <Check size={18} className="text-success" />
                <span className="text-success font-medium">{row.odara}</span>
              </div>
              <div className="p-5 text-center flex items-center justify-center gap-2">
                {row.odaraGood ? (
                  <X size={18} className="text-red-400" />
                ) : (
                  <Minus size={18} className="text-text-muted" />
                )}
                <span className="text-text-muted">{row.traditional}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 glass rounded-full px-8 py-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-white font-medium">8 wins for Odara</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/20" />
            <span className="text-text-muted">The choice is clear.</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Comparison
