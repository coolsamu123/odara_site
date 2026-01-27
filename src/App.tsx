import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Problem from './components/Problem'
import Solution from './components/Solution'
import NodeShowcase from './components/NodeShowcase'
import AIIntegration from './components/AIIntegration'
import Performance from './components/Performance'
import OpenSource from './components/OpenSource'
import UseCases from './components/UseCases'
import Comparison from './components/Comparison'
import GettingStarted from './components/GettingStarted'
import Footer from './components/Footer'

function App() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <NodeShowcase />
        <AIIntegration />
        <Performance />
        <OpenSource />
        <UseCases />
        <Comparison />
        <GettingStarted />
      </main>
      <Footer />
    </motion.div>
  )
}

export default App
