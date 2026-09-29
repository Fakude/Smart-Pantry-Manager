import React, { useState } from 'react';
import { GIT_COMMIT_HISTORY } from '../data/seedData';
import { GitCommit } from '../types';
import { GitBranch, GitCommit as GitCommitIcon, Calendar, User, FileText, CheckCircle2, ExternalLink } from 'lucide-react';

export const GitHubWalkthrough: React.FC = () => {
  const [selectedCommit, setSelectedCommit] = useState<GitCommit>(GIT_COMMIT_HISTORY[0]);
  const [activeTab, setActiveTab] = useState<'commits' | 'readme'>('commits');

  return (
    <div className="space-y-6">
      {/* Top GitHub Repo Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GitBranch className="w-4 h-4 text-blue-900" />
              <span className="font-mono text-xs font-semibold text-slate-900">
                nhlanhla-fakude / smart-pantry-manager-android
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-medium">
                Public Repo
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Mobile App Development 700 Practical Assignment Portfolio — Richfield Graduate Institute of Technology
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-medium">
              <strong>{GIT_COMMIT_HISTORY.length}</strong> incremental commits (Min 10 required)
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('commits')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'commits'
                ? 'bg-blue-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Commit History ({GIT_COMMIT_HISTORY.length})
          </button>
          <button
            onClick={() => setActiveTab('readme')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'readme'
                ? 'bg-blue-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Repository README.md
          </button>
        </div>
      </div>

      {activeTab === 'commits' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Commit List Timeline */}
          <div className="lg:col-span-6 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Incremental Commit Log
              </h3>
              <span className="text-[10px] text-slate-400">Chronological Evolution</span>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {GIT_COMMIT_HISTORY.map((commit, idx) => (
                <div
                  key={commit.hash}
                  onClick={() => setSelectedCommit(commit)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    selectedCommit.hash === commit.hash
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-semibold">
                      {commit.hash}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Step #{idx + 1} · {commit.date.split(' ')[0]}
                    </span>
                  </div>

                  <h4 className="font-semibold text-slate-900 text-xs mb-1">
                    {commit.message}
                  </h4>

                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>Nhlanhla Fakude</span>
                    <span>·</span>
                    <span>{commit.filesChanged.length} files changed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Commit Inspector Detail */}
          <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold text-blue-900 px-2 py-0.5 bg-blue-50 rounded">
                  commit {selectedCommit.hash}
                </span>
                <span className="text-xs text-slate-500">{selectedCommit.date}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-2">
                {selectedCommit.message}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Author: <strong>{selectedCommit.author}</strong>
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
              <span className="font-semibold text-slate-900 block mb-1">
                Development Context & Rationale:
              </span>
              {selectedCommit.description}
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Files Touched in this Commit
              </h4>
              <ul className="space-y-1.5">
                {selectedCommit.filesChanged.map((file, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-xs font-mono text-slate-700 py-1 px-2.5 bg-slate-50 rounded border border-slate-200/60"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-800 shrink-0" />
                    <span className="truncate">{file}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Video Script Note */}
            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-xs text-emerald-900">
              <span className="font-semibold block mb-0.5">
                Video Presentation Cue (Section 5.1):
              </span>
              During the 1-minute GitHub walkthrough, scroll through this commit history to narrate how the application was engineered incrementally from architecture scaffolding to SQLite database persistence and strict recipe filtering.
            </div>
          </div>
        </div>
      ) : (
        /* Formatted README.md */
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs max-w-4xl mx-auto space-y-5 text-slate-800 text-xs leading-relaxed">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-lg font-bold text-slate-900">
              Smart Pantry Manager (Android / Java)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Practical Assessment Portfolio · Mobile App Development 700 (MAD700) · Richfield Graduate Institute of Technology
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">1. Problem Statement & Concept</h3>
            <p>
              Food waste is one of the most pressing environmental and economic challenges worldwide. Consumers frequently discard edible produce, dairy, and grains simply because they lack recipe inspiration for the mismatched items left in their kitchen.
            </p>
            <p>
              The <strong>Smart Pantry Manager</strong> solves this by cataloging the exact leftover ingredients present in a user&apos;s pantry and strictly suggesting only meals that can be fully prepared using those existing supplies—demanding zero grocery purchases.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">2. Technical Justification for SQLite (Section 3.2 & 5.1)</h3>
            <p>
              For this project, <strong>on-device SQLite via SQLiteOpenHelper</strong> was selected over cloud alternatives (Firebase, PostgreSQL) for the following reasons:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>
                <strong>Offline-First Reliability:</strong> Pantries and domestic cooking areas often lack high-speed connectivity. SQLite executes instantaneous queries locally without network latency or dropped requests.
              </li>
              <li>
                <strong>Zero Operating Overhead:</strong> SQLite runs hermetically on the Android OS with zero external API keys, service quotas, or cloud server costs.
              </li>
              <li>
                <strong>Local Privacy:</strong> The user&apos;s food habits and household inventory stay private on their physical phone.
              </li>
              <li>
                <strong>Syllabus Alignment:</strong> Directly demonstrates deep understanding of native Android database mechanics: <code>SQLiteOpenHelper</code>, <code>ContentValues</code>, <code>Cursor</code> queries, and table creation.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">3. Quick Setup & Build Instructions</h3>
            <ol className="list-decimal pl-5 space-y-1 text-slate-700">
              <li>Open Android Studio (Hedgehog, Iguana, or newer).</li>
              <li>Select <strong>File &gt; Open...</strong> and choose the extracted project folder.</li>
              <li>Allow Gradle to sync dependencies (targeting SDK 34 and JDK 17).</li>
              <li>Start an Android Virtual Device (AVD) running Android 8.0 (API 26) or above.</li>
              <li>Click the green <strong>Run &apos;app&apos;</strong> button (Shift+F10).</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};
