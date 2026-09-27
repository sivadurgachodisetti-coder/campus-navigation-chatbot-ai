import React, { useState } from 'react';
import { CampusMap } from './components/CampusMap';
import { ChatInterface } from './components/ChatInterface';
import { ManualRouteFinder } from './components/ManualRouteFinder';
import { BFSTraceModal } from './components/BFSTraceModal';
import { RoomDirectoryModal } from './components/RoomDirectoryModal';
import { BTechProjectModal } from './components/BTechProjectModal';
import { findShortestPathBFS, BFSResult } from './utils/bfsPathfinder';
import { RoomDetail, CAMPUS_NODES } from './data/campusData';
import {
  Compass,
  Map,
  MessageSquare,
  BookOpen,
  Layers,
  Sparkles,
  Route,
  Info,
  ExternalLink,
} from 'lucide-react';

export default function App() {
  // State for active route on map
  const [highlightedPath, setHighlightedPath] = useState<string[]>(['Main Gate', 'Central Lawn', 'Block A', 'CSE Department', 'CSE Lab 1']);
  const [activeNode, setActiveNode] = useState<string | null>(null);

  // Active BFS Result for trace inspection
  const [activeBFSResult, setActiveBFSResult] = useState<BFSResult>(() =>
    findShortestPathBFS('Main Gate', 'CSE Lab 1')
  );

  // Modals state
  const [isBFSTraceOpen, setIsBFSTraceOpen] = useState(false);
  const [isRoomDirectoryOpen, setIsRoomDirectoryOpen] = useState(false);
  const [isBTechDocsOpen, setIsBTechDocsOpen] = useState(false);

  // Layout view mode for responsiveness: 'split' | 'chat' | 'map' | 'planner'
  const [activeTab, setActiveTab] = useState<'split' | 'chat' | 'map' | 'planner'>('split');

  // When a route is calculated from Chat or Planner
  const handleRouteSelected = (result: BFSResult) => {
    setActiveBFSResult(result);
    setHighlightedPath(result.path);
    if (result.path.length > 0) {
      setActiveNode(result.path[result.path.length - 1]);
    }
  };

  // When a room is selected from the Room Directory
  const handleNavigateToRoom = (room: RoomDetail) => {
    const result = findShortestPathBFS('Main Gate', room.nearestNodeId);
    handleRouteSelected(result);
    setIsRoomDirectoryOpen(false);
  };

  const handleOpenBFSTrace = (result?: BFSResult) => {
    if (result) {
      setActiveBFSResult(result);
    }
    setIsBFSTraceOpen(true);
  };

  const handleMapSetStart = (startId: string) => {
    const dest = activeBFSResult.targetNode || 'Library';
    const result = findShortestPathBFS(startId, dest);
    handleRouteSelected(result);
  };

  const handleMapSetDestination = (destId: string) => {
    const start = activeBFSResult.startNode || 'Main Gate';
    const result = findShortestPathBFS(start, destId);
    handleRouteSelected(result);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Bar Contract (3 Zones: Brand Title, 4-6 Nav Links/Segments, 1-2 Primary Actions) */}
      <header className="h-16 px-4 sm:px-6 bg-slate-950/95 border-b border-slate-800/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30 shrink-0">
        {/* Zone 1: Single Text Element Wordmark */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Compass className="w-4 h-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
            Campus Navigation Chatbot
          </span>
        </div>

        {/* Zone 2: Navigation Links / Segmented View Selectors */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveTab('split')}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'split'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Split View</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'chat'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chatbot</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'map'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Campus Map</span>
          </button>

          <button
            onClick={() => setActiveTab('planner')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'planner'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Route className="w-3.5 h-3.5" />
            <span>Route Finder</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRoomDirectoryOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-xs font-medium text-slate-200 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Rooms</span>
          </button>

          <button
            onClick={() => setIsBTechDocsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-medium text-white transition-colors shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Project Hub</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-3 sm:p-5 max-w-[1600px] w-full mx-auto flex flex-col min-h-0 overflow-hidden">
        {/* Dynamic Layout based on activeTab */}

        {/* 1. SPLIT VIEW (DEFAULT FOR DESKTOP) */}
        {activeTab === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
            {/* Left Column: Chat Assistant */}
            <div className="lg:col-span-5 flex flex-col min-h-[500px] lg:min-h-0 h-full">
              <ChatInterface
                onRouteSelected={handleRouteSelected}
                onOpenBFSTrace={handleOpenBFSTrace}
                onOpenRoomDirectory={() => setIsRoomDirectoryOpen(true)}
                onOpenBTechDocs={() => setIsBTechDocsOpen(true)}
              />
            </div>

            {/* Right Column: Campus Map & Route Inspector */}
            <div className="lg:col-span-7 flex flex-col gap-3 min-h-[500px] lg:min-h-0 h-full">
              {/* Active Route Quick Summary Strip */}
              {activeBFSResult && activeBFSResult.found && (
                <div className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs shrink-0">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-slate-400">Active Route:</span>
                    <span className="font-semibold text-white truncate">
                      {activeBFSResult.startNode} → {activeBFSResult.targetNode}
                    </span>
                    <span className="text-slate-500">·</span>
                    <span className="font-mono text-indigo-300 font-medium">
                      {activeBFSResult.totalDistanceMeters}m ({activeBFSResult.estimatedWalkingMinutes} min)
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenBFSTrace(activeBFSResult)}
                    className="shrink-0 ml-2 px-2.5 py-1 bg-indigo-950 hover:bg-indigo-900 border border-indigo-800 text-indigo-300 rounded-lg text-[11px] font-medium transition-colors"
                  >
                    View BFS Trace
                  </button>
                </div>
              )}

              {/* Interactive SVG Campus Map */}
              <div className="flex-1 min-h-0">
                <CampusMap
                  highlightedPath={highlightedPath}
                  activeNode={activeNode}
                  onSelectNode={(nodeId) => setActiveNode(nodeId)}
                  onSetStart={handleMapSetStart}
                  onSetDestination={handleMapSetDestination}
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. CHATBOT FOCUSED VIEW */}
        {activeTab === 'chat' && (
          <div className="max-w-3xl w-full mx-auto flex-1 min-h-0">
            <ChatInterface
              onRouteSelected={handleRouteSelected}
              onOpenBFSTrace={handleOpenBFSTrace}
              onOpenRoomDirectory={() => setIsRoomDirectoryOpen(true)}
              onOpenBTechDocs={() => setIsBTechDocsOpen(true)}
            />
          </div>
        )}

        {/* 3. CAMPUS MAP FOCUSED VIEW */}
        {activeTab === 'map' && (
          <div className="flex-1 flex flex-col gap-3 min-h-0">
            {activeBFSResult && activeBFSResult.found && (
              <div className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-slate-400">Current Route:</span>
                  <span className="font-semibold text-white">
                    {activeBFSResult.startNode} → {activeBFSResult.targetNode}
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="font-mono text-indigo-300">
                    {activeBFSResult.totalDistanceMeters} meters · ~{activeBFSResult.estimatedWalkingMinutes} min walk
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsRoomDirectoryOpen(true)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] transition-colors"
                  >
                    Find Room
                  </button>
                  <button
                    onClick={() => handleOpenBFSTrace(activeBFSResult)}
                    className="px-2.5 py-1 bg-indigo-950 hover:bg-indigo-900 border border-indigo-800 text-indigo-300 rounded-lg text-[11px] font-medium transition-colors"
                  >
                    BFS Trace
                  </button>
                </div>
              </div>
            )}

            <div className="flex-1 min-h-0">
              <CampusMap
                highlightedPath={highlightedPath}
                activeNode={activeNode}
                onSelectNode={(nodeId) => setActiveNode(nodeId)}
                onSetStart={handleMapSetStart}
                onSetDestination={handleMapSetDestination}
              />
            </div>
          </div>
        )}

        {/* 4. ROUTE PLANNER VIEW */}
        {activeTab === 'planner' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
            <div className="lg:col-span-4 overflow-y-auto">
              <ManualRouteFinder
                onRouteCalculated={handleRouteSelected}
                onOpenBFSTrace={handleOpenBFSTrace}
                initialStartNode={activeBFSResult.startNode || 'Main Gate'}
                initialTargetNode={activeBFSResult.targetNode || 'AIML Lab'}
              />
            </div>

            <div className="lg:col-span-8 flex-1 min-h-0">
              <CampusMap
                highlightedPath={highlightedPath}
                activeNode={activeNode}
                onSelectNode={(nodeId) => setActiveNode(nodeId)}
                onSetStart={handleMapSetStart}
                onSetDestination={handleMapSetDestination}
              />
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <BFSTraceModal
        isOpen={isBFSTraceOpen}
        onClose={() => setIsBFSTraceOpen(false)}
        startNode={activeBFSResult.startNode}
        targetNode={activeBFSResult.targetNode}
        trace={activeBFSResult.bfsTrace}
        finalPath={activeBFSResult.path}
      />

      <RoomDirectoryModal
        isOpen={isRoomDirectoryOpen}
        onClose={() => setIsRoomDirectoryOpen(false)}
        onNavigateToRoom={handleNavigateToRoom}
      />

      <BTechProjectModal
        isOpen={isBTechDocsOpen}
        onClose={() => setIsBTechDocsOpen(false)}
      />
    </div>
  );
}
