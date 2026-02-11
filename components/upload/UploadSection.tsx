import React, { useState } from 'react';
import { Upload, ExternalLink, RefreshCw } from 'lucide-react';

const UploadSection: React.FC = () => {
  const uploadUrl = `${window.location.protocol}//${window.location.hostname}:8888`;
  const [iframeKey, setIframeKey] = useState(0);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-odara-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-odara-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-odara-primary/30 bg-odara-primary/10 text-odara-primary text-sm font-medium mb-4">
            <Upload className="w-4 h-4" />
            File Manager
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Upload <span className="gradient-text">Files</span>
          </h1>
          <p className="text-odara-muted text-lg max-w-2xl mx-auto">
            Upload and manage data files on your Odara instance.
            Supports CSV, JSON, Parquet, and any other file format.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-end gap-3 mb-4 max-w-5xl mx-auto">
          <button
            onClick={() => setIframeKey(k => k + 1)}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-odara-muted hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <a
            href={uploadUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-odara-muted hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open in new tab
          </a>
        </div>

        {/* Iframe container */}
        <div className="max-w-5xl mx-auto rounded-xl border border-white/10 overflow-hidden bg-odara-card shadow-2xl">
          <iframe
            key={iframeKey}
            src={uploadUrl}
            title="File Upload"
            className="w-full border-0"
            style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}
          />
        </div>
      </div>
    </section>
  );
};

export default UploadSection;
