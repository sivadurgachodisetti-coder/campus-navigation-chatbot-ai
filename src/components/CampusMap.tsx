import React, { useState } from 'react';
import { CAMPUS_NODES, CAMPUS_EDGES, CampusNode } from '../data/campusData';
import { MapPin, Navigation, Info, Eye, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface CampusMapProps {
  highlightedPath: string[];
  activeNode: string | null;
  onSelectNode: (nodeId: string) => void;
  onSetStart: (nodeId: string) => void;
  onSetDestination: (nodeId: string) => void;
}

export const CampusMap: React.FC<CampusMapProps> = ({
  highlightedPath,
  activeNode,
  onSelectNode,
  onSetStart,
  onSetDestination,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const selectedNode: CampusNode | null = selectedNodeId ? CAMPUS_NODES[selectedNodeId] || null : null;

  // Check if an edge is part of the highlighted route
  const isEdgeInRoute = (from: string, to: string) => {
    if (!highlightedPath || highlightedPath.length < 2) return false;
    for (let i = 0; i < highlightedPath.length - 1; i++) {
      if (
        (highlightedPath[i] === from && highlightedPath[i + 1] === to) ||
        (highlightedPath[i] === to && highlightedPath[i + 1] === from)
      ) {
        return true;
      }
    }
    return false;
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    onSelectNode(nodeId);
  };

  const getNodeColor = (type: CampusNode['type'], isSelected: boolean, isRouteNode: boolean) => {
    if (isRouteNode) return { fill: '#4F46E5', stroke: '#818CF8', ring: '#C7D2FE' }; // Indigo
    if (isSelected) return { fill: '#0EA5E9', stroke: '#38BDF8', ring: '#BAE6FD' }; // Cyan

    switch (type) {
      case 'gate':
        return { fill: '#059669', stroke: '#34D399', ring: '#A7F3D0' }; // Emerald
      case 'department':
        return { fill: '#7C3AED', stroke: '#A78BFA', ring: '#DDD6FE' }; // Violet
      case 'lab':
        return { fill: '#D97706', stroke: '#FBBF24', ring: '#FDE68A' }; // Amber
      case 'classroom':
        return { fill: '#2563EB', stroke: '#60A5FA', ring: '#BFDBFE' }; // Blue
      case 'library':
        return { fill: '#0891B2', stroke: '#22D3EE', ring: '#CFFAFE' }; // Cyan
      case 'canteen':
        return { fill: '#EA580C', stroke: '#FB923C', ring: '#FFEDD5' }; // Orange
      case 'office':
        return { fill: '#475569', stroke: '#94A3B8', ring: '#E2E8F0' }; // Slate
      case 'hostel':
        return { fill: '#9333EA', stroke: '#C084FC', ring: '#F3E8FF' }; // Purple
      case 'facility':
        return { fill: '#16A34A', stroke: '#4ADE80', ring: '#DCFCE7' }; // Green
      default:
        return { fill: '#64748B', stroke: '#94A3B8', ring: '#E2E8F0' };
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl text-slate-100">
      {/* Top Map Header Controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-sm tracking-tight text-white">Interactive Campus Blueprint</span>
          <span className="hidden sm:inline text-xs text-slate-400">· Graph-based Path Visualization</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.15))}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.15))}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setZoomLevel(1);
              setSelectedNodeId(null);
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Reset Map"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div className="relative flex-1 overflow-auto bg-slate-950/70 p-2 flex items-center justify-center">
        <div
          className="transition-transform duration-300 ease-out origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            viewBox="0 0 1000 660"
            className="w-full max-w-[960px] h-auto drop-shadow-2xl select-none"
            style={{ minWidth: '700px' }}
          >
            <defs>
              {/* Subtle Grid Pattern */}
              <pattern id="campusGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              </pattern>

              {/* Glowing animated line filter */}
              <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#6366F1" floodOpacity="0.8" />
              </filter>
            </defs>

            {/* Background Grid */}
            <rect width="1000" height="660" fill="#0B132B" rx="16" />
            <rect width="1000" height="660" fill="url(#campusGrid)" rx="16" />

            {/* Campus Perimeter Boundary */}
            <rect
              x="30"
              y="30"
              width="940"
              height="600"
              rx="24"
              fill="none"
              stroke="#1E293B"
              strokeWidth="2"
              strokeDasharray="6 6"
            />

            {/* Zone Backdrops (College campus layout) */}
            {/* Academic Zone North */}
            <rect x="290" y="80" width="480" height="230" rx="16" fill="#131F3F" stroke="#1E3A8A" strokeWidth="1.5" opacity="0.4" />
            <text x="310" y="105" fill="#60A5FA" fontSize="11" fontWeight="600" letterSpacing="1">ACADEMIC & LABS WING</text>

            {/* Admin Zone West */}
            <rect x="210" y="360" width="130" height="190" rx="14" fill="#1E293B" stroke="#334155" strokeWidth="1.5" opacity="0.4" />
            <text x="220" y="380" fill="#94A3B8" fontSize="10" fontWeight="600">ADMIN BLOCK</text>

            {/* Central Quadrangle Lawn */}
            <rect x="360" y="340" width="180" height="160" rx="20" fill="#064E3B" stroke="#059669" strokeWidth="1.5" opacity="0.3" />
            <text x="400" y="420" fill="#34D399" fontSize="12" fontWeight="600" opacity="0.8">CENTRAL LAWN</text>

            {/* Cafeteria & Auditorium Zone */}
            <rect x="560" y="420" width="220" height="170" rx="16" fill="#431407" stroke="#7C2D12" strokeWidth="1" opacity="0.25" />
            <text x="580" y="445" fill="#FB923C" fontSize="10" fontWeight="600">CAFETERIA & AUDITORIUM</text>

            {/* Residential & Sports Zone East */}
            <rect x="800" y="240" width="150" height="340" rx="16" fill="#2E1065" stroke="#581C87" strokeWidth="1" opacity="0.3" />
            <text x="815" y="265" fill="#C084FC" fontSize="10" fontWeight="600">RESIDENTIAL & SPORTS</text>

            {/* All Graph Edges (Corridors & Walkways) */}
            <g id="campusEdges">
              {CAMPUS_EDGES.map((edge, index) => {
                const source = CAMPUS_NODES[edge.from];
                const target = CAMPUS_NODES[edge.to];
                if (!source || !target) return null;

                const inRoute = isEdgeInRoute(edge.from, edge.to);

                // Render each undirected edge once for base
                return (
                  <line
                    key={`edge-${index}`}
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={inRoute ? '#818CF8' : '#334155'}
                    strokeWidth={inRoute ? 4 : 2}
                    strokeDasharray={inRoute ? '6 4' : 'none'}
                    className={inRoute ? 'animate-pulse' : ''}
                    opacity={inRoute ? 1 : 0.45}
                  />
                );
              })}
            </g>

            {/* Glowing Active Route Overlay */}
            {highlightedPath.length > 1 && (
              <g id="highlightedRouteGlow">
                {highlightedPath.map((nodeId, idx) => {
                  if (idx === highlightedPath.length - 1) return null;
                  const nextNodeId = highlightedPath[idx + 1];
                  const curr = CAMPUS_NODES[nodeId];
                  const next = CAMPUS_NODES[nextNodeId];
                  if (!curr || !next) return null;

                  return (
                    <line
                      key={`glow-route-${idx}`}
                      x1={curr.x}
                      y1={curr.y}
                      x2={next.x}
                      y2={next.y}
                      stroke="#4F46E5"
                      strokeWidth="5"
                      strokeLinecap="round"
                      filter="url(#routeGlow)"
                    />
                  );
                })}
              </g>
            )}

            {/* All Graph Nodes */}
            <g id="campusNodes">
              {Object.values(CAMPUS_NODES).map((node) => {
                const isSelected = selectedNodeId === node.id || activeNode === node.id;
                const routeIndex = highlightedPath.indexOf(node.id);
                const isRouteNode = routeIndex !== -1;
                const isStartNode = routeIndex === 0;
                const isEndNode = routeIndex === highlightedPath.length - 1 && highlightedPath.length > 1;

                const colors = getNodeColor(node.type, isSelected, isRouteNode);

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer transition-transform group"
                    onClick={() => handleNodeClick(node.id)}
                  >
                    {/* Outer Glow Halo for selected or route nodes */}
                    {(isSelected || isRouteNode) && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isStartNode || isEndNode ? 22 : 18}
                        fill={isStartNode ? '#10B981' : isEndNode ? '#EC4899' : colors.fill}
                        opacity="0.3"
                        className="animate-ping"
                      />
                    )}

                    {/* Outer Border Ring */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isStartNode || isEndNode ? 16 : isSelected ? 14 : 11}
                      fill={isStartNode ? '#10B981' : isEndNode ? '#EC4899' : colors.fill}
                      stroke={isSelected ? '#FFFFFF' : colors.stroke}
                      strokeWidth={isSelected ? 3 : 2}
                      className="transition-all duration-200 group-hover:scale-125"
                    />

                    {/* Step Number in Route */}
                    {isRouteNode && (
                      <text
                        x={node.x}
                        y={node.y + 4}
                        fill="#FFFFFF"
                        fontSize="10"
                        fontWeight="700"
                        textAnchor="middle"
                      >
                        {routeIndex + 1}
                      </text>
                    )}

                    {/* Label Badge */}
                    <text
                      x={node.x}
                      y={node.y + 24}
                      fill={isSelected || isRouteNode ? '#FFFFFF' : '#CBD5E1'}
                      fontSize={isSelected ? '12' : '10'}
                      fontWeight={isSelected || isRouteNode ? '700' : '500'}
                      textAnchor="middle"
                      className="pointer-events-none drop-shadow-md select-none"
                    >
                      {node.name}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Floating Node Details Card if node selected */}
        {selectedNode && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-80 bg-slate-900/95 backdrop-blur-md border border-slate-700 p-3 rounded-xl shadow-2xl z-20 text-xs">
            <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-800">
              <div>
                <h4 className="font-semibold text-white text-sm">{selectedNode.name}</h4>
                <p className="text-slate-400">
                  {selectedNode.building} · {selectedNode.floor}
                </p>
              </div>
              <button
                onClick={() => setSelectedNodeId(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            <p className="py-2 text-slate-300 leading-relaxed">{selectedNode.description}</p>
            {selectedNode.timings && (
              <p className="text-amber-300 font-mono text-[11px] pb-2">Hours: {selectedNode.timings}</p>
            )}

            <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
              <button
                onClick={() => {
                  onSetStart(selectedNode.id);
                  setSelectedNodeId(null);
                }}
                className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors text-center"
              >
                Set as Start
              </button>
              <button
                onClick={() => {
                  onSetDestination(selectedNode.id);
                  setSelectedNodeId(null);
                }}
                className="flex-1 py-1.5 px-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors text-center"
              >
                Set as Destination
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Entrance / Gate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500 inline-block"></span>
            <span>Departments</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            <span>Laboratories</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
            <span>Classrooms</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"></span>
            <span>Canteen</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span>
            <span>Hostels</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-indigo-400">
          <Info className="w-3.5 h-3.5" />
          <span>Click any node to navigate or view details</span>
        </div>
      </div>
    </div>
  );
};
