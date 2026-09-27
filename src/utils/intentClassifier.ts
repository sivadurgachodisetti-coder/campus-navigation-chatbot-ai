import { CAMPUS_NODES, CAMPUS_EDGES, ROOM_DATABASE, RoomDetail } from '../data/campusData';
import { findShortestPathBFS, normalizeNodeId, BFSResult } from './bfsPathfinder';

export type UserIntent = 'DIRECTIONS' | 'LOCATION' | 'TIMING' | 'GENERAL' | 'UNKNOWN';

export interface ExtractedEntities {
  startLocation: string | null;
  destinationLocation: string | null;
  roomNumber: string | null;
  roomInfo: RoomDetail | null;
  nearbySubject: string | null;
}

export interface IntentAnalysisResult {
  rawQuery: string;
  intent: UserIntent;
  confidence: number;
  matchedKeywords: string[];
  entities: ExtractedEntities;
  replyText: string;
  bfsResult?: BFSResult;
}

// Keyword vocabulary for intent classification
const INTENT_RULES = {
  DIRECTIONS: [
    'how can i reach',
    'how to reach',
    'how do i go',
    'how to go',
    'directions to',
    'route to',
    'path to',
    'navigate to',
    'way to',
    'how to get to',
    'guide me to',
    'take me to',
    'from',
    'reach',
    'route',
    'path',
    'steps to go',
    'direction',
  ],
  LOCATION: [
    'where is',
    'where are',
    'where can i find',
    'locate',
    'location of',
    'find',
    'situated',
    'placed',
    'which floor',
    'which building',
    'room number',
    'where',
  ],
  TIMING: [
    'timings',
    'timing',
    'time',
    'hours',
    'when is',
    'when does',
    'open',
    'close',
    'closing time',
    'opening time',
    'schedule',
    'curfew',
  ],
  GENERAL: [
    'what is near',
    'near',
    'around',
    'close to',
    'beside',
    'adjacent to',
    'opposite to',
    'tell me about',
    'about',
    'info',
    'information',
    'help',
    'what can you do',
    'facilities',
    'features',
  ],
};

/**
 * Extracts room number from query if present (e.g., "Room 205", "205", "A-101", "room 101")
 */
