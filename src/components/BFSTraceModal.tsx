import React, { useState } from 'react';
import { BFSTraceStep } from '../utils/bfsPathfinder';
import { Play, SkipForward, RotateCcw, X, GitCommit, CheckCircle2 } from 'lucide-react';

interface BFSTraceModalProps {
  isOpen: boolean;
  onClose: () => void;
  startNode: string;
  targetNode: string;
  trace: BFSTraceStep[];
  finalPath: string[];
}

export const BFSTraceModal: React.FC<BFSTraceModalProps> = ({
  isOpen,
  onClose,
  startNode,
  targetNode,
  trace,
  finalPath,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = trace[currentStepIndex] || trace[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <GitCommit className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-semibold text-white text-base">BFS Algorithm Execution Inspector</h3>
              <p className="text-xs text-slate-400">
                Traversing from <span className="text-emerald-400 font-medium">{startNode}</span> to{' '}
                <span className="text-indigo-400 font-medium">{targetNode}</span>
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Theory Banner */}
          <div className="p-4 bg-indigo-950/40 border border-indigo-800/60 rounded-xl text-indigo-200">
            <div className="font-semibold text-indigo-300 mb-1">Why BFS for College Campus Navigation?</div>
            <p className="text-xs text-indigo-200/80 leading-relaxed">
              BFS (Breadth-First Search) systematically explores the graph level-by-level using a First-In-First-Out (FIFO) queue.
              In an unweighted or corridor-hop graph, BFS is mathematically guaranteed to find the path with the fewest corridor
              transitions before exploring longer routes. Time Complexity: <code className="bg-indigo-900/60 px-1 py-0.5 rounded text-indigo-100 font-mono">O(V + E)</code>.
            </p>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Current Iteration</span>
              <div className="text-lg font-bold text-white">
                Step {currentStep?.stepNumber || 1} of {trace.length}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStepIndex(0)}
                className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
              <button
                onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentStepIndex === 0}
                className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentStepIndex((prev) => Math.min(trace.length - 1, prev + 1))}
                disabled={currentStepIndex >= trace.length - 1}
                className="px-4 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-medium rounded-lg flex items-center gap-1 transition-colors"
              >
                Next Step <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Current State Grid */}
          {currentStep && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dequeued Current Node */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Dequeued Node</span>
                <div className="mt-2 text-base font-bold text-emerald-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {currentStep.currentNode}
                </div>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">{currentStep.actionDescription}</p>
              </div>

              {/* FIFO Queue Snapshot */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">FIFO Queue State</span>
                <div className="mt-2 flex flex-wrap gap-1.5 min-h-[32px]">
                  {currentStep.queueSnapshot.length > 0 ? (
                    currentStep.queueSnapshot.map((item, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-xs font-mono"
                      >
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">Queue is empty</span>
                  )}
                </div>
              </div>

              {/* Visited Set */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl md:col-span-2">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Visited Set ({currentStep.visitedNodes.length} nodes explored)
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {currentStep.visitedNodes.map((vNode, idx) => {
                    const isInFinal = finalPath.includes(vNode);
                    return (
                      <span
                        key={idx}
                        className={`px-2 py-0.5 rounded text-xs font-mono ${
                          isInFinal
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 font-semibold'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {vNode}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Final Shortest Path Backtracking */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Final Reconstructed Shortest Route (Backtracking Parent Pointers)
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-white">
              {finalPath.map((node, i) => (
                <React.Fragment key={i}>
                  <span className="px-2.5 py-1 bg-indigo-900/60 border border-indigo-700/80 rounded-lg">
                    {node}
                  </span>
                  {i < finalPath.length - 1 && <span className="text-slate-500 font-bold">→</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
