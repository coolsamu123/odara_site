import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Copy, Check, Terminal, Play } from 'lucide-react'

const codeSnippets = [
  { label: 'Install', code: 'curl -fsSL https://odara.dev/install.sh | sh' },
  { label: 'Start', code: 'odara serve' },
  { label: 'Open', code: '# → http://localhost:5173' },
]

const GettingStarted = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <section id="getting-started" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-[#0A0A14]" />

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-accent text-sm font-semibold tracking-wider uppercase mb-4 block">
            Get Started
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Your First Pipeline in{' '}
            <span className="gradient-text">60 Seconds</span>
          </h2>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            Three commands. That's all it takes to start building beautiful data
            pipelines.
          </p>
        </motion.div>

        {/* Terminal Window */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="gradient-border rounded-2xl overflow-hidden"
        >
          <div className="bg-[#0D0D14]">
            {/* Terminal Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-[#0A0A0F] border-b border-white/10">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex items-center gap-2 text-text-muted text-sm">
                <Terminal size={14} />
                <span>terminal</span>
              </div>
            </div>

            {/* Terminal Content */}
            <div className="p-6 space-y-4 font-mono text-sm">
              {codeSnippets.map((snippet, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.15 }}
                  className="group"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-accent">$</span>
                      <code
                        className={`${
                          snippet.code.startsWith('#')
                            ? 'text-text-muted'
                            : 'text-white'
                        } truncate`}
                      >
                        {snippet.code}
                      </code>
                    </div>
                    {!snippet.code.startsWith('#') && (
                      <button
                        onClick={() => handleCopy(snippet.code, index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/10 rounded-lg"
                      >
                        {copiedIndex === index ? (
                          <Check size={16} className="text-success" />
                        ) : (
                          <Copy size={16} className="text-text-muted" />
                        )}
                      </button>
                    )}
                  </div>
                  {index === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ delay: 0.8 }}
                      className="mt-2 ml-6 text-text-muted"
                    >
                      <span className="text-success">✓</span> Odara installed
                      successfully
                    </motion.div>
                  )}
                  {index === 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ delay: 1.1 }}
                      className="mt-2 ml-6 text-text-muted"
                    >
                      <span className="text-accent">🚀</span> Server running on
                      http://localhost:5173
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick start options */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: Terminal,
              title: 'CLI Installation',
              desc: 'Quick setup via command line',
              action: 'View Docs',
            },
            {
              icon: Play,
              title: 'Docker',
              desc: 'Run with a single command',
              action: 'Get Image',
            },
            {
              icon: Copy,
              title: 'From Source',
              desc: 'Build and customize',
              action: 'Clone Repo',
            },
          ].map((option, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="glass rounded-xl p-6 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <option.icon size={24} className="text-primary" />
              </div>
              <h3 className="text-white font-semibold mb-2">{option.title}</h3>
              <p className="text-text-muted text-sm mb-4">{option.desc}</p>
              <span className="text-accent text-sm font-medium group-hover:underline">
                {option.action} →
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Video placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-16"
        >
          <div className="glass rounded-2xl overflow-hidden aspect-video flex items-center justify-center relative group cursor-pointer">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />

            {/* Play button */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="relative z-10 w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors"
            >
              <Play size={32} className="text-white ml-1" />
            </motion.div>

            {/* Caption */}
            <div className="absolute bottom-6 left-0 right-0 text-center">
              <p className="text-white font-medium">
                Watch: Building Your First Pipeline
              </p>
              <p className="text-text-muted text-sm">2:30 min</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default GettingStarted
