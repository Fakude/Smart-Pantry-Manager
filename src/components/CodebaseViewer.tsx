import React, { useState } from 'react';
import { JAVA_PROJECT_FILES } from '../data/javaCodebase';
import { JavaCodeFile } from '../types';
import { generateAndroidProjectZip, triggerBlobDownload } from '../utils/exportProjectZip';
import { FileCode, Download, Copy, Check, FolderGit2, CheckCircle2, Loader2 } from 'lucide-react';

export const CodebaseViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<JavaCodeFile>(JAVA_PROJECT_FILES[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const categories = [
    { id: 'all', label: 'All Project Files' },
    { id: 'database', label: 'SQLite Database' },
    { id: 'activity', label: 'Activities' },
    { id: 'adapter', label: 'RecyclerView Adapters' },
    { id: 'util', label: 'Strict Engine' },
    { id: 'model', label: 'POJO Models' },
    { id: 'manifest', label: 'Manifest & Gradle' },
    { id: 'docs', label: 'README.md' },
  ];

  const filteredFiles = JAVA_PROJECT_FILES.filter(f => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'manifest') return f.category === 'manifest' || f.category === 'gradle';
    return f.category === selectedCategory;
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsExporting(true);
      const zipBlob = await generateAndroidProjectZip();
      triggerBlobDownload(zipBlob, 'SmartPantryManager_AndroidStudio_Java.zip');
    } catch (err) {
      console.error('Failed to export zip', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with One-Click Zip Export */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-900 rounded">
              Java / Android Studio Project
            </span>
            <span className="text-xs text-slate-500 font-medium">SDK 34 (Android 14) · Java 17</span>
          </div>
          <h2 className="text-base font-bold text-slate-900">
            Source Code Repository & Project Export
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Complete, authentic Java Android code implementing SQLiteOpenHelper, RecyclerView Adapters, and Intent navigation.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDownloadZip}
            disabled={isExporting}
            className="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-medium text-xs rounded-lg shadow-sm transition-all flex items-center gap-2 active:scale-[0.98]"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download Android Studio Project (.ZIP)
          </button>
        </div>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* File Navigator */}
        <div className="lg:col-span-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-1 mb-3 pb-3 border-b border-slate-100">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                  selectedCategory === c.id
                    ? 'bg-blue-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Files ({filteredFiles.length})
          </h3>

          <div className="space-y-1 overflow-y-auto max-h-[500px] pr-1">
            {filteredFiles.map(file => (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full p-2 rounded-lg text-left text-xs transition-colors flex items-center gap-2.5 ${
                  selectedFile.path === file.path
                    ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <FileCode className={`w-4 h-4 shrink-0 ${selectedFile.path === file.path ? 'text-blue-900' : 'text-slate-400'}`} />
                <div className="min-w-0">
                  <p className="truncate">{file.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{file.path}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Code Editor Window */}
        <div className="lg:col-span-8 bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-800 flex flex-col">
          {/* Code Window Header */}
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                <span className="font-mono text-xs text-slate-300 font-medium ml-2 truncate">
                  {selectedFile.path}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>

          {/* File Context Bar */}
          <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 text-[11px] text-slate-400">
            {selectedFile.description}
          </div>

          {/* Code Content */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-200 leading-relaxed max-h-[540px]">
            <pre className="whitespace-pre">
              <code>{selectedFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
