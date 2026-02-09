import { ArrowRight } from 'lucide-react'

const Hero = () => {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-32">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            Open Source ETL Platform
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Build data pipelines with{' '}
            <span className="gradient-text">AI assistance</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
            Describe your pipeline in plain English. Odara generates the SQL, Python,
            and connections automatically. 10x faster than traditional ETL tools.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#get-started" className="btn btn-primary w-full sm:w-auto">
              Get Started Free
              <ArrowRight size={18} />
            </a>
            <a href="https://github.com/odara-etl/odara" target="_blank" rel="noopener noreferrer" className="btn btn-secondary w-full sm:w-auto">
              View on GitHub
            </a>
          </div>

          {/* Tech badges */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-6 text-text-muted text-sm">
            <span>Powered by</span>
            <span className="text-text-secondary font-medium">Rust</span>
            <span className="text-text-muted">•</span>
            <span className="text-text-secondary font-medium">Apache Arrow</span>
            <span className="text-text-muted">•</span>
            <span className="text-text-secondary font-medium">DataFusion</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
