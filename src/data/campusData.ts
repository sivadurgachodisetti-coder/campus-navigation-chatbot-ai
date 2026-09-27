export interface CampusNode {
  id: string;
  name: string;
  building: string;
  floor: string;
  room?: string;
  type: 'gate' | 'building' | 'department' | 'lab' | 'classroom' | 'library' | 'canteen' | 'office' | 'hall' | 'hostel' | 'facility' | 'landmark';
  description: string;
  timings?: string;
  keywords: string[];
  x: number; // coordinate for map SVG (viewBox 0..1000)
  y: number; // coordinate for map SVG (viewBox 0..700)
}

export interface CampusEdge {
  from: string;
  to: string;
  distance: number; // in meters
  instruction: string;
}

export interface RoomDetail {
  roomNumber: string;
  name: string;
  building: string;
  floor: string;
  department: string;
  description: string;
  nearestNodeId: string;
}

export const CAMPUS_NODES: Record<string, CampusNode> = {
  'Main Gate': {
    id: 'Main Gate',
    name: 'Main Gate',
    building: 'Entrance',
    floor: 'Ground Floor',
    type: 'gate',
    description: 'Campus main security entrance, visitor pass verification counter, and campus transit drop-off point.',
    timings: 'Open 24/7 (Security Check)',
    keywords: ['main gate', 'gate', 'entrance', 'security', 'entry', 'college gate'],
    x: 120,
    y: 540,
  },
  'Parking Area': {
    id: 'Parking Area',
    name: 'Parking Area',
    building: 'Parking Zone',
    floor: 'Ground Floor',
    type: 'facility',
    description: 'Spacious student, staff, and visitor parking lot with dedicated two-wheeler and four-wheeler bays.',
    timings: '6:00 AM - 10:00 PM',
    keywords: ['parking', 'parking area', 'bike parking', 'car parking', 'vehicle'],
    x: 140,
    y: 380,
  },
  'Administrative Office': {
    id: 'Administrative Office',
    name: 'Administrative Office',
    building: 'Admin Block',
    floor: 'Ground Floor',
    room: 'A-01',
    type: 'office',
    description: 'Admissions counter, fee payments, student verification, scholarships, and academic documentation.',
    timings: '9:00 AM - 5:00 PM (Mon-Sat)',
    keywords: ['admin office', 'administrative office', 'admin', 'fees counter', 'admissions', 'fee', 'office'],
    x: 270,
    y: 490,
  },
  'Principal Office': {
    id: 'Principal Office',
    name: 'Principal Office',
    building: 'Admin Block',
    floor: '1st Floor',
    room: 'A-101',
    type: 'office',
    description: 'Executive chamber of the College Principal and Academic Advisory Council conference room.',
    timings: '10:00 AM - 4:00 PM (By Appointment)',
    keywords: ['principal office', 'principal', 'head of institution', 'director', 'principal room'],
    x: 270,
    y: 410,
  },
  'Central Lawn': {
    id: 'Central Lawn',
    name: 'Central Lawn',
    building: 'Central Plaza',
    floor: 'Ground Floor',
    type: 'landmark',
    description: 'Central lush green open quadrangle with shaded stone benches, connecting academic blocks and library.',
    timings: 'Open all day',
    keywords: ['central lawn', 'lawn', 'garden', 'quadrangle', 'central plaza', 'fountain', 'courtyard'],
    x: 430,
    y: 410,
  },
  'Block A': {
    id: 'Block A',
    name: 'Block A',
    building: 'Block A',
    floor: 'Ground Floor',
    type: 'building',
    description: 'Primary academic building housing Computer Science Department, Central Library, and Seminar Hall.',
    timings: '8:00 AM - 7:00 PM',
    keywords: ['block a', 'a block', 'building a', 'academic block a'],
    x: 430,
    y: 260,
  },
  'Library': {
    id: 'Library',
    name: 'Central Library',
    building: 'Block A',
    floor: 'Ground Floor',
    room: 'A-G05',
    type: 'library',
    description: '3-tier Central Library with over 50,000 volumes, e-journal terminals, quiet study carrels, and digital repository.',
    timings: '8:30 AM - 8:00 PM (Mon-Sat), 9:00 AM - 2:00 PM (Sun)',
    keywords: ['library', 'central library', 'books', 'reading room', 'study room', 'digital library'],
    x: 340,
    y: 230,
  },
  'CSE Department': {
    id: 'CSE Department',
    name: 'CSE Department',
    building: 'Block A',
    floor: '1st Floor',
    room: 'A-102',
    type: 'department',
    description: 'Department of Computer Science and Engineering, HOD Office, faculty cubicles, and project lab.',
    timings: '9:00 AM - 5:00 PM (Mon-Sat)',
    keywords: ['cse department', 'cse dept', 'computer science', 'cse', 'cs department', 'cs dept'],
    x: 430,
    y: 170,
  },
  'CSE Lab 1': {
    id: 'CSE Lab 1',
    name: 'CSE Lab 1',
    building: 'Block A',
    floor: '1st Floor',
    room: '101',
    type: 'lab',
    description: 'High-performance programming lab configured for Data Structures, Algorithms, and Linux Operating Systems.',
    timings: '9:00 AM - 5:00 PM',
    keywords: ['cse lab 1', 'cse lab', 'computer lab 1', 'coding lab', 'lab 1', 'room 101', '101'],
    x: 350,
    y: 130,
  },
  'CSE Lab 2': {
    id: 'CSE Lab 2',
    name: 'CSE Lab 2',
    building: 'Block A',
    floor: '1st Floor',
    room: '105',
    type: 'lab',
    description: 'Advanced Cloud Computing, Web Technologies, and Network Security laboratory with gigabit fiber backbone.',
    timings: '9:00 AM - 5:00 PM',
    keywords: ['cse lab 2', 'computer lab 2', 'cloud lab', 'lab 2', 'room 105', '105'],
    x: 480,
    y: 120,
  },
  'Seminar Hall': {
    id: 'Seminar Hall',
    name: 'Seminar Hall',
    building: 'Block A',
    floor: '2nd Floor',
    room: 'A-210',
    type: 'hall',
    description: 'Acoustically treated air-conditioned hall for technical paper presentations, hackathons, and guest lectures.',
    timings: '9:00 AM - 6:00 PM (Event Based)',
    keywords: ['seminar hall', 'seminar', 'conference hall', 'a-210', 'room 210'],
    x: 520,
    y: 210,
  },
  'Block B': {
    id: 'Block B',
    name: 'Block B',
    building: 'Block B',
    floor: 'Ground Floor',
    type: 'building',
    description: 'Academic Block B housing Artificial Intelligence & Machine Learning (AIML) and Electronics (ECE) departments.',
    timings: '8:00 AM - 7:00 PM',
    keywords: ['block b', 'b block', 'building b', 'academic block b'],
    x: 650,
    y: 330,
  },
  'AIML Department': {
    id: 'AIML Department',
    name: 'AIML Department',
    building: 'Block B',
    floor: '2nd Floor',
    room: 'B-201',
    type: 'department',
    description: 'Department of Artificial Intelligence & Machine Learning, faculty chambers, and neural compute hub.',
    timings: '9:00 AM - 5:00 PM (Mon-Sat)',
    keywords: ['aiml department', 'ai ml department', 'aiml dept', 'ai dept', 'artificial intelligence department', 'aiml'],
    x: 680,
    y: 240,
  },
  'AIML Lab': {
    id: 'AIML Lab',
    name: 'AIML Lab',
    building: 'Block B',
    floor: '2nd Floor',
    room: '205',
    type: 'lab',
    description: 'Deep Learning and Computer Vision lab powered by dedicated NVIDIA GPU workstations and robotic kits.',
    timings: '9:00 AM - 5:30 PM',
    keywords: ['aiml lab', 'ai lab', 'machine learning lab', 'ml lab', 'gpu lab', 'room 205', '205'],
    x: 760,
    y: 200,
  },
  'Room 205': {
    id: 'Room 205',
    name: 'Room 205 (AIML Lab)',
    building: 'Block B',
    floor: '2nd Floor',
    room: '205',
    type: 'classroom',
    description: 'Multimedia smart classroom and AIML deep learning laboratory equipped with projector and surround audio.',
    timings: '8:30 AM - 5:00 PM',
    keywords: ['room 205', '205', 'classroom 205', 'b205', 'b-205'],
    x: 770,
    y: 220,
  },
  'Room 101': {
    id: 'Room 101',
    name: 'Room 101 (CSE Lab 1)',
    building: 'Block A',
    floor: '1st Floor',
    room: '101',
    type: 'classroom',
    description: 'First floor lecture and laboratory hall for Computer Science core subjects.',
    timings: '8:30 AM - 5:00 PM',
    keywords: ['room 101', '101', 'classroom 101', 'a101', 'a-101'],
    x: 360,
    y: 110,
  },
  'ECE Department': {
    id: 'ECE Department',
    name: 'ECE Department',
    building: 'Block B',
    floor: '3rd Floor',
    room: 'B-301',
    type: 'department',
    description: 'Department of Electronics and Communication Engineering, VLSI research unit, and antenna design lab.',
    timings: '9:00 AM - 5:00 PM (Mon-Sat)',
    keywords: ['ece department', 'ece dept', 'electronics department', 'ece', 'electronics'],
    x: 640,
    y: 140,
  },
  'ECE Lab': {
    id: 'ECE Lab',
    name: 'ECE Lab',
    building: 'Block B',
    floor: '3rd Floor',
    room: '305',
    type: 'lab',
    description: 'Microcontroller, Embedded Systems, IoT, and Digital Signal Processing practical experimentation facility.',
    timings: '9:00 AM - 5:00 PM',
    keywords: ['ece lab', 'electronics lab', 'embedded lab', 'iot lab', 'room 305', '305'],
    x: 730,
    y: 130,
  },
  'Auditorium': {
    id: 'Auditorium',
    name: 'Auditorium',
    building: 'Central Complex',
    floor: 'Ground Floor',
    type: 'hall',
    description: 'Grand 1,200-seat central auditorium for annual day celebrations, international conferences, and orientations.',
    timings: '9:00 AM - 7:00 PM (Scheduled Events)',
    keywords: ['auditorium', 'audi', 'main hall', 'cultural hall'],
    x: 580,
    y: 470,
  },
  'Canteen': {
    id: 'Canteen',
    name: 'Campus Canteen',
    building: 'Cafeteria Complex',
    floor: 'Ground Floor',
    type: 'canteen',
    description: 'Vibrant college food court offering healthy South & North Indian meals, bakery snacks, fruit juices, and tea/coffee.',
    timings: '7:30 AM - 8:30 PM (Daily)',
    keywords: ['canteen', 'cafeteria', 'food court', 'mess', 'cafe', 'snacks', 'lunch', 'breakfast'],
    x: 700,
    y: 530,
  },
  'Hostel': {
    id: 'Hostel',
    name: 'Hostel Block',
    building: 'Hostel Zone',
    floor: 'Blocks H1 & G1',
    type: 'hostel',
    description: 'Student residential village including Boys Hostel (H1-H3), Girls Hostel (G1), dining halls, and indoor sports room.',
    timings: 'Curfew: 9:30 PM (Gate closes)',
    keywords: ['hostel', 'hostels', 'boys hostel', 'girls hostel', 'dormitory', 'dorm', 'residence'],
    x: 870,
    y: 460,
  },
  'Sports Complex': {
    id: 'Sports Complex',
    name: 'Sports Complex',
    building: 'Sports Arena',
    floor: 'Ground Floor',
    type: 'facility',
    description: 'State-of-the-art sports arena featuring outdoor basketball court, volleyball ground, cricket nets, and fitness gym.',
    timings: '6:00 AM - 8:30 AM & 4:30 PM - 8:00 PM',
    keywords: ['sports complex', 'sports', 'playground', 'gym', 'ground', 'basketball court', 'cricket ground'],
    x: 860,
    y: 300,
  },
};

