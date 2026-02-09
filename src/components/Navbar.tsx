import { useState } from 'react'
import { Menu, X, Github } from 'lucide-react'

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold">O</span>
            </div>
            <span className="font-semibold text-lg">Odara</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-text-secondary hover:text-text transition-colors text-sm">Features</a>
            <a href="#how-it-works" className="text-text-secondary hover:text-text transition-colors text-sm">How it works</a>
            <a href="https://github.com/odara-etl/odara" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-text transition-colors text-sm flex items-center gap-1">
              <Github size={16} />
              GitHub
            </a>
            <a href="#get-started" className="btn btn-primary text-sm py-2 px-4">Get Started</a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-text-secondary"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <a href="#features" onClick={() => setMobileOpen(false)} className="text-text-secondary hover:text-text">Features</a>
              <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="text-text-secondary hover:text-text">How it works</a>
              <a href="https://github.com/odara-etl/odara" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-text flex items-center gap-1">
                <Github size={16} />
                GitHub
              </a>
              <a href="#get-started" onClick={() => setMobileOpen(false)} className="btn btn-primary text-center">Get Started</a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
