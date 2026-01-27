import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Github, Twitter, MessageCircle, Book, ArrowRight } from 'lucide-react'

const Footer = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const footerLinks = [
    {
      title: 'Product',
      links: ['Features', 'Node Gallery', 'Performance', 'Roadmap'],
    },
    {
      title: 'Resources',
      links: ['Documentation', 'API Reference', 'Tutorials', 'Examples'],
    },
    {
      title: 'Community',
      links: ['GitHub', 'Discord', 'Twitter', 'Blog'],
    },
    {
      title: 'Company',
      links: ['About', 'Careers', 'Contact', 'License'],
    },
  ]

  return (
    <footer ref={ref} className="relative overflow-hidden">
      {/* CTA Section */}
      <section className="py-32 relative">
        {/* Background animation */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A14] to-background" />
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'radial-gradient(circle at center, #4F46E5 0%, transparent 50%)',
              backgroundSize: '100% 100%',
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Transform
              <br />
              <span className="gradient-text">Your Data?</span>
            </h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto mb-10">
              Join thousands of data engineers building beautiful pipelines with
              Odara. Start free, scale infinitely.
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
                  Get Started Free
                  <ArrowRight
                    className="group-hover:translate-x-1 transition-transform"
                    size={20}
                  />
                </span>
              </motion.a>

              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white font-semibold text-lg hover:bg-white/5 transition-colors"
              >
                <Book size={20} />
                Read Documentation
              </motion.a>

              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white font-semibold text-lg hover:bg-white/5 transition-colors"
              >
                <MessageCircle size={20} />
                Join Discord
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Content */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                  <span className="text-white font-bold text-xl">O</span>
                </div>
                <span className="text-xl font-bold text-white">Odara</span>
              </div>
              <p className="text-text-muted text-sm mb-4">
                Data pipelines, beautifully orchestrated.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className="text-text-muted hover:text-white transition-colors"
                >
                  <Github size={20} />
                </a>
                <a
                  href="#"
                  className="text-text-muted hover:text-white transition-colors"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="#"
                  className="text-text-muted hover:text-white transition-colors"
                >
                  <MessageCircle size={20} />
                </a>
              </div>
            </div>

            {/* Links */}
            {footerLinks.map((section, index) => (
              <div key={index}>
                <h4 className="text-white font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="text-text-muted hover:text-white transition-colors text-sm"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-text-muted text-sm">
              © {new Date().getFullYear()} Odara ETL. Open source under Apache
              2.0 license.
            </p>
            <p className="text-text-muted text-sm">
              Made with{' '}
              <span className="text-red-400">♥</span> by data engineers, for
              data engineers.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
