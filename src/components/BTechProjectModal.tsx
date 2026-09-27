import React, { useState } from 'react';
import {
  BTECH_PYTHON_FILES,
  PROJECT_STRUCTURE_TREE,
  ProjectFile,
} from '../data/btechDocumentation';
import { Code, BookOpen, Terminal, Check, Copy, X, FolderTree, Cpu, HelpCircle } from 'lucide-react';

interface BTechProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BTechProjectModal: React.FC<BTechProjectModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'code' | 'structure' | 'theory' | 'run' | 'queries'>('code');
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentFile: ProjectFile = BTECH_PYTHON_FILES[selectedFileIndex] || BTECH_PYTHON_FILES[0];

  const handleCopy = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(identifier);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-950 border border-indigo-800 text-indigo-400">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                B.Tech Project Hub & Source Documentation
              </h2>
              <p className="text-xs text-slate-400">
                Complete source code, BFS algorithm analysis, NLP classifier theory & run instructions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'code'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" /> Python Source Code
          </button>

          <button
            onClick={() => setActiveTab('structure')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'structure'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" /> Project Structure
          </button>

          <button
            onClick={() => setActiveTab('theory')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'theory'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> BFS & NLP Algorithm Theory
          </button>

          <button
            onClick={() => setActiveTab('run')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'run'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" /> Run Instructions
          </button>

          <button
            onClick={() => setActiveTab('queries')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'queries'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" /> Sample Queries
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-hidden flex flex-col p-6 bg-slate-900/50">
          {/* TAB 1: CODE FILES */}
          {activeTab === 'code' && (
            <div className="flex flex-col md:flex-row gap-4 h-full overflow-hidden">
              {/* File list sidebar */}
              <div className="w-full md:w-56 shrink-0 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0">
                {BTECH_PYTHON_FILES.map((file, idx) => (
                  <button
                    key={file.filename}
                    onClick={() => setSelectedFileIndex(idx)}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-colors w-full ${
                      selectedFileIndex === idx
                        ? 'bg-indigo-600 text-white font-medium shadow-sm'
                        : 'bg-slate-950/70 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="font-mono truncate">{file.filename}</span>
                    <span className="text-[10px] opacity-75 uppercase">{file.language}</span>
                  </button>
                ))}
              </div>

              {/* Code viewer */}
              <div className="flex-1 flex flex-col bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
                  <div>
                    <span className="font-mono text-xs font-semibold text-white">{currentFile.filename}</span>
                    <p className="text-[11px] text-slate-400">{currentFile.description}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(currentFile.code, currentFile.filename)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    {copiedFile === currentFile.filename ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-200 leading-relaxed bg-slate-950/90 select-text">
                  <code>{currentFile.code}</code>
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECT STRUCTURE */}
          {activeTab === 'structure' && (
            <div className="space-y-4 overflow-y-auto max-h-full pr-2 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Recommended Project Directory Tree</h3>
                  <p className="text-slate-400">Organized for modularity, clean submission, and easy grading.</p>
                </div>
                <button
                  onClick={() => handleCopy(PROJECT_STRUCTURE_TREE, 'tree')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
                >
                  {copiedFile === 'tree' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Tree</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-indigo-300 leading-relaxed overflow-x-auto">
                <pre>{PROJECT_STRUCTURE_TREE}</pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <span className="font-semibold text-white">Backend Layer (Python)</span>
                  <p className="text-slate-400 leading-relaxed">
                    <code>campus_data.py</code>, <code>bfs_pathfinder.py</code>, and <code>campus_nlp.py</code> work
                    completely offline with standard Python 3.8+ libraries (no complex pip install required for basic CLI!).
                  </p>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <span className="font-semibold text-white">Frontend & API Layer</span>
                  <p className="text-slate-400 leading-relaxed">
                    Flask provides a lightweight REST API (<code>/api/chat</code>) that connects the browser UI or
                    CLI directly with the pathfinding and NLP engine.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BFS & NLP THEORY */}
          {activeTab === 'theory' && (
            <div className="space-y-6 overflow-y-auto max-h-full pr-2 text-xs leading-relaxed">
              {/* Part 1: BFS Pathfinding */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-indigo-400">
                  <Cpu className="w-4 h-4" />
                  1. How Breadth-First Search (BFS) is Used for Campus Navigation
                </div>
                <p className="text-slate-300">
                  The college campus is modeled as an undirected or directed graph <code className="text-emerald-400">G = (V, E)</code>:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-300 pl-2">
                  <li><strong>Vertices (V):</strong> Important campus hubs (Main Gate, Block A, CSE Lab 1, Library, Canteen, Hostels).</li>
                  <li><strong>Edges (E):</strong> Corridors, skywalks, and paved footpaths connecting nodes, with distance in meters.</li>
                </ul>

                <div className="p-3 bg-slate-900 border border-slate-700 rounded-lg space-y-1.5">
                  <span className="font-semibold text-white">Why BFS over DFS (Depth-First Search)?</span>
                  <p className="text-slate-300">
                    In navigation systems where each building or corridor step represents a transition, BFS explores all immediate
                    neighbors at depth 1 before moving to depth 2. This mathematical property guarantees that the first time the
                    destination node is reached, it is via the path with the <strong>minimum number of corridor hops</strong>.
                    DFS, conversely, would dive deeply down one hallway branch and produce unnecessarily long, convoluted routes.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="font-semibold text-emerald-400 block mb-0.5">Time Complexity: O(V + E)</span>
                    Each vertex is enqueued at most once, and each edge is inspected at most twice.
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="font-semibold text-indigo-400 block mb-0.5">Space Complexity: O(V)</span>
                    Stores visited set, queue, and parent map of size bounded by vertices count.
                  </div>
                </div>
              </div>

              {/* Part 2: AI Intent Classification */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-indigo-400">
                  <BookOpen className="w-4 h-4" />
                  2. How AI Intent Classification Works
                </div>
                <p className="text-slate-300">
                  The chatbot utilizes a lightweight, explainable Keyword and Regular-Expression Natural Language Processing pipeline:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
                    <span className="font-semibold text-white">Step 1: Text Preprocessing & Cleaning</span>
                    <p className="text-slate-400">
                      Normalizes case, removes punctuation, and filters stopwords (&quot;please&quot;, &quot;can you&quot;, &quot;the&quot;).
                    </p>
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
                    <span className="font-semibold text-white">Step 2: Room Number Entity Extraction</span>
                    <p className="text-slate-400">
                      Uses Regex (<code>\b(?:room\s*)?([0-9]{3})\b</code>) to immediately recognize queries like &quot;Where is Room 205?&quot;.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
                    <span className="font-semibold text-white">Step 3: Keyword Intent Scoring</span>
                    <p className="text-slate-400">
                      Scores queries against intent dictionaries: <code>DIRECTIONS</code>, <code>LOCATION</code>, <code>TIMING</code>, <code>GENERAL</code>.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
                    <span className="font-semibold text-white">Step 4: Destination Disambiguation</span>
                    <p className="text-slate-400">
                      Resolves campus aliases (&quot;cse lab&quot; → &quot;CSE Lab 1&quot;, &quot;food court&quot; → &quot;Canteen&quot;).
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-300">
                  <strong>Unknown Handling:</strong> If no keyword score exceeds threshold or if the extracted room does not exist in the database,
                  the system gracefully responds: <em>&quot;Sorry, I couldn&apos;t find that location in the campus database.&quot;</em>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RUN INSTRUCTIONS */}
          {activeTab === 'run' && (
            <div className="space-y-4 overflow-y-auto max-h-full pr-2 text-xs">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <h3 className="text-sm font-bold text-white">Step-by-Step Instructions to Run Locally</h3>

                <div className="space-y-2">
                  <div className="font-semibold text-indigo-400">Option A: Pure CLI Terminal Mode (Zero External Libraries)</div>
                  <p className="text-slate-300">
                    Works directly on any computer with Python 3.8+ installed:
                  </p>
                  <pre className="p-3 bg-slate-900 rounded-lg text-emerald-400 font-mono">
                    python app.py
                  </pre>
                  <p className="text-slate-400 text-[11px]">
                    You can then type your questions interactively in your terminal!
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="font-semibold text-indigo-400">Option B: Flask REST API Server Mode</div>
                  <p className="text-slate-300">
                    Install Flask and Flask-CORS:
                  </p>
                  <pre className="p-3 bg-slate-900 rounded-lg text-emerald-400 font-mono">
                    pip install -r requirements.txt{'\n'}python app.py --server
                  </pre>
                  <p className="text-slate-400 text-[11px]">
                    API endpoint will be available at <code>POST http://localhost:5000/api/chat</code> with JSON payload <code>{`{"query": "Where is Room 205?"}`}</code>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SAMPLE QUERIES */}
          {activeTab === 'queries' && (
            <div className="space-y-3 overflow-y-auto max-h-full pr-2 text-xs">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <h3 className="text-sm font-bold text-white">Sample Verification Queries & Expected Responses</h3>
                <p className="text-slate-400">
                  Test these queries to verify all required conversational capabilities:
                </p>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                    <span className="text-emerald-400 font-mono font-semibold block mb-1">Query: &quot;Where is CSE Lab?&quot;</span>
                    <p className="text-slate-300">
                      <strong>Intent:</strong> LOCATION<br />
                      <strong>Result:</strong> Identifies Block A, 1st Floor, Room 101, and outputs step-by-step route from Main Gate.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                    <span className="text-emerald-400 font-mono font-semibold block mb-1">Query: &quot;How can I reach the library?&quot;</span>
                    <p className="text-slate-300">
                      <strong>Intent:</strong> DIRECTIONS<br />
                      <strong>Result:</strong> Main Gate → Central Lawn → Block A → Library (Total: 215m, ~3.1 mins).
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                    <span className="text-emerald-400 font-mono font-semibold block mb-1">Query: &quot;Where is Room 205?&quot;</span>
                    <p className="text-slate-300">
                      <strong>Intent:</strong> LOCATION (Room Search)<br />
                      <strong>Result:</strong> Identifies Block B, 2nd Floor, AIML Lab, and gives directions.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                    <span className="text-emerald-400 font-mono font-semibold block mb-1">Query: &quot;How do I go from main gate to the CSE block?&quot;</span>
                    <p className="text-slate-300">
                      <strong>Intent:</strong> DIRECTIONS<br />
                      <strong>Result:</strong> Main Gate → Central Lawn → Block A → CSE Department.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                    <span className="text-emerald-400 font-mono font-semibold block mb-1">Query: &quot;What is near the seminar hall?&quot;</span>
                    <p className="text-slate-300">
                      <strong>Intent:</strong> GENERAL<br />
                      <strong>Result:</strong> Lists adjacent nodes (CSE Department, Block A).
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                    <span className="text-emerald-400 font-mono font-semibold block mb-1">Query: &quot;Where is Mars Rover Lab?&quot;</span>
                    <p className="text-slate-300">
                      <strong>Intent:</strong> UNKNOWN<br />
                      <strong>Result:</strong> &quot;Sorry, I couldn&apos;t find that location in the campus database.&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Project documentation ready for college lab evaluation & viva presentation</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
