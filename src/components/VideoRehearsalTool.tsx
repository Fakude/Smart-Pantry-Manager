import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, CheckCircle2, Video, Mic, FileText, ChevronRight } from 'lucide-react';

export const VideoRehearsalTool: React.FC = () => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  const segments = [
    {
      id: 'github',
      title: '1. GitHub Walkthrough (Approx 1 Minute)',
      targetMinSec: '0:00 - 1:00',
      description: 'Scroll through your commit history on screen and narrate how the project was built step by step.',
      script: `Hello everyone, my name is Nhlanhla Fakude (Student ITS Number: 202307842). This is my video demonstration for Mobile App Development 700 at Richfield Graduate Institute of Technology, presenting the Smart Pantry Manager Android application.

Here on screen is my public GitHub repository. As required by Section 4, the application was developed incrementally under version control from day one, totaling 12 distinct, descriptive commits. 

Starting from initial project scaffolding and Gradle configurations, I next built the domain models and SQLiteOpenHelper schema. From there, I implemented the RecyclerView adapters, added input validation forms, engineered the core Strict Matching algorithm, and resolved pluralization edge cases. This history reflects my genuine iterative engineering workflow.`,
      onscreenAction: 'Open GitHub in browser or our GitHub tab, scroll through the 12 commits, highlight initial commit, DatabaseHelper commit, and StrictEngine commit.',
    },
    {
      id: 'live_demo',
      title: '2. Live App Demonstration (Approx 2-3 Minutes)',
      targetMinSec: '1:00 - 3:30',
      description: 'Demonstrate full CRUD on pantry items, test the strict-matching rule live, and prove SQLite data persistence.',
      script: `Now let's switch to the running Android app. On the main Pantry List Activity, you can see our current leftover inventory displayed inside a RecyclerView with custom CardView items, category tags, and expiry urgency warnings.

First, let's demonstrate the full CRUD cycle:
- READ: The items you see are retrieved live from our on-device SQLite database table.
- CREATE: I tap the Floating Action Button to launch AddEditIngredientActivity. Notice our input validation: if I leave the name empty or enter a negative quantity, error indicators appear. Let's add 'Tomatoes', quantity 4, unit 'pcs', expiring in 2 days. When I tap Save, a Toast confirms the SQLite insert.
- UPDATE: I can click on any item, modify the quantity from 4 to 6, and update it in SQLite.
- DELETE: Clicking the trash icon deletes the record cleanly with immediate UI refresh.

Now, let's demonstrate the CORE RULE: Section 2.3 Strict Matching.
Let's switch to the Suggested Recipes tab. Right now, Rustic Tomato Basil Spaghetti appears because we have 100% of its required ingredients: Pasta, Tomatoes, Garlic, and Olive Oil.
Watch what happens when I return to the pantry and delete or reduce our Tomatoes below the required amount: immediately, the Spaghetti disappears from the suggested list! It is not shown as a partial match. Only when all ingredients exist in sufficient quantity does it qualify.
Finally, if I close and reopen the app, all our pantry data remains intact, proving genuine on-device SQLite persistence.`,
      onscreenAction: 'Interact with the Android emulator on the left: add an item, edit it, delete it, switch to Recipes to show the match, delete one ingredient to show it disappear, then refresh to show persistence.',
    },
    {
      id: 'code_concept',
      title: '3. Technical Concept Explanation (Approx 2-3 Minutes)',
      targetMinSec: '3:30 - 5:45',
      description: 'Explain 3 core technical concepts: SQLite DatabaseHelper, Activity Lifecycle, and Strict-Matching algorithm.',
      script: `With the codebase open in Android Studio, I will now explain three core architectural concepts:

Concept 1: On-Device SQLite Database Architecture (DatabaseHelper.java)
Our DatabaseHelper extends SQLiteOpenHelper. In onCreate(), we define relational tables: TABLE_PANTRY and TABLE_RECIPES with a foreign-key relationship for TABLE_RECIPE_INGREDIENTS. CRUD methods use ContentValues for parameterized insertion and updates, preventing SQL injection. All queries return standard Android Cursor objects which we map into clean POJO entity instances.

Concept 2: Android Activity Lifecycle and Navigation (PantryListActivity.java)
In PantryListActivity, we handle lifecycle transitions carefully. While initial setup occurs in onCreate(), data querying is intentionally executed in onResume(). This guarantees that whenever the user finishes an AddEditIngredientActivity or adjusts settings and returns via the back stack, the RecyclerView automatically queries the latest database state without requiring manual reloads.

Concept 3: Strict Matching Engine & NLP Stemming (StrictMatchingEngine.java)
In StrictMatchingEngine, we iterate over every recipe requirement. We reject the recipe immediately if any single ingredient is missing or if the pantry quantity is below the required threshold. To prevent trivial string failures like 'tomato' vs 'tomatoes' or 'potatoes' vs 'potato', we built normalizeIngredientName() using regular expression stemming, satisfying Section 2.3 without external heavy dependencies.`,
      onscreenAction: 'Switch to the Codebase tab, highlight DatabaseHelper.java onCreate and insertPantryItem, highlight PantryListActivity onResume, and highlight StrictMatchingEngine isStrictMatch method.',
    },
    {
      id: 'database_justification',
      title: '4. Database Justification (Approx 30s - 1 Minute)',
      targetMinSec: '5:45 - 6:30',
      description: 'Explain why SQLite was chosen over Firebase and PostgreSQL.',
      script: `Finally, to address Section 3.2 and 5.1: Database Justification.
I selected local SQLite over Firebase and PostgreSQL for three strategic reasons:
1. Offline-First Capability: Pantries and grocery storage areas often suffer from dead mobile reception. SQLite works 100% offline with zero latency and zero dependency on network state.
2. Zero Operating Overhead: It requires no external server hosting, API keys, or recurring cloud subscription fees.
3. User Privacy: Dietary preferences and food inventory remain completely private to the user's physical device.

Thank you very much. This concludes my Mobile App Development 700 practical assessment demonstration.`,
      onscreenAction: 'Summarize the 3 points clearly and maintain an engaging, confident tone.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Timer & Controls Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-900 rounded">
              Section 5 Video Assessment
            </span>
            <span className="text-xs text-slate-500 font-medium">Target Duration: 5 to 7 Minutes</span>
          </div>
          <h2 className="text-base font-bold text-slate-900">
            Video Presentation Teleprompter & Rehearsal Timer
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Follow this calibrated narration script to ensure all 4 mandatory sections are covered within the time limit.
          </p>
        </div>

        {/* Stopwatch Card */}
        <div className="flex items-center gap-4 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-inner shrink-0">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Rehearsal Time
            </div>
            <div className={`font-mono text-2xl font-bold tracking-tight ${
              secondsElapsed >= 300 && secondsElapsed <= 420
                ? 'text-emerald-400'
                : secondsElapsed > 420
                ? 'text-red-400'
                : 'text-white'
            }`}>
              {formatTime(secondsElapsed)}
            </div>
          </div>

          <div className="flex items-center gap-2 border-l border-slate-750 pl-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                isRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
              title={isRunning ? 'Pause' : 'Start Timer'}
            >
              {isRunning ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
            </button>

            <button
              onClick={() => {
                setIsRunning(false);
                setSecondsElapsed(0);
              }}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Indicator for 5-7 minutes */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-slate-700">Video Duration Progress:</span>
          <span className="text-slate-500">
            {secondsElapsed < 300
              ? `${Math.round((secondsElapsed / 300) * 100)}% to minimum 5:00 mark`
              : secondsElapsed <= 420
              ? 'Ideal Target Window (5:00 - 7:00)'
              : 'Warning: Exceeds 7:00 maximum limit'}
          </span>
        </div>

        <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          {/* Minimum 5 min zone marker */}
          <div className="absolute left-[71.4%] top-0 bottom-0 w-0.5 bg-emerald-500 z-10" title="5:00 Min Mark" />
          {/* Progress fill */}
          <div
            className={`h-full transition-all duration-300 ${
              secondsElapsed > 420
                ? 'bg-red-500'
                : secondsElapsed >= 300
                ? 'bg-emerald-500'
                : 'bg-blue-600'
            }`}
            style={{ width: `${Math.min(100, (secondsElapsed / 420) * 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
          <span>0:00 Start</span>
          <span className="pl-16 text-emerald-700 font-semibold">5:00 (Minimum)</span>
          <span className="text-amber-700 font-semibold">7:00 (Maximum Limit)</span>
        </div>
      </div>

      {/* Rehearsal Segments Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Selector */}
        <div className="lg:col-span-4 space-y-2">
          {segments.map((seg, idx) => (
            <button
              key={seg.id}
              onClick={() => setActiveSegmentIndex(idx)}
              className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start justify-between gap-3 ${
                activeSegmentIndex === idx
                  ? 'bg-blue-900 text-white shadow-xs border-blue-900'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <div className="min-w-0">
                <span className={`text-[10px] font-bold uppercase tracking-wider block mb-0.5 ${
                  activeSegmentIndex === idx ? 'text-blue-200' : 'text-slate-400'
                }`}>
                  {seg.targetMinSec}
                </span>
                <h4 className="font-semibold text-xs truncate">{seg.title}</h4>
                <p className={`text-[11px] line-clamp-1 mt-1 ${
                  activeSegmentIndex === idx ? 'text-blue-100' : 'text-slate-500'
                }`}>
                  {seg.description}
                </p>
              </div>
              <ChevronRight className={`w-4 h-4 shrink-0 mt-2 ${
                activeSegmentIndex === idx ? 'text-white' : 'text-slate-400'
              }`} />
            </button>
          ))}
        </div>

        {/* Teleprompter Script Card */}
        <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] font-bold text-blue-900 px-2 py-0.5 bg-blue-50 rounded">
              Target Window: {segments[activeSegmentIndex].targetMinSec}
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-2">
              {segments[activeSegmentIndex].title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {segments[activeSegmentIndex].description}
            </p>
          </div>

          {/* Onscreen action guidance */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-900 flex items-start gap-2.5">
            <Video className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block mb-0.5">What to show on your screen right now:</strong>
              {segments[activeSegmentIndex].onscreenAction}
            </div>
          </div>

          {/* Teleprompter text */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans space-y-3">
            <div className="flex items-center gap-1.5 text-blue-900 font-semibold mb-1">
              <Mic className="w-3.5 h-3.5" />
              <span>Verbal Narration Script (Read clearly):</span>
            </div>
            {segments[activeSegmentIndex].script.split('\n\n').map((paragraph, pIdx) => (
              <p key={pIdx} className="text-slate-800 text-[13px] leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tips for Section 5 */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <span>
              Tip: Speak naturally, keep 1080p recording active, and do not submit a silent video.
            </span>
            <div className="flex gap-2">
              {activeSegmentIndex > 0 && (
                <button
                  onClick={() => setActiveSegmentIndex(prev => prev - 1)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs"
                >
                  &larr; Previous Section
                </button>
              )}
              {activeSegmentIndex < segments.length - 1 && (
                <button
                  onClick={() => setActiveSegmentIndex(prev => prev + 1)}
                  className="px-3 py-1 bg-blue-900 hover:bg-blue-800 text-white rounded text-xs font-medium"
                >
                  Next Section &rarr;
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