export const CAMPUS_EDGES: CampusEdge[] = [
  // From Main Gate
  { from: 'Main Gate', to: 'Parking Area', distance: 50, instruction: 'Walk past the security checkpoint towards the east parking bays' },
  { from: 'Parking Area', to: 'Main Gate', distance: 50, instruction: 'Walk back along the entrance drive to the Main Gate' },

  { from: 'Main Gate', to: 'Administrative Office', distance: 75, instruction: 'Take the paved pedestrian walkway straight towards the Admin Block' },
  { from: 'Administrative Office', to: 'Main Gate', distance: 75, instruction: 'Follow the main path south back to the Main Gate' },

  { from: 'Main Gate', to: 'Central Lawn', distance: 130, instruction: 'Walk straight up the grand avenue boulevard into the Central Lawn' },
  { from: 'Central Lawn', to: 'Main Gate', distance: 130, instruction: 'Head south past the fountain along the boulevard to the Main Gate' },

  // Admin Block Connections
  { from: 'Administrative Office', to: 'Principal Office', distance: 20, instruction: 'Take the interior stairs or elevator to the 1st Floor' },
  { from: 'Principal Office', to: 'Administrative Office', distance: 20, instruction: 'Head down the internal stairs to the ground floor reception' },

  { from: 'Administrative Office', to: 'Central Lawn', distance: 80, instruction: 'Exit the Admin foyer east into the Central Lawn quadrangle' },
  { from: 'Central Lawn', to: 'Administrative Office', distance: 80, instruction: 'Walk west across the lawn to the Admin Block entrance' },

  { from: 'Administrative Office', to: 'Block A', distance: 95, instruction: 'Take the covered western colonnade pathway leading to Block A' },
  { from: 'Block A', to: 'Administrative Office', distance: 95, instruction: 'Follow the colonnade pathway south to the Admin Block' },

  // Central Lawn Connections
  { from: 'Central Lawn', to: 'Block A', distance: 60, instruction: 'Walk north across the central lawn to the main lobby of Block A' },
  { from: 'Block A', to: 'Central Lawn', distance: 60, instruction: 'Exit Block A south directly into the Central Lawn quadrangle' },

  { from: 'Central Lawn', to: 'Block B', distance: 75, instruction: 'Walk northeast towards the main double-door entrance of Block B' },
  { from: 'Block B', to: 'Central Lawn', distance: 75, instruction: 'Exit Block B southwest into the central lawn' },

  { from: 'Central Lawn', to: 'Auditorium', distance: 70, instruction: 'Walk east past the ornamental fountain toward the Auditorium' },
  { from: 'Auditorium', to: 'Central Lawn', distance: 70, instruction: 'Walk west away from the Auditorium steps into the Central Lawn' },

  { from: 'Central Lawn', to: 'Canteen', distance: 95, instruction: 'Follow the shaded tree path toward the Cafeteria Complex' },
  { from: 'Canteen', to: 'Central Lawn', distance: 95, instruction: 'Walk northwest back to the Central Lawn' },

  // Block A Internal & Immediate Connections
  { from: 'Block A', to: 'Library', distance: 25, instruction: 'Enter Block A ground floor foyer; Central Library is on your left' },
  { from: 'Library', to: 'Block A', distance: 25, instruction: 'Exit the Library into the central Block A ground floor lobby' },

  { from: 'Block A', to: 'CSE Department', distance: 40, instruction: 'Take the central staircase or elevator to the 1st Floor' },
  { from: 'CSE Department', to: 'Block A', distance: 40, instruction: 'Take the stairs or elevator down to the ground floor foyer' },

  { from: 'CSE Department', to: 'CSE Lab 1', distance: 25, instruction: 'Turn left along the 1st floor corridor to Room 101 (CSE Lab 1)' },
  { from: 'CSE Lab 1', to: 'CSE Department', distance: 25, instruction: 'Walk back down the corridor to the CSE Department HOD office' },

  { from: 'CSE Department', to: 'CSE Lab 2', distance: 30, instruction: 'Follow the 1st floor corridor right towards Room 105 (CSE Lab 2)' },
  { from: 'CSE Lab 2', to: 'CSE Department', distance: 30, instruction: 'Return along the east wing corridor to the CSE Department office' },

  { from: 'CSE Department', to: 'Seminar Hall', distance: 45, instruction: 'Ascend the flight of stairs to the 2nd Floor of Block A' },
  { from: 'Seminar Hall', to: 'CSE Department', distance: 45, instruction: 'Descend the stairs to the 1st Floor Computer Science wing' },

  { from: 'CSE Lab 1', to: 'Room 101', distance: 5, instruction: 'Step directly into Room 101' },
  { from: 'Room 101', to: 'CSE Lab 1', distance: 5, instruction: 'Exit Room 101 into the lab foyer' },

  // Block A to Block B Connector Skybridge
  { from: 'Block A', to: 'Block B', distance: 85, instruction: 'Cross the shaded central walkway linking Block A and Block B' },
  { from: 'Block B', to: 'Block A', distance: 85, instruction: 'Take the central walkway across to Block A' },

  { from: 'CSE Department', to: 'AIML Department', distance: 90, instruction: 'Cross the 1st/2nd floor inter-block connecting skybridge' },
  { from: 'AIML Department', to: 'CSE Department', distance: 90, instruction: 'Cross the skybridge west back into Block A 1st Floor' },

  // Block B Internal Connections
  { from: 'Block B', to: 'AIML Department', distance: 45, instruction: 'Take the main staircase or lift in Block B to the 2nd Floor' },
  { from: 'AIML Department', to: 'Block B', distance: 45, instruction: 'Take the lift or staircase down to Block B ground floor' },

  { from: 'AIML Department', to: 'AIML Lab', distance: 20, instruction: 'Follow the 2nd floor corridor right to Room 205 (AIML Lab)' },
  { from: 'AIML Lab', to: 'AIML Department', distance: 20, instruction: 'Walk back along the 2nd floor corridor to AIML Dept Office' },

  { from: 'AIML Lab', to: 'Room 205', distance: 5, instruction: 'Step directly into Room 205' },
  { from: 'Room 205', to: 'AIML Lab', distance: 5, instruction: 'Exit Room 205 into the corridor' },

  { from: 'Block B', to: 'ECE Department', distance: 55, instruction: 'Take the elevator or stairs up to the 3rd Floor' },
  { from: 'ECE Department', to: 'Block B', distance: 55, instruction: 'Take the elevator or stairs down to the ground floor' },

  { from: 'AIML Department', to: 'ECE Department', distance: 25, instruction: 'Take the staircase up one level to the 3rd Floor' },
  { from: 'ECE Department', to: 'AIML Department', distance: 25, instruction: 'Take the staircase down one level to the 2nd Floor' },

  { from: 'ECE Department', to: 'ECE Lab', distance: 20, instruction: 'Proceed down the 3rd floor west corridor to Room 305 (ECE Lab)' },
  { from: 'ECE Lab', to: 'ECE Department', distance: 20, instruction: 'Return down the corridor to the ECE Department office' },

  // Auditorium & Canteen & Hostels
  { from: 'Auditorium', to: 'Canteen', distance: 55, instruction: 'Follow the paved pathway behind the Auditorium to the Canteen' },
  { from: 'Canteen', to: 'Auditorium', distance: 55, instruction: 'Walk along the pathway toward the main Auditorium entrance' },

  { from: 'Canteen', to: 'Hostel', distance: 90, instruction: 'Walk east along the residential avenue towards the Hostel complex' },
  { from: 'Hostel', to: 'Canteen', distance: 90, instruction: 'Walk west down the residential avenue to the Campus Canteen' },

  { from: 'Hostel', to: 'Sports Complex', distance: 70, instruction: 'Walk north along the outdoor fitness trail to the Sports Complex' },
  { from: 'Sports Complex', to: 'Hostel', distance: 70, instruction: 'Walk south along the fitness trail towards the Hostel Block' },

  { from: 'Block B', to: 'Sports Complex', distance: 110, instruction: 'Follow the eastern perimeter road to the Sports Complex courts' },
  { from: 'Sports Complex', to: 'Block B', distance: 110, instruction: 'Walk west past the tennis courts toward Block B' },
];

