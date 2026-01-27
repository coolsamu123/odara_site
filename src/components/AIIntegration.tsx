import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Sparkles, Check, Send } from 'lucide-react'

const demoPrompt = `Load customer data from PostgreSQL, filter inactive accounts, and export to S3 as parquet files partitioned by region`

const demoSteps = [
  { text: 'PostgreSQL Source configured', delay: 0.5 },
  { text: 'Filter node: WHERE active = true', delay: 1.0 },
  { text: 'S3 Target with Parquet format', delay: 1.5 },
  { text: 'Partitioning by region column', delay: 2.0 },
]

const AIIntegration = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [typedText, setTypedText] = useState('')
  const [showSteps, setShowSteps] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)

  useEffect(() => {
    if (!isInView) return

    let index = 0
    const typeInterval = setInterval(() => {
      if (index < demoPrompt.length) {
        setTypedText(demoPrompt.slice(0, index + 1))
        index++
      } else {
        clearInterval(typeInterval)
        setTimeout(() => setShowSteps(true), 500)
      }
    }, 30)

    return () => clearInterval(typeInterval)
  }, [isInView])

  useEffect(() => {
    if (!showSteps) return

    demoSteps.forEach((step, index) => {
      setTimeout(() => setCurrentStep(index), step.delay * 1000)
    })
  }, [showSteps])

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-accent text-sm font-semibold tracking-wider uppercase mb-4 block">
            AI-Powered
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Just Tell Odara{' '}
            <span className="gradient-text">What You Need</span>
          </h2>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            Stop writing boilerplate. Start describing outcomes. Odara's AI
            understands your intent and builds production-ready pipelines in
            seconds.
          </p>
        </motion.div>

        {/* Chat Interface Demo */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="gradient-border rounded-2xl overflow-hidden">
            <div className="bg-[#0D0D14]">
              {/* Chat Header */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Odara AI Assistant</h3>
                  <p className="text-text-muted text-sm">
                    Describe your pipeline in natural language
                  </p>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-6 space-y-6 min-h-[400px]">
                {/* User Message */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5 }}
                  className="flex justify-end"
                >
                  <div className="max-w-md">
                    <div className="bg-primary/20 border border-primary/30 rounded-2xl rounded-br-md px-5 py-4">
                      <p className="text-white">
                        {typedText}
                        <span className="inline-block w-0.5 h-4 bg-white ml-1 animate-pulse" />
                      </p>
                    </div>
                    <p className="text-text-muted text-xs mt-2 text-right">You</p>
                  </div>
                </motion.div>

                {/* AI Response */}
                <AnimatePresence>
                  {showSteps && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-md">
                        <div className="glass rounded-2xl rounded-bl-md px-5 py-4">
                          <div className="flex items-center gap-2 mb-4">
                            <Sparkles size={16} className="text-accent" />
                            <span className="text-accent text-sm font-medium">
                              Building your pipeline...
                            </span>
                          </div>

                          <div className="space-y-3">
                            {demoSteps.map((step, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={
                                  currentStep >= index
                                    ? { opacity: 1, x: 0 }
                                    : {}
                                }
                                transition={{ duration: 0.3 }}
                                className="flex items-center gap-3"
                              >
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                                    currentStep >= index
                                      ? 'bg-success'
                                      : 'bg-white/10'
                                  }`}
                                >
                                  {currentStep >= index && (
                                    <Check size={12} className="text-white" />
                                  )}
                                </div>
                                <span
                                  className={`text-sm ${
                                    currentStep >= index
                                      ? 'text-white'
                                      : 'text-text-muted'
                                  }`}
                                >
                                  {step.text}
                                </span>
                              </motion.div>
                            ))}
                          </div>

                          {currentStep >= demoSteps.length - 1 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 }}
                              className="mt-4 pt-4 border-t border-white/10"
                            >
                              <p className="text-success text-sm font-medium">
                                Pipeline ready to execute!
                              </p>
                            </motion.div>
                          )}
                        </div>
                        <p className="text-text-muted text-xs mt-2">Odara AI</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Chat Input */}
              <div className="px-6 py-4 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Describe your data pipeline..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
                  />
                  <button className="p-3 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white hover:shadow-lg hover:shadow-primary/25 transition-all">
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 grid md:grid-cols-3 gap-8 text-center"
        >
          {[
            { title: 'SQL Generation', desc: 'Complex queries from simple descriptions' },
            { title: 'Python Transforms', desc: 'Custom logic without the boilerplate' },
            { title: 'Smart Orchestration', desc: 'Dependencies resolved automatically' },
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

export default AIIntegration
