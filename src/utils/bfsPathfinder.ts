import { CAMPUS_NODES, CAMPUS_EDGES, CampusEdge } from '../data/campusData';

export interface PathStep {
  fromNode: string;
  toNode: string;
  instruction: string;
  distance: number;
}

export interface BFSTraceStep {
  stepNumber: number;
  currentNode: string;
  queueSnapshot: string[];
  visitedNodes: string[];
  actionDescription: string;
}

export interface BFSResult {
  found: boolean;
  startNode: string;
  targetNode: string;
  path: string[];
  steps: PathStep[];
  totalDistanceMeters: number;
  estimatedWalkingMinutes: number;
  bfsTrace: BFSTraceStep[];
  formattedRouteText: string;
}

// Build adjacency list from CAMPUS_EDGES
export function getCampusAdjacencyList(): Map<string, CampusEdge[]> {
  const adj = new Map<string, CampusEdge[]>();

  // Initialize for all known nodes
  Object.keys(CAMPUS_NODES).forEach((nodeId) => {
    adj.set(nodeId, []);
  });

  CAMPUS_EDGES.forEach((edge) => {
    if (!adj.has(edge.from)) {
      adj.set(edge.from, []);
    }
    adj.get(edge.from)!.push(edge);
  });

  return adj;
}

/**
 * Finds shortest path using Breadth-First Search (BFS)
 * Guarantees shortest path in terms of number of hops (ideal for college navigation)
 */
export function findShortestPathBFS(startId: string, targetId: string): BFSResult {
  const startNode = CAMPUS_NODES[startId] ? startId : normalizeNodeId(startId);
  const targetNode = CAMPUS_NODES[targetId] ? targetId : normalizeNodeId(targetId);

  if (!startNode || !targetNode || !CAMPUS_NODES[startNode] || !CAMPUS_NODES[targetNode]) {
    return {
      found: false,
      startNode: startId,
      targetNode: targetId,
      path: [],
      steps: [],
      totalDistanceMeters: 0,
      estimatedWalkingMinutes: 0,
      bfsTrace: [],
      formattedRouteText: "Sorry, I couldn't find that location in the campus database.",
    };
  }

  // Handle case where start and destination are the exact same
  if (startNode === targetNode) {
    const loc = CAMPUS_NODES[startNode];
    return {
      found: true,
      startNode,
      targetNode,
      path: [startNode],
      steps: [],
      totalDistanceMeters: 0,
      estimatedWalkingMinutes: 0,
      bfsTrace: [
        {
          stepNumber: 1,
          currentNode: startNode,
          queueSnapshot: [],
          visitedNodes: [startNode],
          actionDescription: 'Start and destination are identical. Already at destination.',
        },
      ],
      formattedRouteText: `Starting Point: ${startNode}\nDestination: ${targetNode}\n\nYou are already at ${loc.name} (${loc.building}, ${loc.floor}).\n\nEstimated distance: 0 meters\nEstimated walking time: 0 minutes`,
    };
  }

  const adj = getCampusAdjacencyList();
  const queue: string[] = [startNode];
  const visited = new Set<string>([startNode]);
  const parentMap = new Map<string, { parent: string; edge: CampusEdge }>();
  const trace: BFSTraceStep[] = [];
  let stepCounter = 1;

  let reached = false;

  while (queue.length > 0) {
    const current = queue.shift()!;

    trace.push({
      stepNumber: stepCounter++,
      currentNode: current,
      queueSnapshot: [...queue],
      visitedNodes: Array.from(visited),
      actionDescription: `Dequeued '${current}'. Inspecting outward connections...`,
    });

    if (current === targetNode) {
      reached = true;
      break;
    }

    const neighbors: CampusEdge[] = adj.get(current) ?? [];
    for (const edge of neighbors) {
      const neighbor: string = edge.to;
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        parentMap.set(neighbor, { parent: current, edge });
        queue.push(neighbor);

        if (neighbor === targetNode) {
          reached = true;
          trace.push({
            stepNumber: stepCounter++,
            currentNode: neighbor,
            queueSnapshot: [...queue],
            visitedNodes: Array.from(visited),
            actionDescription: `Found destination '${targetNode}'! Terminating search.`,
          });
          break;
        }
      }
    }

    if (reached) break;
  }

  if (!reached) {
    return {
      found: false,
      startNode,
      targetNode,
      path: [],
      steps: [],
      totalDistanceMeters: 0,
      estimatedWalkingMinutes: 0,
      bfsTrace: trace,
      formattedRouteText: `No accessible path found between ${startNode} and ${targetNode}.`,
    };
  }

  // Reconstruct path backwards from targetNode
  const path: string[] = [targetNode];
  const steps: PathStep[] = [];
  let curr = targetNode;

  while (curr !== startNode) {
    const record = parentMap.get(curr);
    if (!record) break;
    steps.unshift({
      fromNode: record.parent,
      toNode: curr,
      instruction: record.edge.instruction,
      distance: record.edge.distance,
    });
    curr = record.parent;
    path.unshift(curr);
  }

  const totalDistanceMeters = steps.reduce((sum, s) => sum + s.distance, 0);
  // Average campus walking speed: ~70 meters per minute (1.16 m/s)
  const walkingMinutes = Math.max(1, Math.round((totalDistanceMeters / 70) * 10) / 10);

  // Format response strictly adhering to requested specification
  const formattedRouteText = formatRouteResponse(startNode, targetNode, steps, totalDistanceMeters, walkingMinutes);

  return {
    found: true,
    startNode,
    targetNode,
    path,
    steps,
    totalDistanceMeters,
    estimatedWalkingMinutes: walkingMinutes,
    bfsTrace: trace,
    formattedRouteText,
  };
}

export function formatRouteResponse(
  startNode: string,
  targetNode: string,
  steps: PathStep[],
  distanceMeters: number,
  walkingMinutes: number
): string {
  const startLoc = CAMPUS_NODES[startNode];
  const targetLoc = CAMPUS_NODES[targetNode];

  const lines: string[] = [];
  lines.push(`Starting Point: ${startLoc?.name || startNode}`);
  lines.push(`Destination: ${targetLoc?.name || targetNode} (${targetLoc?.building || ''}, ${targetLoc?.floor || ''})`);
  lines.push(`Shortest Route:`);

  steps.forEach((step, idx) => {
    lines.push(`${idx + 1}. ${step.instruction} (${step.distance}m)`);
  });

  lines.push(``);
  lines.push(`Estimated distance: ${distanceMeters} meters`);
  lines.push(`Estimated walking time: ${walkingMinutes} minute${walkingMinutes === 1 ? '' : 's'}`);

  return lines.join('\n');
}

/**
 * Normalizes input string to find closest matching node ID
 */
export function normalizeNodeId(query: string): string | null {
  if (!query) return null;
  const clean = query.trim().toLowerCase();

  // 1. Direct match with ID
  for (const id of Object.keys(CAMPUS_NODES)) {
    if (id.toLowerCase() === clean) return id;
  }

  // 2. Keyword match
  for (const [id, node] of Object.entries(CAMPUS_NODES)) {
    if (node.keywords.some((k) => k.toLowerCase() === clean)) {
      return id;
    }
  }

  // 3. Substring match
  for (const [id, node] of Object.entries(CAMPUS_NODES)) {
    if (clean.includes(id.toLowerCase())) return id;
    for (const k of node.keywords) {
      if (clean.includes(k.toLowerCase()) || k.toLowerCase().includes(clean)) {
        return id;
      }
    }
  }

  return null;
}
