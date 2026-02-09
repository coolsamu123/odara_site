import { Sparkles, Zap, Database, Code, GitBranch, Workflow } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Generation',
    description: 'Describe your pipeline in natural language. Odara generates complete SQL and Python transforms automatically.',
  },
  {
    icon: Zap,
    title: '10x Faster Performance',
    description: 'Built with Rust and Apache Arrow for blazing fast columnar processing. No JVM overhead.',
  },
  {
    icon: Database,
    title: '50+ Connectors',
    description: 'PostgreSQL, MySQL, MongoDB, S3, Snowflake, REST APIs, and more. All production-ready.',
  },
  {
    icon: Workflow,
    title: 'Visual Pipeline Editor',
    description: 'Intuitive drag-and-drop canvas. See data previews at any step in your pipeline.',
  },
  {
    icon: Code,
    title: 'SQL + Python',
    description: 'Mix SQL transforms with Python scripts. Full flexibility for any transformation.',
  },
  {
    icon: GitBranch,
    title: 'Multi-Environment',
    description: 'Built-in DEV, UAT, PROD support. One pipeline, multiple deployment configs.',
  },
]

const Features = () => {
  return (
    <section id="features" className="border-t border-border">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need for modern ETL
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            From AI-assisted development to enterprise-grade performance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="card">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon size={20} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
