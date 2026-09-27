export interface ProjectFile {
  filename: string;
  language: string;
  description: string;
  code: string;
}

export const PROJECT_STRUCTURE_TREE = `campus-navigation-chatbot/
│
├── campus_data.py          # Structured graph nodes, edges, and room database
├── bfs_pathfinder.py       # Breadth-First Search (BFS) pathfinding algorithm
├── campus_nlp.py           # Keyword & regex-based AI intent classifier
├── app.py                  # Main interactive CLI & Flask REST API entry point
├── static/
│   ├── index.html          # Web chatbot interface
│   ├── style.css           # Styling for chat and interactive map
│   └── script.js           # Client-side chat logic & route rendering
├── requirements.txt        # Python dependencies (flask, flask-cors)
└── README.md               # Setup guide and B.Tech project viva documentation`;

export const BTECH_PYTHON_FILES: ProjectFile[] = [
  {
    filename: 'campus_data.py',
    language: 'python',
    description: 'Structured JSON/Dictionary holding all campus nodes, building details, corridors (edges), and room mappings.',
    code: `"""
campus_data.py
College Campus Database
Defines graph nodes, corridor edges with distances, and room registries.
"""

CAMPUS_NODES = {
    "Main Gate": {
        "name": "Main Gate",
        "building": "Entrance",
        "floor": "Ground Floor",
        "type": "gate",
        "description": "Primary college security checkpoint and campus shuttle stop.",
        "timings": "Open 24/7 (Security Check)",
        "keywords": ["main gate", "gate", "entrance", "security", "entry"]
    },
    "Parking Area": {
        "name": "Parking Area",
        "building": "Parking Zone",
        "floor": "Ground Floor",
        "type": "facility",
        "description": "Student and faculty two-wheeler and four-wheeler parking.",
        "timings": "6:00 AM - 10:00 PM",
        "keywords": ["parking", "bike parking", "car parking"]
    },
    "Administrative Office": {
        "name": "Administrative Office",
        "building": "Admin Block",
        "floor": "Ground Floor",
        "room": "A-01",
        "type": "office",
        "description": "Student admissions, fee payment desk, and certificates verification.",
        "timings": "9:00 AM - 5:00 PM (Mon-Sat)",
        "keywords": ["admin office", "administrative office", "admin", "fees", "admissions"]
    },
    "Principal Office": {
        "name": "Principal Office",
        "building": "Admin Block",
        "floor": "1st Floor",
        "room": "A-101",
        "type": "office",
        "description": "Chamber of the College Principal and council meeting room.",
        "timings": "10:00 AM - 4:00 PM (By Appointment)",
        "keywords": ["principal office", "principal", "director"]
    },
    "Central Lawn": {
        "name": "Central Lawn",
        "building": "Central Plaza",
        "floor": "Ground Floor",
        "type": "landmark",
        "description": "Lush green courtyard connecting all academic blocks.",
        "timings": "Open all day",
        "keywords": ["central lawn", "lawn", "garden", "courtyard"]
    },
    "Block A": {
        "name": "Block A",
        "building": "Block A",
        "floor": "Ground Floor",
        "type": "building",
        "description": "Academic building housing CSE Dept, Library, and Seminar Hall.",
        "timings": "8:00 AM - 7:00 PM",
        "keywords": ["block a", "a block", "building a"]
    },
    "Block B": {
        "name": "Block B",
        "building": "Block B",
        "floor": "Ground Floor",
        "type": "building",
        "description": "Academic building housing AIML and ECE departments.",
        "timings": "8:00 AM - 7:00 PM",
        "keywords": ["block b", "b block", "building b"]
    },
    "Library": {
        "name": "Central Library",
        "building": "Block A",
        "floor": "Ground Floor",
        "room": "A-G05",
        "type": "library",
        "description": "Central digital and book repository with reading cubicles.",
        "timings": "8:30 AM - 8:00 PM (Mon-Sat), 9:00 AM - 2:00 PM (Sun)",
        "keywords": ["library", "central library", "books", "reading room"]
    },
    "CSE Department": {
        "name": "CSE Department",
        "building": "Block A",
        "floor": "1st Floor",
        "room": "A-102",
        "type": "department",
        "description": "Computer Science & Engineering HOD cabin and faculty rooms.",
        "timings": "9:00 AM - 5:00 PM (Mon-Sat)",
        "keywords": ["cse department", "cse dept", "computer science", "cse"]
    },
    "CSE Lab 1": {
        "name": "CSE Lab 1",
        "building": "Block A",
        "floor": "1st Floor",
        "room": "101",
        "type": "lab",
        "description": "High-performance programming lab for Data Structures & Algorithms.",
        "timings": "9:00 AM - 5:00 PM",
        "keywords": ["cse lab 1", "cse lab", "coding lab", "room 101", "101"]
    },
    "CSE Lab 2": {
        "name": "CSE Lab 2",
        "building": "Block A",
        "floor": "1st Floor",
        "room": "105",
        "type": "lab",
        "description": "Cloud computing, cyber security, and web development lab.",
        "timings": "9:00 AM - 5:00 PM",
        "keywords": ["cse lab 2", "cloud lab", "room 105", "105"]
    },
    "Seminar Hall": {
        "name": "Seminar Hall",
        "building": "Block A",
        "floor": "2nd Floor",
        "room": "A-210",
        "type": "hall",
        "description": "Air-conditioned seminar hall with audiovisual projection system.",
        "timings": "9:00 AM - 6:00 PM",
        "keywords": ["seminar hall", "seminar", "a-210", "room 210"]
    },
    "AIML Department": {
        "name": "AIML Department",
        "building": "Block B",
        "floor": "2nd Floor",
        "room": "B-201",
        "type": "department",
        "description": "Artificial Intelligence & Machine Learning faculty office.",
        "timings": "9:00 AM - 5:00 PM (Mon-Sat)",
        "keywords": ["aiml department", "ai ml department", "aiml dept", "aiml"]
    },
    "AIML Lab": {
        "name": "AIML Lab",
        "building": "Block B",
        "floor": "2nd Floor",
        "room": "205",
        "type": "lab",
        "description": "Deep learning research lab equipped with GPU workstations.",
        "timings": "9:00 AM - 5:30 PM",
        "keywords": ["aiml lab", "ai lab", "machine learning lab", "room 205", "205"]
    },
    "ECE Department": {
        "name": "ECE Department",
        "building": "Block B",
        "floor": "3rd Floor",
        "room": "B-301",
        "type": "department",
        "description": "Electronics and Communication Engineering department.",
        "timings": "9:00 AM - 5:00 PM (Mon-Sat)",
        "keywords": ["ece department", "ece dept", "electronics department", "ece"]
    },
    "ECE Lab": {
        "name": "ECE Lab",
        "building": "Block B",
        "floor": "3rd Floor",
        "room": "305",
        "type": "lab",
        "description": "Microprocessors, VLSI, and IoT hardware experimentation laboratory.",
        "timings": "9:00 AM - 5:00 PM",
        "keywords": ["ece lab", "electronics lab", "embedded lab", "room 305", "305"]
    },
    "Auditorium": {
        "name": "Auditorium",
        "building": "Central Complex",
        "floor": "Ground Floor",
        "type": "hall",
        "description": "1200-seat grand auditorium for events and guest lectures.",
        "timings": "9:00 AM - 7:00 PM (Event Based)",
        "keywords": ["auditorium", "audi", "main hall"]
    },
    "Canteen": {
        "name": "Campus Canteen",
        "building": "Cafeteria Complex",
        "floor": "Ground Floor",
        "type": "canteen",
        "description": "Multi-cuisine student and faculty cafeteria.",
        "timings": "7:30 AM - 8:30 PM (Daily)",
        "keywords": ["canteen", "cafeteria", "food court", "mess", "cafe"]
    },
    "Hostel": {
        "name": "Hostel Block",
        "building": "Hostel Zone",
        "floor": "Blocks H1 & G1",
        "type": "hostel",
        "description": "Campus residential dormitories with study hall and mess.",
        "timings": "Curfew: 9:30 PM",
        "keywords": ["hostel", "boys hostel", "girls hostel", "dorm"]
    },
    "Sports Complex": {
        "name": "Sports Complex",
        "building": "Sports Arena",
        "floor": "Ground Floor",
        "type": "facility",
        "description": "Gymnasium, basketball court, and athletic grounds.",
        "timings": "6:00 AM - 8:30 AM & 4:30 PM - 8:00 PM",
        "keywords": ["sports complex", "sports", "ground", "gym"]
    }
}

CAMPUS_EDGES = [
    {"from": "Main Gate", "to": "Parking Area", "distance": 50, "instruction": "Walk past security checkpoint towards the parking lot."},
    {"from": "Parking Area", "to": "Main Gate", "distance": 50, "instruction": "Walk back along entrance drive to the Main Gate."},
    {"from": "Main Gate", "to": "Administrative Office", "distance": 75, "instruction": "Follow the paved walkway straight to Admin Block."},
    {"from": "Administrative Office", "to": "Main Gate", "distance": 75, "instruction": "Walk south along the paved path to the Main Gate."},
    {"from": "Main Gate", "to": "Central Lawn", "distance": 130, "instruction": "Walk up the tree-lined boulevard to the Central Lawn."},
    {"from": "Central Lawn", "to": "Main Gate", "distance": 130, "instruction": "Walk south along the boulevard to the Main Gate."},
    {"from": "Administrative Office", "to": "Principal Office", "distance": 20, "instruction": "Take the indoor stairs or lift to 1st Floor."},
    {"from": "Principal Office", "to": "Administrative Office", "distance": 20, "instruction": "Descend stairs to ground floor reception."},
    {"from": "Administrative Office", "to": "Central Lawn", "distance": 80, "instruction": "Exit east into the Central Lawn quadrangle."},
    {"from": "Central Lawn", "to": "Administrative Office", "distance": 80, "instruction": "Walk west towards the Admin Block entrance."},
    {"from": "Central Lawn", "to": "Block A", "distance": 60, "instruction": "Walk north across lawn to Block A entrance."},
    {"from": "Block A", "to": "Central Lawn", "distance": 60, "instruction": "Exit Block A south directly into Central Lawn."},
    {"from": "Central Lawn", "to": "Block B", "distance": 75, "instruction": "Walk northeast to Block B entrance."},
    {"from": "Block B", "to": "Central Lawn", "distance": 75, "instruction": "Exit Block B southwest into Central Lawn."},
    {"from": "Central Lawn", "to": "Auditorium", "distance": 70, "instruction": "Walk east past the fountain to Auditorium steps."},
    {"from": "Auditorium", "to": "Central Lawn", "distance": 70, "instruction": "Walk west towards Central Lawn."},
    {"from": "Central Lawn", "to": "Canteen", "distance": 95, "instruction": "Follow shaded pathway to Cafeteria Complex."},
    {"from": "Canteen", "to": "Central Lawn", "distance": 95, "instruction": "Walk northwest back to Central Lawn."},
    {"from": "Block A", "to": "Library", "distance": 25, "instruction": "Enter Block A foyer; Library is on the left."},
    {"from": "Library", "to": "Block A", "distance": 25, "instruction": "Exit Library into Block A main lobby."},
    {"from": "Block A", "to": "CSE Department", "distance": 40, "instruction": "Take stairs/lift to 1st Floor Block A."},
    {"from": "CSE Department", "to": "Block A", "distance": 40, "instruction": "Take stairs/lift down to ground floor."},
    {"from": "CSE Department", "to": "CSE Lab 1", "distance": 25, "instruction": "Walk along 1st floor corridor to Room 101."},
    {"from": "CSE Lab 1", "to": "CSE Department", "distance": 25, "instruction": "Walk back to CSE Department office."},
    {"from": "CSE Department", "to": "CSE Lab 2", "distance": 30, "instruction": "Follow hallway right to Room 105."},
    {"from": "CSE Lab 2", "to": "CSE Department", "distance": 30, "instruction": "Return to CSE Department office."},
    {"from": "CSE Department", "to": "Seminar Hall", "distance": 45, "instruction": "Ascend stairs to 2nd Floor Block A."},
    {"from": "Seminar Hall", "to": "CSE Department", "distance": 45, "instruction": "Descend stairs to 1st Floor."},
    {"from": "Block A", "to": "Block B", "distance": 85, "instruction": "Walk across central pedestrian connector."},
    {"from": "Block B", "to": "Block A", "distance": 85, "instruction": "Walk across central connector to Block A."},
    {"from": "Block B", "to": "AIML Department", "distance": 45, "instruction": "Take stairs/lift in Block B to 2nd Floor."},
    {"from": "AIML Department", "to": "Block B", "distance": 45, "instruction": "Take stairs/lift down to ground floor."},
    {"from": "AIML Department", "to": "AIML Lab", "distance": 20, "instruction": "Follow 2nd floor corridor right to Room 205."},
    {"from": "AIML Lab", "to": "AIML Department", "distance": 20, "instruction": "Return along corridor to AIML Dept Office."},
    {"from": "Block B", "to": "ECE Department", "distance": 55, "instruction": "Take elevator or stairs to 3rd Floor."},
    {"from": "ECE Department", "to": "Block B", "distance": 55, "instruction": "Take elevator or stairs down to ground floor."},
    {"from": "ECE Department", "to": "ECE Lab", "distance": 20, "instruction": "Proceed down 3rd floor west corridor to Room 305."},
    {"from": "ECE Lab", "to": "ECE Department", "distance": 20, "instruction": "Return to ECE Department office."},
    {"from": "Auditorium", "to": "Canteen", "distance": 55, "instruction": "Walk along paved pathway to Canteen."},
    {"from": "Canteen", "to": "Auditorium", "distance": 55, "instruction": "Walk toward main Auditorium building."},
    {"from": "Canteen", "to": "Hostel", "distance": 90, "instruction": "Follow residential avenue to Hostel Block."},
    {"from": "Hostel", "to": "Canteen", "distance": 90, "instruction": "Walk down residential avenue to Canteen."},
    {"from": "Hostel", "to": "Sports Complex", "distance": 70, "instruction": "Follow outdoor fitness trail to Sports Complex."},
    {"from": "Sports Complex", "to": "Hostel", "distance": 70, "instruction": "Walk south along path towards Hostel Block."}
]

ROOM_DATABASE = {
    "101": {
        "room_number": "101",
        "name": "CSE Lab 1",
        "building": "Block A",
        "floor": "1st Floor",
        "department": "Computer Science and Engineering",
        "nearest_node": "CSE Lab 1"
    },
    "105": {
        "room_number": "105",
        "name": "CSE Lab 2",
        "building": "Block A",
        "floor": "1st Floor",
        "department": "Computer Science and Engineering",
        "nearest_node": "CSE Lab 2"
    },
    "205": {
        "room_number": "205",
        "name": "AIML Lab (Room 205)",
        "building": "Block B",
        "floor": "2nd Floor",
        "department": "Artificial Intelligence & Machine Learning",
        "nearest_node": "AIML Lab"
    },
    "305": {
        "room_number": "305",
        "name": "ECE Lab (Room 305)",
        "building": "Block B",
        "floor": "3rd Floor",
        "department": "Electronics and Communication Engineering",
        "nearest_node": "ECE Lab"
    },
    "A-01": {
        "room_number": "A-01",
        "name": "Administrative Counter",
        "building": "Admin Block",
        "floor": "Ground Floor",
        "department": "Administration",
        "nearest_node": "Administrative Office"
    },
    "A-101": {
        "room_number": "A-101",
        "name": "Principal Office",
        "building": "Admin Block",
        "floor": "1st Floor",
        "department": "Administration",
        "nearest_node": "Principal Office"
    },
    "A-210": {
        "room_number": "A-210",
        "name": "Seminar Hall",
        "building": "Block A",
        "floor": "2nd Floor",
        "department": "General Academic",
        "nearest_node": "Seminar Hall"
    }
}
`,
  },
  {
    filename: 'bfs_pathfinder.py',
    language: 'python',
    description: 'Breadth-First Search (BFS) pathfinder that builds an adjacency list and finds the shortest route step-by-step.',
    code: `"""
bfs_pathfinder.py
Shortest Path Computation on Campus Graph using Breadth-First Search (BFS).
BFS guarantees the shortest path (minimum edge hops) in unweighted/unit graphs.
"""

from collections import deque
from campus_data import CAMPUS_NODES, CAMPUS_EDGES

def build_adjacency_list():
    """Builds an adjacency dictionary mapping each node to its outgoing edges."""
    adj = {node_id: [] for node_id in CAMPUS_NODES}
    for edge in CAMPUS_EDGES:
        from_node = edge["from"]
        if from_node not in adj:
            adj[from_node] = []
        adj[from_node].append(edge)
    return adj

def find_shortest_path_bfs(start_node, target_node):
    """
    Executes BFS from start_node to target_node.
    Returns:
        dict containing:
            found (bool)
            path (list of node names)
            steps (list of step instructions)
            total_distance (meters)
            walking_time (minutes)
            formatted_text (str)
    """
    if start_node not in CAMPUS_NODES or target_node not in CAMPUS_NODES:
        return {
            "found": False,
            "formatted_text": "Sorry, I couldn't find that location in the campus database."
        }

    if start_node == target_node:
        loc = CAMPUS_NODES[start_node]
        return {
            "found": True,
            "path": [start_node],
            "steps": [],
            "total_distance": 0,
            "walking_time": 0,
            "formatted_text": (
                f"Starting Point: {start_node}\\n"
                f"Destination: {target_node}\\n\\n"
                f"You are already at {loc['name']} ({loc['building']}, {loc['floor']}).\\n"
                f"Estimated distance: 0 meters\\n"
                f"Estimated walking time: 0 minutes"
            )
        }

    adj = build_adjacency_list()
    queue = deque([start_node])
    visited = {start_node}
    parent_map = {}  # child -> (parent_node, edge_data)

    reached = False

    while queue:
        current = queue.popleft()
        if current == target_node:
            reached = True
            break

        for edge in adj.get(current, []):
            neighbor = edge["to"]
            if neighbor not in visited:
                visited.add(neighbor)
                parent_map[neighbor] = (current, edge)
                queue.append(neighbor)
                if neighbor == target_node:
                    reached = True
                    break

        if reached:
            break

    if not reached:
        return {
            "found": False,
            "formatted_text": f"No accessible path found between {start_node} and {target_node}."
        }

    # Backtrack path from target to start
    path = [target_node]
    steps = []
    curr = target_node

    while curr != start_node:
        parent_node, edge_info = parent_map[curr]
        steps.insert(0, {
            "from": parent_node,
            "to": curr,
            "instruction": edge_info["instruction"],
            "distance": edge_info["distance"]
        })
        curr = parent_node
        path.insert(0, curr)

    total_distance = sum(s["distance"] for s in steps)
    # Walking speed assumption: ~70 meters per minute (1.16 m/s)
    walking_time = max(1, round(total_distance / 70, 1))

    # Build response format
    start_info = CAMPUS_NODES[start_node]
    target_info = CAMPUS_NODES[target_node]

    lines = [
        f"Starting Point: {start_info['name']}",
        f"Destination: {target_info['name']} ({target_info['building']}, {target_info['floor']})",
        "Shortest Route:"
    ]
    for idx, step in enumerate(steps, 1):
        lines.append(f"{idx}. {step['instruction']} ({step['distance']}m)")

    lines.append("")
    lines.append(f"Estimated distance: {total_distance} meters")
    lines.append(f"Estimated walking time: {walking_time} minute{'s' if walking_time != 1 else ''}")

    return {
        "found": True,
        "path": path,
        "steps": steps,
        "total_distance": total_distance,
        "walking_time": walking_time,
        "formatted_text": "\\n".join(lines)
    }
`,
  },
  {
    filename: 'campus_nlp.py',
    language: 'python',
    description: 'Rule & keyword-based Natural Language Processing classifier for Intent Classification and Entity Extraction.',
    code: `"""
campus_nlp.py
Natural Language Processing & Intent Classifier for Campus Navigation.
Implements Rule-Based Tokenization, Intent Classification, and Room/Endpoint Extraction.
"""

import re
from campus_data import CAMPUS_NODES, ROOM_DATABASE
from bfs_pathfinder import find_shortest_path_bfs

INTENTS = {
    "DIRECTIONS": [
        "how can i reach", "how to reach", "how do i go", "how to go",
        "directions to", "route to", "path to", "navigate to", "way to",
        "from", "reach", "route", "direction"
    ],
    "LOCATION": [
        "where is", "where are", "locate", "location of", "find",
        "which floor", "which building", "room number"
    ],
    "TIMING": [
        "timings", "timing", "hours", "when is", "when does",
        "opening time", "closing time", "curfew", "schedule"
    ],
    "GENERAL": [
        "what is near", "near", "around", "beside", "adjacent to",
        "tell me about", "about", "info", "help", "facilities"
    ]
}

def extract_room_number(query):
    """Detects room numbers like 'Room 205', '205', '101', 'A-101'."""
    pattern = r'\\b(?:room\\s*(?:no\\.?|number|#)?\\s*([a-zA-Z]?[-0-9]{2,5})|([a-zA-Z]-[0-9]{2,4}))\\b'
    match = re.search(pattern, query, re.IGNORECASE)
    if match:
        cand = (match.group(1) or match.group(2)).upper()
        if cand in ROOM_DATABASE:
            return cand
        num_only = re.sub(r'[^0-9]', '', cand)
        if num_only in ROOM_DATABASE:
            return num_only
        return cand

    for r_num in ROOM_DATABASE:
        if re.search(r'\\b' + r_num + r'\\b', query, re.IGNORECASE):
            return r_num
    return None

def normalize_campus_location(query):
    """Maps informal text (e.g., 'cse lab', 'canteen') to a valid node key."""
    if not query:
        return None
    clean = re.sub(r'[^a-zA-Z0-9\\s]', '', query).strip().lower()

    # Direct match
    for node_id, data in CAMPUS_NODES.items():
        if node_id.lower() == clean:
            return node_id
        for kw in data["keywords"]:
            if kw in clean:
                return node_id

    # Fallback heuristics
    if "cse" in clean and "lab" in clean: return "CSE Lab 1"
    if "aiml" in clean and "lab" in clean: return "AIML Lab"
    if "ece" in clean and "lab" in clean: return "ECE Lab"
    if "cse" in clean: return "CSE Department"
    if "aiml" in clean or "ai" in clean: return "AIML Department"
    if "ece" in clean: return "ECE Department"
    if "lib" in clean: return "Library"
    if "cant" in clean or "food" in clean: return "Canteen"
    if "hostel" in clean: return "Hostel"
    if "admin" in clean: return "Administrative Office"
    if "principal" in clean: return "Principal Office"
    if "seminar" in clean: return "Seminar Hall"
    if "audi" in clean: return "Auditorium"
    if "sports" in clean: return "Sports Complex"
    if "lawn" in clean: return "Central Lawn"
    if "gate" in clean: return "Main Gate"
    if "park" in clean: return "Parking Area"
    return None

def classify_intent(query):
    """Classifies user query into DIRECTIONS, LOCATION, TIMING, GENERAL, or UNKNOWN."""
    lower_q = query.lower()
    scores = {intent: 0 for intent in INTENTS}

    for intent, kws in INTENTS.items():
        for kw in kws:
            if kw in lower_q:
                scores[intent] += len(kw.split())

    best_intent = max(scores, key=scores.get)
    if scores[best_intent] == 0:
        return "UNKNOWN"
    return best_intent

def process_query(query):
    """Processes user query and returns structured chatbot response."""
    room_no = extract_room_number(query)
    intent = classify_intent(query)
    lower_q = query.lower()

    # Room Lookup
    if room_no:
        if room_no in ROOM_DATABASE:
            room = ROOM_DATABASE[room_no]
            nearest_node = room["nearest_node"]
            bfs = find_shortest_path_bfs("Main Gate", nearest_node)
            return (
                f"Location: {room['name']}\\n"
                f"Building: {room['building']}\\n"
                f"Floor: {room['floor']}\\n"
                f"Department: {room['department']}\\n\\n"
                f"Directions from Main Gate:\\n"
                f"{bfs['formatted_text']}"
            )
        else:
            return "Sorry, I couldn't find that location in the campus database."

    # Directions
    if intent == "DIRECTIONS" or "reach" in lower_q or "from" in lower_q:
        start_node = "Main Gate"
        dest_node = None

        from_to = re.search(r'from\\s+([a-z0-9\\s-]+?)\\s+to\\s+([a-z0-9\\s-]+)', lower_q)
        if from_to:
            start_node = normalize_campus_location(from_to.group(1)) or "Main Gate"
            dest_node = normalize_campus_location(from_to.group(2))
        else:
            dest_node = normalize_campus_location(query)

        if not dest_node:
            return "Sorry, I couldn't find that location in the campus database."

        bfs = find_shortest_path_bfs(start_node, dest_node)
        return bfs["formatted_text"]

    # Location
    if intent == "LOCATION" or "where" in lower_q:
        target = normalize_campus_location(query)
        if not target:
            return "Sorry, I couldn't find that location in the campus database."
        node = CAMPUS_NODES[target]
        bfs = find_shortest_path_bfs("Main Gate", target)
        return (
            f"Location: {node['name']}\\n"
            f"Building: {node['building']}\\n"
            f"Floor: {node['floor']}\\n"
            f"Description: {node['description']}\\n\\n"
            f"Shortest Route from Main Gate:\\n"
            f"{bfs['formatted_text']}"
        )

    # Timing
    if intent == "TIMING":
        target = normalize_campus_location(query)
        if target:
            node = CAMPUS_NODES[target]
            return f"Timings for {node['name']}: {node.get('timings', '8:30 AM - 5:00 PM')}"
        return "Sorry, I couldn't find that location in the campus database."

    # General / Neighbors
    if "near" in lower_q:
        target = normalize_campus_location(query)
        if target:
            from campus_data import CAMPUS_EDGES
            neighbors = [e["to"] for e in CAMPUS_EDGES if e["from"] == target]
            return f"Locations near {target}:\\n" + "\\n".join(f"• {n}" for n in set(neighbors))

    return "Sorry, I couldn't find that location in the campus database."
`,
  },
  {
    filename: 'app.py',
    language: 'python',
    description: 'Main Python program offering both an interactive Terminal CLI interface and a Flask REST API backend.',
    code: `"""
app.py
Main Application Runner
Supports both Command-Line Interface (CLI) and Flask Web API.
"""

import sys
from campus_nlp import process_query

def run_cli():
    print("=" * 60)
    print("   COLLEGE CAMPUS NAVIGATION CHATBOT (B.Tech Project)   ")
    print("=" * 60)
    print("Commands:")
    print(" - 'quit' or 'exit' to terminate")
    print(" - Try: 'Where is CSE Lab?', 'Where is Room 205?', 'How to reach Canteen?'")
    print("-" * 60)

    while True:
        try:
            user_input = input("\\nStudent: ").strip()
            if not user_input:
                continue
            if user_input.lower() in ["quit", "exit"]:
                print("Goodbye!")
                break
            response = process_query(user_input)
            print("\\nBot:")
            print(response)
        except (KeyboardInterrupt, EOFError):
            print("\\nSession ended.")
            break

def run_flask():
    try:
        from flask import Flask, request, jsonify
        from flask_cors import CORS
    except ImportError:
        print("Flask is not installed. Run: pip install flask flask-cors")
        return

    app = Flask(__name__)
    CORS(app)

    @app.route("/api/chat", methods=["POST"])
    def chat_endpoint():
        data = request.get_json() or {}
        query = data.get("query", "")
        reply = process_query(query)
        return jsonify({"query": query, "reply": reply})

    print("Starting Flask server on http://localhost:5000 ...")
    app.run(port=5000, debug=True)

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--server":
        run_flask()
    else:
        run_cli()
`,
  },
  {
    filename: 'requirements.txt',
    language: 'text',
    description: 'Minimal Python dependencies for local testing.',
    code: `flask==3.0.3
flask-cors==4.0.1
`,
  },
  {
    filename: 'README.md',
    language: 'markdown',
    description: 'Comprehensive setup guide and viva explanation for project presentation.',
    code: `# Campus Navigation Chatbot (B.Tech Project)

An intelligent campus navigation chatbot designed to assist new students, visitors, and faculty in locating classrooms, laboratories, departments, canteens, libraries, and hostels across a college campus.

---

## 1. Project Overview & Architecture

- **Graph-Based Campus Representation**: The college is modeled as a mathematical graph $G = (V, E)$, where:
  - $V$ (Vertices/Nodes): Buildings, departments, labs, classrooms, gates, facilities.
  - $E$ (Edges): Interconnecting pathways, covered corridors, staircases, elevators with measured distance in meters.
- **Pathfinding via BFS (Breadth-First Search)**:
  - Unweighted/unit-hop shortest path search guaranteeing minimum transitions.
  - Time Complexity: $O(V + E)$
  - Space Complexity: $O(V)$
- **AI Intent Classification**:
  - Rule-based keyword matching and regular expressions.
  - Intents supported: \`DIRECTIONS\`, \`LOCATION\`, \`TIMING\`, \`GENERAL\`, \`UNKNOWN\`.
- **Entity Extraction**:
  - Extracts Room numbers (\`Room 205\`, \`Room 101\`), source nodes, and destination nodes.

---

## 2. How to Run Locally

### Prerequisites
- Python 3.8 or higher installed on your computer.

### Step 1: Clone or Copy Source Files
Place \`campus_data.py\`, \`bfs_pathfinder.py\`, \`campus_nlp.py\`, and \`app.py\` into a directory named \`campus-navigation-chatbot\`.

### Step 2: Run in CLI (Command-Line) Mode
No external libraries needed for CLI mode!
\`\`\`bash
python app.py
\`\`\`

### Step 3: Run as Web API (Flask)
\`\`\`bash
pip install -r requirements.txt
python app.py --server
\`\`\`
The server will start at \`http://localhost:5000\`.

---

## 3. Sample Queries & Outputs

1. **"Where is CSE Lab?"**
   - Intent: \`LOCATION\`
   - Identifies: Block A, 1st Floor, Room 101.
   - Shows complete route from Main Gate.

2. **"Where is Room 205?"**
   - Intent: \`LOCATION\` / Room Lookup
   - Identifies: Block B, 2nd Floor (AIML Lab).
   - Generates step-by-step route from Main Gate.

3. **"How do I go from main gate to the CSE block?"**
   - Intent: \`DIRECTIONS\`
   - Route: Main Gate → Central Lawn → Block A → CSE Department.

4. **"What are the library timings?"**
   - Intent: \`TIMING\`
   - Returns: 8:30 AM - 8:00 PM (Mon-Sat).

5. **"Where is the Mars Lab?"**
   - Output: \`Sorry, I couldn't find that location in the campus database.\`

---

## 4. Key Viva Questions & Answers

**Q1: Why did you choose BFS instead of DFS?**
- BFS traverses level-by-level using a FIFO Queue. It is mathematically guaranteed to discover the shortest unweighted path (minimum number of hallway hops) before exploring longer paths. DFS would wander deep into one wing and produce an unnecessarily convoluted route.

**Q2: How does the intent classifier work?**
- The classifier tokenizes the input query, checks for domain keywords (\`where\`, \`reach\`, \`timings\`, \`near\`), matches regular expressions for room numbers (\`Room 205\`), and scores each intent.
`,
  },
];