export function extractRoomNumber(query: string): string | null {
  const clean = query.trim();

  // Pattern: "room 205", "room no 205", "room #205", "A-101", "205"
  const roomPattern = /\b(?:room\s*(?:no\.?|number|#)?\s*([a-zA-Z]?[-0-9]{2,5})|([a-zA-Z]-[0-9]{2,4}))\b/i;
  const match = clean.match(roomPattern);
  if (match) {
    const candidate = (match[1] || match[2]).toUpperCase();
    if (ROOM_DATABASE[candidate]) return candidate;
    // Check if numeric part exists in database
    const numPart = candidate.replace(/[^0-9]/g, '');
    if (ROOM_DATABASE[numPart]) return numPart;
    return candidate; // Return parsed string even if unknown so we can report unknown room
  }

  // Check standalone digits (101, 102, 105, 201, 205, 210, 301, 305)
  for (const rNum of Object.keys(ROOM_DATABASE)) {
    const regex = new RegExp(`\\b${rNum}\\b`, 'i');
    if (regex.test(clean)) {
      return rNum;
    }
  }

  return null;
}

/**
 * Extracts Start and Destination entities from directional query phrases
 * Example: "How do I go from main gate to the CSE block?"
 */
export function extractRouteEndpoints(query: string): { start: string | null; dest: string | null } {
  const lower = query.toLowerCase();

  // Pattern: from [X] to [Y]
  const fromToMatch = lower.match(/(?:from|starting from|start at)\s+([a-z0-9\s-]+?)\s+(?:to|towards|into)\s+([a-z0-9\s-]+)/i);
  if (fromToMatch) {
    const rawStart = fromToMatch[1].trim();
    const rawDest = fromToMatch[2].trim();
    return {
      start: normalizeCampusLocation(rawStart),
      dest: normalizeCampusLocation(rawDest),
    };
  }

  // Pattern: to [Y] from [X]
  const toFromMatch = lower.match(/(?:to|towards)\s+([a-z0-9\s-]+?)\s+(?:from|starting from)\s+([a-z0-9\s-]+)/i);
  if (toFromMatch) {
    const rawDest = toFromMatch[1].trim();
    const rawStart = toFromMatch[2].trim();
    return {
      start: normalizeCampusLocation(rawStart),
      dest: normalizeCampusLocation(rawDest),
    };
  }

  // Pattern: how to reach [Y], directions to [Y], way to [Y]
  const destMatch = lower.match(/(?:reach|directions to|route to|path to|way to|go to|guide me to|navigate to|to)\s+([a-z0-9\s-]+)/i);
  if (destMatch) {
    const rawDest = destMatch[1].trim();
    return {
      start: 'Main Gate', // Default starting point if not mentioned
      dest: normalizeCampusLocation(rawDest),
    };
  }

  return { start: null, dest: null };
}

/**
 * Maps informal phrase to standard campus node or room
 */
export function normalizeCampusLocation(input: string): string | null {
  if (!input) return null;
  const clean = input
    .replace(/[?.!,]/g, '')
    .replace(/\b(the|a|an|please|can you|tell me|where is|how to)\b/gi, '')
    .trim();

  // 1. Check room numbers first
  const parsedRoom = extractRoomNumber(clean);
  if (parsedRoom && ROOM_DATABASE[parsedRoom]) {
    return ROOM_DATABASE[parsedRoom].nearestNodeId;
  }

  // 2. Direct node match
  const matchedNode = normalizeNodeId(clean);
  if (matchedNode) return matchedNode;

  // 3. Fallback alias checks
  const lower = clean.toLowerCase();
  if (lower.includes('cse') && lower.includes('lab')) return 'CSE Lab 1';
  if (lower.includes('aiml') && lower.includes('lab')) return 'AIML Lab';
  if (lower.includes('ece') && lower.includes('lab')) return 'ECE Lab';
  if (lower.includes('cse') || lower.includes('computer')) return 'CSE Department';
  if (lower.includes('aiml') || lower.includes('ai')) return 'AIML Department';
  if (lower.includes('ece') || lower.includes('electronics')) return 'ECE Department';
  if (lower.includes('lib') || lower.includes('book')) return 'Library';
  if (lower.includes('cant') || lower.includes('food') || lower.includes('eat')) return 'Canteen';
  if (lower.includes('hostel') || lower.includes('dorm')) return 'Hostel';
  if (lower.includes('admin') || lower.includes('fee')) return 'Administrative Office';
  if (lower.includes('principal') || lower.includes('director')) return 'Principal Office';
  if (lower.includes('seminar')) return 'Seminar Hall';
  if (lower.includes('audi')) return 'Auditorium';
  if (lower.includes('sports') || lower.includes('ground') || lower.includes('gym')) return 'Sports Complex';
  if (lower.includes('lawn') || lower.includes('garden')) return 'Central Lawn';
  if (lower.includes('gate') || lower.includes('entry') || lower.includes('entrance')) return 'Main Gate';
  if (lower.includes('park')) return 'Parking Area';

  return null;
}

/**
 * Classifies intent and generates response
 */
export function classifyAndProcessQuery(userQuery: string): IntentAnalysisResult {
  const query = userQuery.trim();
  const lower = query.toLowerCase();

  const matchedKeywords: string[] = [];
  let detectedIntent: UserIntent = 'UNKNOWN';
  let bestScore = 0;

  // 1. Check intent keyword rules
  for (const [intentKey, keywords] of Object.entries(INTENT_RULES)) {
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        score += kw.split(' ').length * 2; // longer matches have higher weight
        matchedKeywords.push(kw);
      }
    }
    if (score > bestScore) {
      bestScore = score;
      detectedIntent = intentKey as UserIntent;
    }
  }

  // 2. Extract Room Entity
  const roomNumber = extractRoomNumber(query);
  const roomInfo = roomNumber && ROOM_DATABASE[roomNumber] ? ROOM_DATABASE[roomNumber] : null;

  // 3. Extract Route Endpoints
  const endpoints = extractRouteEndpoints(query);

  // If query starts with "Where is" or mentions room, bias towards LOCATION if not already DIRECTIONS
  if (lower.includes('where') || lower.includes('locate') || lower.includes('which floor')) {
    if (!lower.includes('how can i reach') && !lower.includes('how do i go') && !lower.includes('from ')) {
      detectedIntent = 'LOCATION';
    }
  }

  // If query specifically asks "How to go", "how can i reach", or contains "from ... to", intent is DIRECTIONS
  if (endpoints.dest || lower.includes('reach') || lower.includes('how do i go') || lower.includes('how to reach') || lower.includes('route to')) {
    detectedIntent = 'DIRECTIONS';
  }

  // Check for timing keywords override
  if (lower.includes('timings') || lower.includes('hours') || lower.includes('when does') || lower.includes('open') || lower.includes('closing time')) {
    detectedIntent = 'TIMING';
  }

  // Check for "What is near" override
  if (lower.includes('what is near') || lower.includes('near to') || lower.includes('around')) {
    detectedIntent = 'GENERAL';
  }

  // Build entities record
  const entities: ExtractedEntities = {
    startLocation: endpoints.start,
    destinationLocation: endpoints.dest || (roomInfo ? roomInfo.nearestNodeId : normalizeCampusLocation(query)),
    roomNumber,
    roomInfo,
    nearbySubject: null,
  };

  // If user asked about a specific unknown room (e.g. "Room 999" or "where is room 888")
  if (roomNumber && !roomInfo) {
    return {
      rawQuery: query,
      intent: 'LOCATION',
      confidence: 0.9,
      matchedKeywords: ['room', roomNumber],
      entities,
      replyText: "Sorry, I couldn't find that location in the campus database.",
    };
  }

  // Process based on Intent
  switch (detectedIntent) {
    case 'DIRECTIONS': {
      const destination = entities.destinationLocation;
      const start = entities.startLocation || 'Main Gate';

      if (!destination) {
        return {
          rawQuery: query,
          intent: 'DIRECTIONS',
          confidence: 0.5,
          matchedKeywords,
          entities,
          replyText: "Sorry, I couldn't find that location in the campus database.",
        };
      }

      // Run BFS Pathfinding
      const bfsResult = findShortestPathBFS(start, destination);
      return {
        rawQuery: query,
        intent: 'DIRECTIONS',
        confidence: 0.95,
        matchedKeywords,
        entities,
        replyText: bfsResult.formattedRouteText,
        bfsResult,
      };
    }

    case 'LOCATION': {
      // If room searched
      if (roomInfo) {
        const nearestNode = CAMPUS_NODES[roomInfo.nearestNodeId];
        const bfsFromGate = findShortestPathBFS('Main Gate', roomInfo.nearestNodeId);

        const reply = [
          `Location: ${roomInfo.name}`,
          `Building: ${roomInfo.building}`,
          `Floor: ${roomInfo.floor}`,
          `Department: ${roomInfo.department}`,
          `Description: ${roomInfo.description}`,
          ``,
          `Navigation from Main Gate:`,
          bfsFromGate.formattedRouteText,
        ].join('\n');

        return {
          rawQuery: query,
          intent: 'LOCATION',
          confidence: 0.95,
          matchedKeywords,
          entities,
          replyText: reply,
          bfsResult: bfsFromGate,
        };
      }

      // Check campus node
      const locationId = entities.destinationLocation;
      if (locationId && CAMPUS_NODES[locationId]) {
        const node = CAMPUS_NODES[locationId];
        const bfsFromGate = findShortestPathBFS('Main Gate', locationId);

        const reply = [
          `Location: ${node.name}`,
          `Building: ${node.building}`,
          `Floor: ${node.floor}`,
          node.room ? `Room: ${node.room}` : null,
          `Description: ${node.description}`,
          node.timings ? `Timings: ${node.timings}` : null,
          ``,
          `Shortest Route from Main Gate:`,
          bfsFromGate.formattedRouteText,
        ]
          .filter(Boolean)
          .join('\n');

        return {
          rawQuery: query,
          intent: 'LOCATION',
          confidence: 0.92,
          matchedKeywords,
          entities,
          replyText: reply,
          bfsResult: bfsFromGate,
        };
      }

      return {
        rawQuery: query,
        intent: 'LOCATION',
        confidence: 0.3,
        matchedKeywords,
        entities,
        replyText: "Sorry, I couldn't find that location in the campus database.",
      };
    }

    case 'TIMING': {
      const locId = entities.destinationLocation || normalizeCampusLocation(query);
      if (locId && CAMPUS_NODES[locId]) {
        const node = CAMPUS_NODES[locId];
        const reply = `Timings for ${node.name}:\n${node.timings || 'Standard Campus Hours: 8:30 AM - 5:00 PM'}\n\nLocated in ${node.building} (${node.floor}).`;
        return {
          rawQuery: query,
          intent: 'TIMING',
          confidence: 0.9,
          matchedKeywords,
          entities,
          replyText: reply,
        };
      }

      return {
        rawQuery: query,
        intent: 'TIMING',
        confidence: 0.4,
        matchedKeywords,
        entities,
        replyText: "Sorry, I couldn't find that location in the campus database.",
      };
    }

    case 'GENERAL': {
      // Check if user is asking "What is near X?"
      const nearMatch = lower.match(/(?:near|around|adjacent to|beside|close to)\s+(?:the\s+)?([a-z0-9\s-]+)/i);
      const subject = nearMatch ? normalizeCampusLocation(nearMatch[1]) : (entities.destinationLocation || normalizeCampusLocation(query));

      if (subject && CAMPUS_NODES[subject]) {
        const node = CAMPUS_NODES[subject];
        // Find adjacent neighbors
        const neighbors: string[] = [];
        CAMPUS_EDGES.forEach((edge) => {
          if (edge.from === subject && !neighbors.includes(edge.to)) {
            neighbors.push(`${edge.to} (${edge.distance}m away)`);
          }
        });

        const reply = [
          `Locations near ${node.name} (${node.building}, ${node.floor}):`,
          ...neighbors.map((n, i) => `${i + 1}. ${n}`),
          ``,
          `Tip: Ask "How do I reach ${node.name}?" for step-by-step navigation from the Main Gate.`,
        ].join('\n');

        return {
          rawQuery: query,
          intent: 'GENERAL',
          confidence: 0.88,
          matchedKeywords,
          entities: { ...entities, nearbySubject: subject },
          replyText: reply,
        };
      }

      // General campus help
      if (lower.includes('help') || lower.includes('hello') || lower.includes('hi') || lower.includes('what can you do')) {
        return {
          rawQuery: query,
          intent: 'GENERAL',
          confidence: 0.9,
          matchedKeywords: ['help'],
          entities,
          replyText: [
            `Welcome to the College Campus Navigation Chatbot!`,
            `I can help you navigate our campus, find classrooms, labs, departments, and timings.`,
            ``,
            `Try asking me:`,
            `• "Where is CSE Lab?"`,
            `• "Where is Room 205?"`,
            `• "How can I reach the library?"`,
            `• "How do I go from main gate to the CSE block?"`,
            `• "Where is the canteen?"`,
            `• "What is near the seminar hall?"`,
            `• "What are the library timings?"`,
          ].join('\n'),
        };
      }

      return {
        rawQuery: query,
        intent: 'GENERAL',
        confidence: 0.3,
        matchedKeywords,
        entities,
        replyText: "Sorry, I couldn't find that location in the campus database.",
      };
    }

    default: {
      // Check if query directly matched a campus node name
      const locId = normalizeCampusLocation(query);
      if (locId && CAMPUS_NODES[locId]) {
        const node = CAMPUS_NODES[locId];
        const bfsFromGate = findShortestPathBFS('Main Gate', locId);
        return {
          rawQuery: query,
          intent: 'LOCATION',
          confidence: 0.8,
          matchedKeywords: [locId],
          entities: { ...entities, destinationLocation: locId },
          replyText: `Found ${node.name} in ${node.building} (${node.floor}).\n\nRoute from Main Gate:\n${bfsFromGate.formattedRouteText}`,
          bfsResult: bfsFromGate,
        };
      }

      return {
        rawQuery: query,
        intent: 'UNKNOWN',
        confidence: 0.1,
        matchedKeywords: [],
        entities,
        replyText: "Sorry, I couldn't find that location in the campus database.",
      };
    }
  }
}
