import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

const GetStarted = () => {
  const [copied, setCopied] = useState(false)
  const installCmd = 'curl -fsSL https://odara.dev/install.sh | sh'

  const handleCopy = () => {
    navigator.clipboard.writeText(installCmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="get-started" className="border-t border-border bg-surface/30">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get started in seconds
          </h2>
          <p className="text-text-secondary text-lg mb-10">
            Install Odara and build your first pipeline.
          </p>

          {/* Install command */}
          <div className="code-block flex items-center justify-between gap-4 mb-8">
            <code className="text-sm text-text-secondary overflow-x-auto">
              <span className="text-accent">$</span> {installCmd}
            </code>
            <button
              onClick={handleCopy}
              className="flex-shrink-0 p-2 hover:bg-surface rounded transition-colors"
              aria-label="Copy command"
            >
              {copied ? (
                <Check size={18} className="text-success" />
              ) : (
                <Copy size={18} className="text-text-muted" />
              )}
            </button>
          </div>

          {/* Alternative options */}
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div className="card text-center py-6">
              <div className="font-medium mb-1">Docker</div>
              <code className="text-text-muted text-xs">docker run odara/odara</code>
            </div>
            <div className="card text-center py-6">
              <div className="font-medium mb-1">npm</div>
              <code className="text-text-muted text-xs">npx @odara/cli</code>
            </div>
            <div className="card text-center py-6">
              <div className="font-medium mb-1">From source</div>
              <code className="text-text-muted text-xs">cargo install odara</code>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GetStarted
