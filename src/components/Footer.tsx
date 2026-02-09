import { Github, Twitter } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & tagline */}
          <div className="flex items-center gap-6">
            <a href="#" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold">O</span>
              </div>
              <span className="font-semibold">Odara</span>
            </a>
            <span className="text-text-muted text-sm hidden sm:inline">
              AI-first ETL for modern data teams
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <a href="#features" className="text-text-secondary hover:text-text transition-colors">Features</a>
            <a href="https://github.com/odara-etl/odara" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-text transition-colors flex items-center gap-1">
              <Github size={16} />
              GitHub
            </a>
            <a href="#" className="text-text-secondary hover:text-text transition-colors flex items-center gap-1">
              <Twitter size={16} />
              Twitter
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-text-muted text-sm">
          © {new Date().getFullYear()} Odara ETL. Open source under Apache 2.0 license.
        </div>
      </div>
    </footer>
  )
}

export default Footer