export const ROOM_DATABASE: Record<string, RoomDetail> = {
  '101': {
    roomNumber: '101',
    name: 'CSE Lab 1 & Classroom 101',
    building: 'Block A',
    floor: '1st Floor',
    department: 'Computer Science and Engineering',
    description: 'High-performance computing lab equipped with Linux workstations for programming.',
    nearestNodeId: 'CSE Lab 1',
  },
  '102': {
    roomNumber: '102',
    name: 'Classroom 102',
    building: 'Block A',
    floor: '1st Floor',
    department: 'Computer Science and Engineering',
    description: 'Tiered lecture theater for 2nd year CSE lectures with smart podium.',
    nearestNodeId: 'CSE Department',
  },
  '105': {
    roomNumber: '105',
    name: 'CSE Lab 2 (Cloud Computing)',
    building: 'Block A',
    floor: '1st Floor',
    department: 'Computer Science and Engineering',
    description: 'Specialized lab for cloud systems, web technology, and network simulations.',
    nearestNodeId: 'CSE Lab 2',
  },
  '201': {
    roomNumber: '201',
    name: 'AIML Faculty Chamber & Seminar Room',
    building: 'Block B',
    floor: '2nd Floor',
    department: 'Artificial Intelligence & Machine Learning',
    description: 'Faculty advisory rooms and student consultation room.',
    nearestNodeId: 'AIML Department',
  },
  '205': {
    roomNumber: '205',
    name: 'AIML Lab & Smart Classroom 205',
    building: 'Block B',
    floor: '2nd Floor',
    department: 'Artificial Intelligence & Machine Learning',
    description: 'AI & Deep Learning workstation lab with high-end GPUs and smart projector.',
    nearestNodeId: 'AIML Lab',
  },
  '210': {
    roomNumber: '210',
    name: 'Seminar Hall (Room A-210)',
    building: 'Block A',
    floor: '2nd Floor',
    department: 'General Academic',
    description: 'Multi-purpose air-conditioned presentation hall.',
    nearestNodeId: 'Seminar Hall',
  },
  '301': {
    roomNumber: '301',
    name: 'Classroom 301',
    building: 'Block B',
    floor: '3rd Floor',
    department: 'Electronics and Communication Engineering',
    description: 'Lecture classroom for 3rd year ECE students.',
    nearestNodeId: 'ECE Department',
  },
  '305': {
    roomNumber: '305',
    name: 'ECE Lab (Microprocessors & IoT)',
    building: 'Block B',
    floor: '3rd Floor',
    department: 'Electronics and Communication Engineering',
    description: 'Hardware experimentation bench with oscilloscopes, FPGA boards, and IoT sensor kits.',
    nearestNodeId: 'ECE Lab',
  },
  'A-01': {
    roomNumber: 'A-01',
    name: 'Administrative Office Counters',
    building: 'Admin Block',
    floor: 'Ground Floor',
    department: 'Administration',
    description: 'Student services, verification, and fees collection.',
    nearestNodeId: 'Administrative Office',
  },
  'A-101': {
    roomNumber: 'A-101',
    name: 'Principal Chamber',
    building: 'Admin Block',
    floor: '1st Floor',
    department: 'Administration',
    description: 'Office of the Principal and executive meeting room.',
    nearestNodeId: 'Principal Office',
  },
  'A-G05': {
    roomNumber: 'A-G05',
    name: 'Central Library Circulation Desk',
    building: 'Block A',
    floor: 'Ground Floor',
    department: 'Library Services',
    description: 'Book checkout, digital access cards, and reference reading section.',
    nearestNodeId: 'Library',
  },
};
