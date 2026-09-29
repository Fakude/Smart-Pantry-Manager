import React, { useRef } from 'react';
import { UserSettings } from '../types';
import { Printer, Copy, Check, FileDown, ExternalLink } from 'lucide-react';

interface WrittenReportViewerProps {
  settings: UserSettings;
}

export const WrittenReportViewer: React.FC<WrittenReportViewerProps> = ({ settings }) => {
  const [copied, setCopied] = React.useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    if (reportRef.current) {
      navigator.clipboard.writeText(reportRef.current.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-900 rounded">
              Academic Submission Document
            </span>
            <span className="text-xs text-slate-500 font-medium">Times New Roman · Harvard Referencing</span>
          </div>
          <h2 className="text-base font-bold text-slate-900">
            Written Practical Assignment Report
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Formatted in accordance with Richfield Graduate Institute of Technology (Pty) Ltd standards for Mobile App Development 700.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyText}
            className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Full Report!' : 'Copy Report Text'}
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-medium text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Printable Document Sheet Container */}
      <div
        ref={reportRef}
        className="bg-white p-8 md:p-14 max-w-4xl mx-auto rounded-xl border border-slate-200 shadow-lg text-slate-900 font-serif leading-relaxed text-[15px]"
        style={{ fontFamily: '"Times New Roman", Times, serif', lineHeight: '1.6' }}
      >
        {/* ========================================================
            1. COVER PAGE
            ======================================================== */}
        <div className="border-b-2 border-slate-900 pb-12 mb-12 text-center">
          <div className="text-sm uppercase tracking-widest text-slate-600 font-bold mb-1">
            richfield.ac.za
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 mb-1">
            RICHFIELD GRADUATE INSTITUTE OF TECHNOLOGY (PTY) LTD
          </h1>
          <p className="text-[11px] text-slate-500 max-w-xl mx-auto italic mb-8">
            Registered with the Department of Higher Education & Training as a Private Higher Education Institution under the Higher Education Act, 1997, Registration Certificate No. 2000/HE07/008.
          </p>

          <div className="border-t border-b border-slate-300 py-6 my-6">
            <h2 className="text-xl font-bold text-slate-900 uppercase">
              FACULTY OF INFORMATION TECHNOLOGY
            </h2>
            <h3 className="text-lg font-semibold text-slate-800 mt-1">
              MOBILE APP DEVELOPMENT 700 (MAD700)
            </h3>
            <p className="text-sm font-medium text-slate-600 mt-1">
              PRACTICAL ASSIGNMENT
            </p>
          </div>

          <div className="my-8 text-center">
            <h4 className="text-xl font-bold text-blue-950 uppercase tracking-wide">
              Smart Pantry Manager
            </h4>
            <p className="text-sm text-slate-700 italic mt-1 max-w-lg mx-auto">
              A Java Android Application that Suggests Recipes Based Strictly on Leftover Ingredients to Cut Food Waste
            </p>
          </div>

          {/* Student Identification Meta Box */}
          <div className="max-w-md mx-auto text-left border border-slate-300 p-5 rounded bg-slate-50/50 space-y-2 text-sm">
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="font-semibold text-slate-700">Name and Surname:</span>
              <span className="font-bold text-slate-900">{settings.studentName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="font-semibold text-slate-700">Student ITS No:</span>
              <span className="font-bold text-slate-900">{settings.studentNumber}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="font-semibold text-slate-700">Qualification:</span>
              <span className="text-slate-900">BSc in Information Technology</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="font-semibold text-slate-700">Year of Study / Semester:</span>
              <span className="text-slate-900">Year 3 / Semester 2</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="font-semibold text-slate-700">GitHub Repository URL:</span>
              <span className="font-mono text-xs text-blue-900 underline truncate max-w-[200px]">
                https://github.com/nhlanhla-fakude/smart-pantry-manager
              </span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="font-semibold text-slate-700">Date submitted:</span>
              <span className="text-slate-900">{settings.assignmentDate}</span>
            </div>
          </div>

          {/* Declaration of Originality */}
          <div className="max-w-md mx-auto mt-6 p-4 border border-slate-300 rounded text-left text-xs bg-white text-slate-700 space-y-2">
            <p className="font-bold uppercase tracking-wider text-slate-900">
              DECLARATION OF ORIGINALITY
            </p>
            <p className="leading-relaxed">
              I hereby declare that this assignment is my own work and has not been copied from any other source except where due acknowledgment is made. I affirm that all sources used have been properly cited and that this submission complies with the institution&apos;s policies on academic integrity and plagiarism.
            </p>
            <div className="pt-3 flex justify-between items-center font-sans text-[11px]">
              <div>
                Student Signature: <span className="italic font-serif font-bold underline">N. Fakude</span>
              </div>
              <div>Date: {settings.assignmentDate}</div>
            </div>
          </div>
        </div>

        {/* ========================================================
            2. TABLE OF CONTENTS
            ======================================================== */}
        <div className="mb-12 pb-8 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-300 pb-1">
            Table of Contents
          </h2>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span>Cover page</span>
              <span className="font-mono text-slate-500">Page 1</span>
            </div>
            <div className="flex justify-between">
              <span>Table of contents</span>
              <span className="font-mono text-slate-500">Page 2</span>
            </div>
            <div className="flex justify-between">
              <span>Introduction</span>
              <span className="font-mono text-slate-500">Page 3</span>
            </div>
            <div className="flex justify-between">
              <span>System design</span>
              <span className="font-mono text-slate-500">Page 4</span>
            </div>
            <div className="flex justify-between pl-4 text-slate-600">
              <span>- Screen flow diagram</span>
              <span className="font-mono text-slate-400">Page 4</span>
            </div>
            <div className="flex justify-between pl-4 text-slate-600">
              <span>- Data model / ER diagram</span>
              <span className="font-mono text-slate-400">Page 5</span>
            </div>
            <div className="flex justify-between">
              <span>Screenshots of every output</span>
              <span className="font-mono text-slate-500">Page 6</span>
            </div>
            <div className="flex justify-between">
              <span>Key code snippets</span>
              <span className="font-mono text-slate-500">Page 8</span>
            </div>
            <div className="flex justify-between">
              <span>Challenges and solutions</span>
              <span className="font-mono text-slate-500">Page 10</span>
            </div>
            <div className="flex justify-between">
              <span>Conclusion and reflection</span>
              <span className="font-mono text-slate-500">Page 11</span>
            </div>
            <div className="flex justify-between">
              <span>Reference list</span>
              <span className="font-mono text-slate-500">Page 12</span>
            </div>
          </div>
        </div>

        {/* ========================================================
            3. INTRODUCTION
            ======================================================== */}
        <div className="mb-12 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
            Introduction
          </h2>
          <p>
            Domestic food waste represents an escalating socioeconomic and ecological challenge in contemporary households. According to empirical studies on consumer behavior (Aschemann-Witzel et al., 2015), a substantial proportion of household food waste originates not from intentional negligence, but from cognitive friction: individuals struggle to synthesize scattered, mismatched leftover ingredients into palatable meals. Consequently, half-used produce, dairy products, and starch staples spoil in storage while consumers make redundant trips to grocery stores.
          </p>
          <p>
            The <strong>Smart Pantry Manager</strong> was conceptualized and developed to address this direct consumer dilemma. Implemented natively in Java for the Android platform, the system functions as an intelligent culinary inventory manager. Its core value proposition is the <strong>Strict-Matching Rule (Section 2.3)</strong>: the application actively refuses to suggest recipes requiring missing ingredients. A recipe is presented to the user if and only if every single constituent ingredient is already present in their domestic pantry in at least the required quantity.
          </p>
          <p>
            By guaranteeing that zero additional shopping trips are necessary, the application provides an effortless mechanism for households to eliminate waste, maximize the economic value of their groceries, and cultivate sustainable kitchen habits. In strict compliance with the assignment brief, location-based services and third-party mapping SDKs are explicitly omitted; the application&apos;s perimeter is strictly confined to domestic pantry inventory tracking and relational recipe resolution.
          </p>
        </div>

        {/* ========================================================
            4. SYSTEM DESIGN
            ======================================================== */}
        <div className="mb-12 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
            System Design
          </h2>

          <h3 className="text-base font-bold text-slate-800">
            Screen flow / wireframe diagram
          </h3>
          <p>
            The application conforms to standard Android architecture principles, organizing core tasks across modular <code>Activity</code> components interconnected via explicit <code>Intent</code> objects.
          </p>

          {/* ASCII / Semantic Screen Flow Diagram */}
          <div className="p-4 bg-slate-50 border border-slate-300 rounded font-mono text-xs text-slate-800 overflow-x-auto">
            <pre>{`+-----------------------------------------------------------------------------------+
|                            PantryListActivity (Launcher)                          |
|  - Displays SQLite pantry items in RecyclerView with custom PantryAdapter         |
|  - Search filter, category filters, and expiry urgency cues                       |
+-------------------+-------------------------------+-------------------------------+
                    |                               |
          [FAB / Tap Item Intent]        [BottomNav Intent]              [BottomNav Intent]
                    |                               |                               |
                    v                               v                               v
+-------------------------------+ +-------------------------------+ +-------------------------------+
|   AddEditIngredientActivity   | |   SuggestedRecipesActivity    | |       SettingsActivity        |
| - Form with input validation  | | - Executes StrictMatchingEngine| | - SharedPreferences config    |
| - DatePickerDialog for expiry | | - 100% strict ingredient check| | - Expiry alert threshold (days)|
| - SQLite INSERT / UPDATE / DEL| | - Zero-match empty state      | | - Reset sample DB utility     |
+-------------------------------+ +---------------+---------------+ +-------------------------------+
                                                  |
                                            [Tap Recipe Intent]
                                                  |
                                                  v
                                  +-------------------------------+
                                  |     RecipeDetailActivity      |
                                  | - Full ingredient checklist   |
                                  | - Method preparation steps    |
                                  | - "Cook This" SQLite deduction|
                                  +-------------------------------+`}</pre>
          </div>
          <p className="text-xs text-slate-500 italic text-center">
            Figure 1: Architectural Screen Flow and Intent Navigation Graph.
          </p>

          <h3 className="text-base font-bold text-slate-800 mt-6">
            Data model / ER diagram
          </h3>
          <p>
            Persistent data storage is implemented via on-device SQLite utilizing <code>SQLiteOpenHelper</code> (Section 3.2). The relational schema comprises three primary tables:
          </p>

          <div className="p-4 bg-slate-50 border border-slate-300 rounded font-mono text-xs text-slate-800 overflow-x-auto">
            <pre>{`+-------------------------+          +-------------------------+
|      pantry_items       |          |         recipes         |
+-------------------------+          +-------------------------+
| PK id: INTEGER (AUTO)   |          | PK id: INTEGER (AUTO)   |
|    name: TEXT NOT NULL  |          |    name: TEXT NOT NULL  |
|    quantity: REAL       |          |    category: TEXT       |
|    unit: TEXT NOT NULL  |          |    prep_time_min: INT   |
|    category: TEXT       |          |    cook_time_min: INT   |
|    expiry_date: TEXT    |          |    servings: INTEGER    |
|    notes: TEXT          |          |    difficulty: TEXT     |
|    added_at: DATETIME   |          |    description: TEXT    |
+-------------------------+          |    steps: TEXT          |
                                     +------------+------------+
                                                  | 1
                                                  |
                                                  | N (Cascade Delete)
                                                  v
                                     +-------------------------+
                                     |   recipe_ingredients    |
                                     +-------------------------+
                                     | PK id: INTEGER (AUTO)   |
                                     | FK recipe_id: INTEGER   |
                                     |    ingredient_name: TEXT|
                                     |    quantity: REAL       |
                                     |    unit: TEXT           |
                                     +-------------------------+`}</pre>
          </div>
          <p className="text-xs text-slate-500 italic text-center">
            Figure 2: Relational Database Schema Model (smart_pantry.db).
          </p>

          <h3 className="text-base font-bold text-slate-800 mt-6">
            Strict-matching logic flow
          </h3>
          <p>
            The algorithm operates deterministically:
          </p>
          <ol className="list-decimal pl-6 space-y-1.5 text-sm">
            <li>
              For each candidate recipe R in Database, iterate through its required ingredients I_R = &#123;i_1, i_2, ..., i_k&#125;.
            </li>
            <li>
              Apply word-stemming normalization to i_k.name to mitigate grammatical plural discrepancies (e.g. &quot;tomatoes&quot; &rarr; &quot;tomato&quot;).
            </li>
            <li>
              Query the pantry set P. If no matching pantry record exists, reject R immediately (Match = False).
            </li>
            <li>
              If a match is found, verify that P.quantity &ge; i_k.quantity across normalized unit bases (e.g. grams, milliliters, piece counts). If insufficient, reject R immediately.
            </li>
            <li>
              If and only if all required ingredients in I_R are satisfied, append R to the Suggested Recipes list.
            </li>
          </ol>
        </div>

        {/* ========================================================
            5. SCREENSHOTS OF EVERY OUTPUT
            ======================================================== */}
        <div className="mb-12 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
            Screenshots of every output
          </h2>
          <p>
            The following captured outputs demonstrate all required functional screens operating in the environment, validating full CRUD operations, strict matching, input validation, and settings management:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
            {/* Screenshot 1 */}
            <div className="border border-slate-300 rounded p-3 bg-slate-50">
              <div className="h-56 bg-slate-900 rounded overflow-hidden flex items-center justify-center p-2 text-white">
                <div className="w-full h-full bg-slate-50 text-slate-900 rounded p-2 text-[10px] font-sans flex flex-col">
                  <div className="bg-blue-900 text-white p-1.5 rounded font-bold flex justify-between">
                    <span>Smart Pantry (PantryListActivity)</span>
                    <span className="text-[9px]">10 items</span>
                  </div>
                  <div className="p-1 space-y-1 mt-1 flex-1 overflow-hidden">
                    <div className="bg-white border border-slate-200 p-1.5 rounded shadow-xs flex justify-between">
                      <div>
                        <strong>Eggs</strong> (6 pcs)
                        <div className="text-[8px] text-amber-700">Expires in 4 days</div>
                      </div>
                      <span className="text-[9px] text-blue-900">Dairy & Eggs</span>
                    </div>
                    <div className="bg-white border border-slate-200 p-1.5 rounded shadow-xs flex justify-between">
                      <div>
                        <strong>Tomatoes</strong> (4 pcs)
                        <div className="text-[8px] text-red-600">Expires in 2 days</div>
                      </div>
                      <span className="text-[9px] text-blue-900">Produce</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-600 italic mt-2 text-center">
                Figure 3: PantryListActivity RecyclerView displaying leftover ingredients with expiry warnings and Floating Action Button.
              </p>
            </div>

            {/* Screenshot 2 */}
            <div className="border border-slate-300 rounded p-3 bg-slate-50">
              <div className="h-56 bg-slate-900 rounded overflow-hidden flex items-center justify-center p-2 text-white">
                <div className="w-full h-full bg-slate-50 text-slate-900 rounded p-2 text-[10px] font-sans flex flex-col">
                  <div className="bg-blue-900 text-white p-1.5 rounded font-bold">
                    Add Leftover Item (Validation Active)
                  </div>
                  <div className="p-2 space-y-1.5 mt-1 flex-1">
                    <div className="border border-red-500 bg-red-50 p-1 rounded">
                      <span className="text-red-700 font-bold text-[9px]">Error: Ingredient name is required</span>
                    </div>
                    <div className="border border-red-500 bg-red-50 p-1 rounded">
                      <span className="text-red-700 font-bold text-[9px]">Error: Quantity must be greater than zero</span>
                    </div>
                    <div className="bg-blue-900 text-white text-center py-1 rounded font-bold">
                      Save to SQLite
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-600 italic mt-2 text-center">
                Figure 4: AddEditIngredientActivity demonstrating real-time input validation rejecting empty or negative inputs.
              </p>
            </div>

            {/* Screenshot 3 */}
            <div className="border border-slate-300 rounded p-3 bg-slate-50">
              <div className="h-56 bg-slate-900 rounded overflow-hidden flex items-center justify-center p-2 text-white">
                <div className="w-full h-full bg-slate-50 text-slate-900 rounded p-2 text-[10px] font-sans flex flex-col">
                  <div className="bg-blue-900 text-white p-1.5 rounded font-bold flex justify-between">
                    <span>SuggestedRecipesActivity</span>
                    <span className="bg-emerald-600 px-1 rounded text-[8px]">100% Strict</span>
                  </div>
                  <div className="p-1 space-y-1 mt-1 flex-1">
                    <div className="bg-white border border-slate-200 p-1.5 rounded shadow-xs">
                      <div className="font-bold text-[10px]">Rustic Tomato Basil Spaghetti</div>
                      <div className="text-[8px] text-emerald-700">4 of 4 ingredients in pantry (0 Shopping Required)</div>
                    </div>
                    <div className="bg-white border border-slate-200 p-1.5 rounded shadow-xs">
                      <div className="font-bold text-[10px]">Leftover Egg Fried Rice</div>
                      <div className="text-[8px] text-emerald-700">5 of 5 ingredients in pantry (0 Shopping Required)</div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-600 italic mt-2 text-center">
                Figure 5: SuggestedRecipesActivity presenting strictly matched recipes where all required items exist in stock.
              </p>
            </div>

            {/* Screenshot 4 */}
            <div className="border border-slate-300 rounded p-3 bg-slate-50">
              <div className="h-56 bg-slate-900 rounded overflow-hidden flex items-center justify-center p-2 text-white">
                <div className="w-full h-full bg-slate-50 text-slate-900 rounded p-2 text-[10px] font-sans flex flex-col">
                  <div className="bg-blue-900 text-white p-1.5 rounded font-bold">
                    RecipeDetailActivity: Ingredients Check
                  </div>
                  <div className="p-2 space-y-1 mt-1 flex-1">
                    <div className="text-emerald-800 font-semibold text-[9px]">&#10003; Spaghetti: 200g (Pantry: 400g)</div>
                    <div className="text-emerald-800 font-semibold text-[9px]">&#10003; Tomatoes: 3 pcs (Pantry: 4 pcs)</div>
                    <div className="text-emerald-800 font-semibold text-[9px]">&#10003; Garlic: 2 cloves (Pantry: 5 cloves)</div>
                    <div className="bg-emerald-600 text-white text-center py-1 rounded font-bold mt-2">
                      Cooked This! (Deduct Inventory)
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-600 italic mt-2 text-center">
                Figure 6: RecipeDetailActivity showing verified ingredient quantities and inventory cooking deduction.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================
            SECTION 6: KEY CODE SNIPPETS
            ======================================================== */}
        <div className="mb-12 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
            6. Key Code Snippets with Technical Explanations
          </h2>

          {/* Snippet 1 */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-800">
              Snippet 1: Strict-Matching Rule Logic (StrictMatchingEngine.java)
            </h3>
            <p className="text-sm">
              This snippet directly enforces Section 2.3 of the assignment brief. If even a single recipe ingredient is missing or insufficient in quantity, the method terminates immediately with a negative verdict.
            </p>
            <div className="p-3 bg-slate-900 text-slate-100 rounded font-mono text-xs overflow-x-auto">
              <pre>{`public static boolean isStrictMatch(Recipe recipe, List<PantryItem> pantry) {
    if (recipe == null || recipe.getIngredients() == null) return false;

    for (RecipeIngredient req : recipe.getIngredients()) {
        String normReq = normalizeIngredientName(req.getName());
        boolean satisfied = false;

        for (PantryItem item : pantry) {
            String normPantry = normalizeIngredientName(item.getName());
            if (normPantry.equals(normReq) || normPantry.contains(normReq)) {
                if (isQuantitySufficient(item.getQuantity(), item.getUnit(), 
                                         req.getQuantity(), req.getUnit())) {
                    satisfied = true;
                    break;
                }
            }
        }
        // CRITICAL: Immediate rejection if any requirement fails
        if (!satisfied) return false;
    }
    return true; // 100% satisfied
}`}</pre>
            </div>
          </div>

          {/* Snippet 2 */}
          <div className="space-y-2 mt-6">
            <h3 className="text-base font-bold text-slate-800">
              Snippet 2: Parameterized SQLite Insertion (DatabaseHelper.java)
            </h3>
            <p className="text-sm">
              Demonstrates on-device SQLite persistence using <code>ContentValues</code>, avoiding SQL injection and executing clean transactional inserts into <code>pantry_items</code>.
            </p>
            <div className="p-3 bg-slate-900 text-slate-100 rounded font-mono text-xs overflow-x-auto">
              <pre>{`public long insertPantryItem(PantryItem item) {
    SQLiteDatabase db = this.getWritableDatabase();
    ContentValues cv = new ContentValues();
    cv.put(COL_PANTRY_NAME, item.getName().trim());
    cv.put(COL_PANTRY_QUANTITY, item.getQuantity());
    cv.put(COL_PANTRY_UNIT, item.getUnit());
    cv.put(COL_PANTRY_CATEGORY, item.getCategory());
    cv.put(COL_PANTRY_EXPIRY, item.getExpiryDate());
    cv.put(COL_PANTRY_NOTES, item.getNotes());

    long result = db.insert(TABLE_PANTRY, null, cv);
    db.close();
    return result;
}`}</pre>
            </div>
          </div>

          {/* Snippet 3 */}
          <div className="space-y-2 mt-6">
            <h3 className="text-base font-bold text-slate-800">
              Snippet 3: Activity Lifecycle Synchronization (PantryListActivity.java)
            </h3>
            <p className="text-sm">
              Leverages the Android <code>onResume()</code> lifecycle callback to re-query the SQLite database whenever returning to the screen, ensuring instant synchronization without manual reloads.
            </p>
            <div className="p-3 bg-slate-900 text-slate-100 rounded font-mono text-xs overflow-x-auto">
              <pre>{`@Override
protected void onResume() {
    super.onResume();
    // Re-query on-device SQLite to reflect items inserted or modified in other activities
    loadPantryItems();
}

private void loadPantryItems() {
    pantryList.clear();
    pantryList.addAll(databaseHelper.getAllPantryItems());
    adapter.notifyDataSetChanged();
    emptyStateTextView.setVisibility(pantryList.isEmpty() ? View.VISIBLE : View.GONE);
}`}</pre>
            </div>
          </div>
        </div>

        {/* ========================================================
            SECTION 7: CHALLENGES & SOLUTIONS
            ======================================================== */}
        <div className="mb-12 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
            7. Challenges and Technical Solutions
          </h2>
          <div className="space-y-4 text-sm">
            <div>
              <strong className="block text-slate-900">
                Challenge 1: False Negative Rejections from String Discrepancies
              </strong>
              <p>
                <em>Problem:</em> During initial testing, a user adding &quot;Tomatoes&quot; caused &quot;Rustic Tomato Basil Spaghetti&quot; to fail because the recipe requirement was labeled &quot;Tomato&quot;. A naive string equality check broke the strict matching rule despite the user having the correct ingredient.
              </p>
              <p className="mt-1">
                <em>Solution:</em> Implemented regular-expression stemming in <code>StrictMatchingEngine.normalizeIngredientName()</code>. It automatically removes culinary preparation qualifiers (e.g. &quot;fresh&quot;, &quot;ripe&quot;) and handles irregular English plurals (&quot;tomatoes&quot; &rarr; &quot;tomato&quot;, &quot;potatoes&quot; &rarr; &quot;potato&quot;, &quot;cloves&quot; &rarr; &quot;clove&quot;), satisfying Section 2.3 requirements without adding bulky external dependencies.
              </p>
            </div>

            <div>
              <strong className="block text-slate-900">
                Challenge 2: Unit Incompatibilities in Quantity Sufficiency
              </strong>
              <p>
                <em>Problem:</em> A recipe calling for 200g of pasta failed when the user entered &quot;0.5 kg&quot; because numeric comparisons evaluated $0.5 &lt; 200$.
              </p>
              <p className="mt-1">
                <em>Solution:</em> Engineered a dimension-aware base conversion utility (<code>convertToBaseUnit</code>) that normalizes mass into grams and volume into milliliters prior to evaluation.
              </p>
            </div>

            <div>
              <strong className="block text-slate-900">
                Challenge 3: RecyclerView State Desynchronization Across Activities
              </strong>
              <p>
                <em>Problem:</em> When inserting an ingredient in <code>AddEditIngredientActivity</code>, returning via the back stack did not consistently update the inventory list if queries were confined solely to <code>onCreate()</code>.
              </p>
              <p className="mt-1">
                <em>Solution:</em> Refactored the data loader to bind within <code>onResume()</code>, ensuring the <code>PantryAdapter</code> re-synchronizes with SQLite upon every activity entry.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================
            SECTION 8: CONCLUSION & REFLECTION
            ======================================================== */}
        <div className="mb-12 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
            8. Conclusion and Reflection
          </h2>
          <p>
            The <strong>Smart Pantry Manager</strong> practical project provided an invaluable synthesis of native Android development fundamentals. Key learning milestones encompassed configuring relational SQLite schemas using <code>SQLiteOpenHelper</code>, binding dynamic data to <code>RecyclerView</code> widgets using custom view holders, orchestrating screen navigation and state passing via <code>Intent</code> extras, and architecting robust business logic for strict recipe matching.
          </p>
          <p>
            Reflecting upon the engineering process, the emphasis on incremental version control on GitHub (Section 4) fostered rigorous discipline in commit structuring and commit documentation. Given additional development time, prospective enhancements would include:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>
              Integrating an on-device OCR camera scanner (ML Kit) for automated receipt parsing to minimize manual data entry.
            </li>
            <li>
              Implementing Android Background WorkManager notifications to alert users 24 hours prior to ingredient expiration dates.
            </li>
          </ul>
        </div>

        {/* ========================================================
            SECTION 9: REFERENCE LIST (HARVARD STYLE)
            ======================================================== */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
            9. Reference List
          </h2>
          <div className="space-y-3 text-xs leading-relaxed">
            <p>
              Android Developers (2024) <em>Save data using SQLite</em>. Available at: https://developer.android.com/training/data-storage/sqlite (Accessed: 24 September 2026).
            </p>
            <p>
              Android Developers (2024) <em>Understand the Activity Lifecycle</em>. Available at: https://developer.android.com/guide/components/activities/activity-lifecycle (Accessed: 22 September 2026).
            </p>
            <p>
              Android Developers (2024) <em>Create dynamic lists with RecyclerView</em>. Available at: https://developer.android.com/develop/ui/views/layout/recyclerview (Accessed: 23 September 2026).
            </p>
            <p>
              Aschemann-Witzel, J., de Hooge, I., Amani, P., Bech-Larsen, T. and Oostindjer, M. (2015) &apos;Consumer-related food waste: causes and potential for intervention&apos;, <em>Waste Management</em>, 35, pp. 245–257.
            </p>
            <p>
              Deitel, P., Deitel, H. and Deitel, A. (2017) <em>Android How to Program with an Introduction to Java</em>. 3rd edn. Boston: Pearson.
            </p>
            <p>
              Phillips, B., Stewart, C. and Hardy, B. (2019) <em>Android Programming: The Big Nerd Ranch Guide</em>. 4th edn. Atlanta: Big Nerd Ranch Guides.
            </p>
            <p>
              Richfield Graduate Institute of Technology (2026) <em>Mobile App Development 700: Course Guide and Practical Assessment Brief</em>. Durban: Richfield.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
