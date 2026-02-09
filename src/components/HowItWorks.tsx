const steps = [
  {
    number: '01',
    title: 'Describe your pipeline',
    description: 'Tell Odara what you want in plain English. "Load customers from PostgreSQL, filter active users, export to S3."',
  },
  {
    number: '02',
    title: 'AI generates everything',
    description: 'Odara creates the SQL queries, Python transforms, and connector configurations automatically.',
  },
  {
    number: '03',
    title: 'Run and monitor',
    description: 'Execute your pipeline with one click. View real-time progress and data previews at each step.',
  },
]

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="border-t border-border bg-surface/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How it works
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Go from idea to running pipeline in minutes, not days.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, i) => (
            <div key={i} className="text-center md:text-left">
              <div className="text-4xl font-bold text-primary/30 mb-4">{step.number}</div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-text-secondary leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Example code block */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="code-block">
            <div className="text-text-muted text-xs mb-3">Example prompt</div>
            <code className="text-accent text-sm">
              "Create a pipeline that loads customer data from PostgreSQL,<br />
              joins with orders table, filters last 30 days,<br />
              and exports to S3 as parquet files"
            </code>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
