import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Upload, FileText, Trash2, Download, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

interface FileEntry {
  name: string;
  size: number;
  size_human: string;
}

interface StatusMessage {
  type: 'success' | 'error';
  text: string;
}

const UPLOAD_PORT = 8888;

const UploadSection: React.FC = () => {
  const baseUrl = `${window.location.protocol}//${window.location.hostname}:${UPLOAD_PORT}`;
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = useCallback(async () => {
    try {
      const res = await fetch(`${baseUrl}/api/files`);
      const data = await res.json();
      setFiles(data.files || []);
    } catch {
      setStatus({ type: 'error', text: 'Cannot connect to upload server. Make sure it is running on port ' + UPLOAD_PORT + '.' });
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const uploadFiles = async (fileList: FileList | File[]) => {
    if (!fileList.length) return;
    setUploading(true);
    setStatus(null);

    const formData = new FormData();
    for (const file of Array.from(fileList)) {
      formData.append('file', file);
    }

    try {
      const res = await fetch(`${baseUrl}/`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData,
      });
      const data = await res.json();

      if (data.uploaded?.length) {
        setStatus({ type: 'success', text: `Uploaded: ${data.uploaded.join(', ')}` });
      }
      if (data.errors?.length) {
        setStatus({ type: 'error', text: `Errors: ${data.errors.join(', ')}` });
      }
      await fetchFiles();
    } catch {
      setStatus({ type: 'error', text: 'Upload failed. Check server connection.' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const deleteFile = async (name: string) => {
    try {
      const encoded = encodeURIComponent(name);
      await fetch(`${baseUrl}/api/files/${encoded}`, { method: 'DELETE' });
      setStatus({ type: 'success', text: `Deleted: ${name}` });
      await fetchFiles();
    } catch {
      setStatus({ type: 'error', text: `Failed to delete ${name}` });
    }
  };

  const downloadUrl = (name: string) => `${baseUrl}/download/${encodeURIComponent(name)}`;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-odara-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-odara-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10 max-w-4xl">
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

        {/* Drop zone / Upload area */}
        <div
          className={`relative rounded-xl border-2 border-dashed p-12 text-center transition-all cursor-pointer mb-8 ${
            dragOver
              ? 'border-odara-primary bg-odara-primary/10'
              : 'border-white/20 hover:border-white/40 bg-white/[0.02]'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className={`w-12 h-12 mx-auto mb-4 ${dragOver ? 'text-odara-primary' : 'text-odara-muted'}`} />
          <p className="text-lg font-medium mb-1">
            {uploading ? 'Uploading...' : 'Drag & drop files here'}
          </p>
          <p className="text-odara-muted text-sm">or click to browse</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && uploadFiles(e.target.files)}
          />
          {uploading && (
            <div className="mt-4">
              <div className="w-48 h-1.5 bg-white/10 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-odara-primary rounded-full animate-pulse w-3/4" />
              </div>
            </div>
          )}
        </div>

        {/* Status message */}
        {status && (
          <div className={`flex items-center gap-3 p-4 rounded-lg mb-6 ${
            status.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}>
            {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            <span className="text-sm">{status.text}</span>
          </div>
        )}

        {/* File list */}
        <div className="rounded-xl border border-white/10 bg-odara-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <h3 className="font-semibold text-lg">Files</h3>
            <button
              onClick={() => { setLoading(true); fetchFiles(); }}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-odara-muted hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-odara-muted">
              <RefreshCw className="w-6 h-6 mx-auto mb-3 animate-spin" />
              Loading files...
            </div>
          ) : files.length === 0 ? (
            <div className="p-12 text-center text-odara-muted">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No files uploaded yet</p>
            </div>
          ) : (
            <ul>
              {files.map((file) => (
                <li
                  key={file.name}
                  className="flex items-center justify-between px-6 py-3 border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-4 h-4 text-odara-primary flex-shrink-0" />
                    <span className="truncate">{file.name}</span>
                    <span className="text-odara-muted text-sm flex-shrink-0">({file.size_human})</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <a
                      href={downloadUrl(file.name)}
                      className="p-1.5 text-odara-muted hover:text-odara-accent transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => deleteFile(file.name)}
                      className="p-1.5 text-odara-muted hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default UploadSection;
