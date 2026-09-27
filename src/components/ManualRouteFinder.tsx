import React, { useState } from 'react';
import { CAMPUS_NODES } from '../data/campusData';
import { findShortestPathBFS, BFSResult } from '../utils/bfsPathfinder';
import { Navigation, ArrowUpDown, Clock, Footprints, ChevronRight, Eye } from 'lucide-react';

interface ManualRouteFinderProps {
  onRouteCalculated: (result: BFSResult) => void;
  onOpenBFSTrace: (result: BFSResult) => void;
  initialStartNode?: string;
  initialTargetNode?: string;
}

export const ManualRouteFinder: React.FC<ManualRouteFinderProps> = ({
  onRouteCalculated,
  onOpenBFSTrace,
  initialStartNode = 'Main Gate',
  initialTargetNode = 'AIML Lab',
}) => {
  const [startNode, setStartNode] = useState<string>(initialStartNode);
  const [targetNode, setTargetNode] = useState<string>(initialTargetNode);
  const [currentResult, setCurrentResult] = useState<BFSResult | null>(() =>
    findShortestPathBFS(initialStartNode, initialTargetNode)
  );

  const nodeOptions = Object.values(CAMPUS_NODES);

  const handleCalculate = (start: string, target: string) => {
    const res = findShortestPathBFS(start, target);
    setCurrentResult(res);
    onRouteCalculated(res);
  };

  const handleSwap = () => {
    const newStart = targetNode;
    const newTarget = startNode;
    setStartNode(newStart);
    setTargetNode(newTarget);
    handleCalculate(newStart, newTarget);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg text-xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-emerald-400" />
          <h3 className="font-semibold text-white text-sm">Direct Campus Route Finder</h3>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">BFS Unweighted Engine</span>
      </div>

      {/* Selectors */}
      <div className="space-y-2.5">
        <div>
          <label className="text-slate-400 block mb-1 font-medium">Starting Point</label>
          <select
            value={startNode}
            onChange={(e) => {
              setStartNode(e.target.value);
              handleCalculate(e.target.value, targetNode);
            }}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
          >
            {nodeOptions.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name} ({n.building})
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center -my-1">
          <button
            onClick={handleSwap}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            title="Swap Origin and Destination"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        <div>
          <label className="text-slate-400 block mb-1 font-medium">Destination</label>
          <select
            value={targetNode}
            onChange={(e) => {
              setTargetNode(e.target.value);
              handleCalculate(startNode, e.target.value);
            }}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
          >
            {nodeOptions.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name} ({n.building})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result Card */}
      {currentResult && currentResult.found && (
        <div className="pt-2 space-y-3">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-2">
              <Footprints className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Distance</span>
                <span className="font-bold text-white font-mono">{currentResult.totalDistanceMeters} meters</span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Walking Time</span>
                <span className="font-bold text-white font-mono">{currentResult.estimatedWalkingMinutes} min</span>
              </div>
            </div>
          </div>

          {/* Step-by-step route */}
          <div className="space-y-1.5">
            <span className="text-slate-400 font-medium block">Turn-by-turn Navigation:</span>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {currentResult.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-slate-950/70 border border-slate-800/80 rounded-lg flex items-start gap-2 text-[11px] text-slate-300"
                >
                  <span className="w-4 h-4 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <p className="leading-tight text-white">{step.instruction}</p>
                    <span className="text-[10px] text-slate-500 font-mono">{step.distance} meters</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inspect BFS Trace Button */}
          <button
            onClick={() => onOpenBFSTrace(currentResult)}
            className="w-full py-2 px-3 bg-indigo-950 hover:bg-indigo-900 border border-indigo-800 text-indigo-300 rounded-xl font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Inspect BFS Graph Trace</span>
          </button>
        </div>
      )}
    </div>
  );
};
