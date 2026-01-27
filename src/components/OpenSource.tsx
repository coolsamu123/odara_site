import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Github, Star, GitFork, Users } from 'lucide-react'

const contributors = [
  { initial: 'JS', color: '#4F46E5' },
  { initial: 'AK', color: '#7C3AED' },
  { initial: 'MR', color: '#06B6D4' },
  { initial: 'LC', color: '#10B981' },
  { initial: 'PR', color: '#F59E0B' },
  { initial: 'KM', color: '#EF4444' },
  { initial: 'NT', color: '#EC4899' },
  { initial: '+', color: '#6366F1' },
]

const OpenSource = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-[#0A0A14]" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-accent text-sm font-semibold tracking-wider uppercase mb-4 block">
            Open Source
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Transparency is <span className="gradient-text">Beautiful</span>
          </h2>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            Odara is proudly open source. Inspect every line. Contribute
            improvements. Build extensions.
          </p>
        </motion.div>

        {/* GitHub Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="gradient-border rounded-2xl p-1">
            <div className="bg-[#0D0D14] rounded-xl p-8 md:p-12">
              {/* Repo Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                    <Github size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">odara-etl/odara</h3>
                    <p className="text-text-muted">The elegant ETL platform</p>
                  </div>
                </div>

                <motion.a
                  href="https://github.com/odara-etl/odara"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-background font-semibold hover:bg-white/90 transition-colors"
                >
                  <Star size={20} />
                  Star on GitHub
                </motion.a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                {[
                  { icon: Star, label: 'Stars', value: '2.4k' },
                  { icon: GitFork, label: 'Forks', value: '186' },
                  { icon: Users, label: 'Contributors', value: '47' },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="glass rounded-xl p-4 text-center"
                  >
                    <stat.icon size={24} className="text-accent mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-text-muted text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Contributors */}
              <div className="mb-8">
                <h4 className="text-white font-semibold mb-4">Top Contributors</h4>
                <div className="flex flex-wrap gap-3">
                  {contributors.map((contrib, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                      whileHover={{ scale: 1.1, y: -2 }}
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer"
                      style={{ backgroundColor: contrib.color }}
                    >
                      {contrib.initial}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Activity Graph Mockup */}
              <div>
                <h4 className="text-white font-semibold mb-4">Contribution Activity</h4>
                <div className="grid grid-cols-12 md:grid-cols-52 gap-1">
                  {Array.from({ length: 52 * 7 }).map((_, index) => {
                    const intensity = Math.random()
                    let bg = 'bg-white/5'
                    if (intensity > 0.8) bg = 'bg-success'
                    else if (intensity > 0.6) bg = 'bg-success/70'
                    else if (intensity > 0.4) bg = 'bg-success/40'
                    else if (intensity > 0.2) bg = 'bg-success/20'

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.5, delay: 0.8 + (index % 52) * 0.02 }}
                        className={`w-2 h-2 md:w-3 md:h-3 rounded-sm ${bg} hidden md:block`}
                      />
                    )
                  })}
                  {/* Mobile simplified view */}
                  {Array.from({ length: 12 * 7 }).map((_, index) => {
                    const intensity = Math.random()
                    let bg = 'bg-white/5'
                    if (intensity > 0.8) bg = 'bg-success'
                    else if (intensity > 0.6) bg = 'bg-success/70'
                    else if (intensity > 0.4) bg = 'bg-success/40'
                    else if (intensity > 0.2) bg = 'bg-success/20'

                    return (
                      <motion.div
                        key={`mobile-${index}`}
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.5, delay: 0.8 + (index % 12) * 0.02 }}
                        className={`w-3 h-3 rounded-sm ${bg} md:hidden`}
                      />
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 grid md:grid-cols-3 gap-8 text-center"
        >
          {[
            { title: 'No Black Boxes', desc: 'Every algorithm is inspectable and documented' },
            { title: 'No Hidden Costs', desc: 'Apache 2.0 license, forever free to use' },
            { title: 'Community Driven', desc: 'Built by data engineers, for data engineers' },
          ].map((item, index) => (
            <div key={index} className="glass rounded-xl p-6">
              <h3 className="text-white font-semibold mb-2">{item.title}</h3>
              <p className="text-text-muted text-sm">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default OpenSource
