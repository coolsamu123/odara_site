import React, { useState, useRef } from 'react';
import { Upload, FolderOpen, Send, AlertCircle, CheckCircle2 } from 'lucide-react';

interface StatusMessage {
  type: 'success' | 'error';
  text: string;
}

// Site is hosted on GitHub Pages (static) — API calls go through Caddy on the server
const UPLOAD_BASE = 'http://65.21.199.249/upload';

const UploadSection: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch(`${UPLOAD_BASE}/`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData,
      });
      const data = await res.json();

      if (data.uploaded?.length) {
        setStatus({ type: 'success', text: `Uploaded ${data.uploaded.join(', ')} to ${data.destination}` });
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
      if (data.errors?.length) {
        setStatus({ type: 'error', text: data.errors.join(', ') });
      }
    } catch {
      setStatus({ type: 'error', text: 'Upload failed. Make sure the upload server is running.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-odara-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-odara-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-odara-primary/30 bg-odara-primary/10 text-odara-primary text-sm font-medium mb-4">
            <Upload className="w-4 h-4" />
            File Upload
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Upload <span className="gradient-text">Files</span>
          </h1>
          <p className="text-odara-muted text-lg">
            Send files from your machine to the Odara instance.
          </p>
        </div>

        {/* Upload form */}
        <div className="rounded-xl border border-white/10 bg-odara-card p-6 space-y-5">

          {/* Row 1: File picker */}
          <div>
            <label className="block text-sm font-medium text-odara-muted mb-2">
              Source file
            </label>
            <div className="flex gap-3">
              <div className="flex-1 flex items-center px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm min-w-0">
                <span className={`truncate ${selectedFile ? 'text-white' : 'text-odara-muted'}`}>
                  {selectedFile ? selectedFile.name : 'No file selected'}
                </span>
                {selectedFile && (
                  <span className="ml-2 text-odara-muted text-xs flex-shrink-0">
                    ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-all flex-shrink-0"
              >
                <FolderOpen className="w-4 h-4" />
                Browse
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setSelectedFile(file);
                  setStatus(null);
                }}
              />
            </div>
          </div>

          {/* Destination (fixed) */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm">
            <span className="text-odara-muted">Destination:</span>
            <span className="text-white font-mono">/mnt/data/csv</span>
          </div>

          {/* Upload button */}
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-odara-primary hover:bg-odara-primary/80 text-white"
          >
            <Send className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>

        {/* Status message */}
        {status && (
          <div className={`flex items-center gap-3 p-4 rounded-lg mt-5 ${
            status.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}>
            {status.type === 'success'
              ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            <span className="text-sm">{status.text}</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default UploadSection;
