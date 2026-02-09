const stats = [
  { value: '10x', label: 'Faster than JVM-based tools' },
  { value: '50+', label: 'Production-ready connectors' },
  { value: '83K', label: 'Rows per minute throughput' },
  { value: '0', label: 'Garbage collection pauses' },
]

const Stats = () => {
  return (
    <section className="border-t border-border">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.value}</div>
              <div className="text-text-secondary text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats
