import { Category, Priority, ComplaintStatus, Role, User, City, Ward, Department, Officer, Complaint, ComplaintCluster, Hotspot } from '../src/types';

export interface DatabaseState {
  users: User[];
  cities: City[];
  wards: Ward[];
  departments: Department[];
  officers: Officer[];
  complaints: Complaint[];
  clusters: ComplaintCluster[];
  hotspots: Hotspot[];
}

export const initialCities: City[] = [
  { id: 'city-1', name: 'New Delhi', state: 'Delhi', country: 'India', lat: 28.6139, lng: 77.2090, created_at: '2026-01-01T00:00:00Z' },
  { id: 'city-2', name: 'Bengaluru', state: 'Karnataka', country: 'India', lat: 12.9716, lng: 77.5946, created_at: '2026-01-01T00:00:00Z' },
  { id: 'city-3', name: 'Mumbai', state: 'Maharashtra', country: 'India', lat: 19.0760, lng: 72.8777, created_at: '2026-01-01T00:00:00Z' },
  { id: 'city-4', name: 'Indore', state: 'Madhya Pradesh', country: 'India', lat: 22.7196, lng: 75.8577, created_at: '2026-01-01T00:00:00Z' },
  { id: 'city-5', name: 'Hyderabad', state: 'Telangana', country: 'India', lat: 17.3850, lng: 78.4867, created_at: '2026-01-01T00:00:00Z' },
];

export const initialWards: Ward[] = [
  { id: 'ward-101', city_id: 'city-1', name: 'Ward 14 - Rohini Sector 9', code: 'DL-W14', lat: 28.7150, lng: 77.1190, created_at: '2026-01-01T00:00:00Z' },
  { id: 'ward-102', city_id: 'city-1', name: 'Ward 28 - Karol Bagh', code: 'DL-W28', lat: 28.6517, lng: 77.1906, created_at: '2026-01-01T00:00:00Z' },
  { id: 'ward-103', city_id: 'city-1', name: 'Ward 45 - Saket & Mehrauli', code: 'DL-W45', lat: 28.5245, lng: 77.2066, created_at: '2026-01-01T00:00:00Z' },
  { id: 'ward-104', city_id: 'city-1', name: 'Ward 62 - Dwarka Sector 6', code: 'DL-W62', lat: 28.5823, lng: 77.0500, created_at: '2026-01-01T00:00:00Z' },
  { id: 'ward-201', city_id: 'city-2', name: 'Ward 150 - Bellandur Tech Corridor', code: 'BLR-W150', lat: 12.9304, lng: 77.6784, created_at: '2026-01-01T00:00:00Z' },
  { id: 'ward-202', city_id: 'city-2', name: 'Ward 174 - HSR Layout Sector 2', code: 'BLR-W174', lat: 12.9116, lng: 77.6389, created_at: '2026-01-01T00:00:00Z' },
  { id: 'ward-203', city_id: 'city-2', name: 'Ward 112 - Indiranagar 100ft Road', code: 'BLR-W112', lat: 12.9784, lng: 77.6408, created_at: '2026-01-01T00:00:00Z' },
  { id: 'ward-301', city_id: 'city-3', name: 'Ward K-West - Andheri West', code: 'MUM-KW', lat: 19.1197, lng: 72.8464, created_at: '2026-01-01T00:00:00Z' },
  { id: 'ward-302', city_id: 'city-3', name: 'Ward H-East - Bandra Kurla Complex', code: 'MUM-HE', lat: 19.0607, lng: 72.8687, created_at: '2026-01-01T00:00:00Z' },
  { id: 'ward-401', city_id: 'city-4', name: 'Ward 33 - Vijay Nagar Main', code: 'IND-W33', lat: 22.7533, lng: 75.8937, created_at: '2026-01-01T00:00:00Z' },
];

export const initialDepartments: Department[] = [
  {
    id: 'dept-1',
    name: 'Municipal Water Supply & Sewerage Board',
    code: 'DJB_WATER',
    city_id: 'city-1',
    category_mapping: [Category.WATER_SUPPLY, Category.DRAINAGE],
    head_officer: 'Er. Rajesh Verma (Chief Engineer)',
    contact_email: 'watersupply.control@civicflow.gov',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'dept-2',
    name: 'Solid Waste Management & Sanitation Dept',
    code: 'MCD_SAN',
    city_id: 'city-1',
    category_mapping: [Category.WASTE_MANAGEMENT, Category.SANITATION],
    head_officer: 'Dr. Sunita Sharma (Director of SWM)',
    contact_email: 'sanitation.ops@civicflow.gov',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'dept-3',
    name: 'Public Works & Roads Engineering Division',
    code: 'PWD_ROADS',
    city_id: 'city-1',
    category_mapping: [Category.ROADS, Category.PUBLIC_INFRASTRUCTURE],
    head_officer: 'Er. Amit Kulkarni (Superintending Engineer)',
    contact_email: 'roads.pwd@civicflow.gov',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'dept-4',
    name: 'Municipal Lighting & Electrical Services',
    code: 'ELEC_GRID',
    city_id: 'city-1',
    category_mapping: [Category.STREET_LIGHTING, Category.ELECTRICITY],
    head_officer: 'Er. Priya Nair (Executive Engineer Electrical)',
    contact_email: 'lighting.grid@civicflow.gov',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'dept-5',
    name: 'Urban Transit & Traffic Operations',
    code: 'TRANSIT_DTC',
    city_id: 'city-1',
    category_mapping: [Category.PUBLIC_TRANSPORT, Category.ENCROACHMENT, Category.OTHER],
    head_officer: 'Vikramaditya Rao (Joint Commissioner)',
    contact_email: 'transit.enforcement@civicflow.gov',
    created_at: '2026-01-01T00:00:00Z',
  },
];

export const initialOfficers: Officer[] = [
  {
    id: 'off-1',
    name: 'Rohan Deshmukh',
    email: 'rohan.deshmukh@civicflow.gov',
    department_id: 'dept-1',
    city_id: 'city-1',
    ward_id: 'ward-101',
    workload: 6,
    status: 'ACTIVE',
    designation: 'Senior Assistant Engineer (Water Distribution)',
    phone: '+91 98100 23456',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'off-2',
    name: 'Ananya Roy',
    email: 'ananya.roy@civicflow.gov',
    department_id: 'dept-2',
    city_id: 'city-1',
    ward_id: 'ward-102',
    workload: 8,
    status: 'ACTIVE',
    designation: 'Sanitary Inspector Grade-I',
    phone: '+91 98200 45678',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'off-3',
    name: 'Kavita Sundaram',
    email: 'kavita.sundaram@civicflow.gov',
    department_id: 'dept-3',
    city_id: 'city-1',
    ward_id: 'ward-103',
    workload: 4,
    status: 'ACTIVE',
    designation: 'Junior Engineer (Road Maintenance & Potholes)',
    phone: '+91 98300 78901',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'off-4',
    name: 'Deepak Saxena',
    email: 'deepak.saxena@civicflow.gov',
    department_id: 'dept-4',
    city_id: 'city-1',
    ward_id: 'ward-104',
    workload: 5,
    status: 'ACTIVE',
    designation: 'Electrical Maintenance Supervisor',
    phone: '+91 98400 12389',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'off-5',
    name: 'Siddharth Mehra',
    email: 'siddharth.mehra@civicflow.gov',
    department_id: 'dept-1',
    city_id: 'city-2',
    ward_id: 'ward-201',
    workload: 7,
    status: 'ACTIVE',
    designation: 'BWSSB Ward Zonal Officer',
    phone: '+91 98500 55432',
    created_at: '2026-01-01T00:00:00Z',
  },
];

export const initialUsers: User[] = [
  {
    id: 'usr-citizen-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    role: Role.CITIZEN,
    city_id: 'city-1',
    phone: '+91 98111 22334',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-01-10T00:00:00Z',
    updated_at: '2026-01-10T00:00:00Z',
  },
  {
    id: 'usr-citizen-2',
    name: 'Pooja Verma',
    email: 'pooja.verma@example.com',
    role: Role.CITIZEN,
    city_id: 'city-1',
    phone: '+91 98222 33445',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-01-12T00:00:00Z',
    updated_at: '2026-01-12T00:00:00Z',
  },
  {
    id: 'usr-admin-roads',
    name: 'Er. Amit Kulkarni',
    email: 'admin.roads@delhi.gov.in',
    role: Role.DEPARTMENT_ADMIN,
    department_id: 'dept-3',
    department_name: 'Public Works & Roads Engineering Division',
    city_id: 'city-1',
    jurisdiction_name: 'Delhi Roads & Infrastructure Division',
    phone: '+91 98333 44556',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'usr-admin-sanitation',
    name: 'Dr. Sunita Sharma',
    email: 'admin.sanitation@delhi.gov.in',
    role: Role.DEPARTMENT_ADMIN,
    department_id: 'dept-2',
    department_name: 'Solid Waste Management & Sanitation Dept',
    city_id: 'city-1',
    jurisdiction_name: 'Delhi Municipal Sanitation Services',
    phone: '+91 98444 55667',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'usr-admin-water',
    name: 'Er. Rajesh Verma',
    email: 'admin.water@delhi.gov.in',
    role: Role.DEPARTMENT_ADMIN,
    department_id: 'dept-1',
    department_name: 'Municipal Water Supply & Sewerage Board',
    city_id: 'city-1',
    jurisdiction_name: 'Delhi Jal & Sewerage Board',
    phone: '+91 98555 66778',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'usr-admin-elec',
    name: 'Er. Priya Nair',
    email: 'admin.electricity@delhi.gov.in',
    role: Role.DEPARTMENT_ADMIN,
    department_id: 'dept-4',
    department_name: 'Municipal Lighting & Electrical Services',
    city_id: 'city-1',
    jurisdiction_name: 'Zonal Electrical Grid Directorate',
    phone: '+91 98666 77889',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'usr-admin-city',
    name: 'Dr. Rajesh Sharma',
    email: 'commissioner@delhi.gov.in',
    role: Role.CITY_ADMIN,
    city_id: 'city-1',
    jurisdiction_name: 'Municipal Corporation General Secretariat',
    phone: '+91 99999 88888',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'usr-officer-1',
    name: 'Rohan Deshmukh',
    email: 'rohan.deshmukh@civicflow.gov',
    role: Role.OFFICER,
    city_id: 'city-1',
    department_id: 'dept-1',
    phone: '+91 98100 23456',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];

export const initialComplaints: Complaint[] = [
  {
    id: 'CF-2026-00421',
    citizen_id: 'usr-citizen-1',
    citizen_name: 'Aarav Sharma',
    citizen_email: 'aarav.sharma@example.com',
    citizen_phone: '+91 98111 22334',
    description: 'मेरे इलाके में चार दिन से कूड़ा नहीं उठा है और बहुत गंदगी हो रही है। बारिश के कारण बदबू फैल रही है।',
    original_language: 'Hindi (हिंदी)',
    normalized_text: 'Garbage has not been collected for four days in our locality resulting in severe unhygienic conditions and odor spread due to rain.',
    category: Category.WASTE_MANAGEMENT,
    subcategory: 'Garbage Collection & Dump Clearance',
    priority: Priority.HIGH,
    severity_score: 0.82,
    city_id: 'city-1',
    city_name: 'New Delhi',
    ward_id: 'ward-102',
    ward_name: 'Ward 28 - Karol Bagh',
    location: 'Near Block 4 Community Market, Karol Bagh',
    latitude: 28.6517,
    longitude: 77.1906,
    duration: '4 days',
    department_id: 'dept-2',
    department_name: 'Solid Waste Management & Sanitation Dept',
    assigned_officer_id: 'off-2',
    assigned_officer_name: 'Ananya Roy',
    status: ComplaintStatus.IN_PROGRESS,
    ai_confidence: 0.96,
    suggested_action: 'Deploy primary compactor truck #DL-04 and 4-member sanitation crew for immediate spot clearance.',
    cluster_id: 'cl-101',
    related_complaints_count: 14,
    created_at: '2026-08-16T08:30:00Z',
    updated_at: '2026-08-17T09:15:00Z',
    history: [
      { id: 'h-1', complaint_id: 'CF-2026-00421', old_status: ComplaintStatus.SUBMITTED, new_status: ComplaintStatus.CLASSIFIED, changed_by: 'CivicFlow AI Engine', timestamp: '2026-08-16T08:30:12Z', comment: 'AI classification: Category=WASTE_MANAGEMENT, Priority=HIGH' },
      { id: 'h-2', complaint_id: 'CF-2026-00421', old_status: ComplaintStatus.CLASSIFIED, new_status: ComplaintStatus.ROUTED, changed_by: 'CivicFlow Routing Engine', timestamp: '2026-08-16T08:30:14Z', comment: 'Auto-routed to Solid Waste Management & Sanitation Dept' },
      { id: 'h-3', complaint_id: 'CF-2026-00421', old_status: ComplaintStatus.ROUTED, new_status: ComplaintStatus.ASSIGNED, changed_by: 'Supervisory Dispatcher', timestamp: '2026-08-16T09:00:00Z', comment: 'Assigned to Ward Inspector Ananya Roy' },
      { id: 'h-4', complaint_id: 'CF-2026-00421', old_status: ComplaintStatus.ASSIGNED, new_status: ComplaintStatus.IN_PROGRESS, changed_by: 'Ananya Roy', timestamp: '2026-08-17T09:15:00Z', comment: 'Compactor vehicle dispatched to Karol Bagh block 4.' },
    ],
  },
  {
    id: 'CF-2026-00422',
    citizen_id: 'usr-citizen-2',
    citizen_name: 'Pooja Hegde',
    citizen_email: 'pooja.hegde@example.com',
    description: 'There has been zero municipal water supply in Bellandur Green Glen Layout for the last 3 days. Tanker prices are surging.',
    original_language: 'English',
    normalized_text: 'Complete disruption of municipal water supply in Bellandur Green Glen Layout for 3 consecutive days.',
    category: Category.WATER_SUPPLY,
    subcategory: 'Pipeline Breakdown & Supply Failure',
    priority: Priority.CRITICAL,
    severity_score: 0.94,
    city_id: 'city-2',
    city_name: 'Bengaluru',
    ward_id: 'ward-201',
    ward_name: 'Ward 150 - Bellandur Tech Corridor',
    location: 'Green Glen Layout, Main Avenue, Bellandur',
    latitude: 12.9304,
    longitude: 77.6784,
    duration: '3 days',
    department_id: 'dept-1',
    department_name: 'Municipal Water Supply & Sewerage Board',
    assigned_officer_id: 'off-5',
    assigned_officer_name: 'Siddharth Mehra',
    status: ComplaintStatus.ASSIGNED,
    ai_confidence: 0.98,
    suggested_action: 'Emergency valve inspection at Outer Ring Road feeder line & dispatch 5 subsidized water tankers.',
    cluster_id: 'cl-201',
    related_complaints_count: 42,
    created_at: '2026-08-16T14:20:00Z',
    updated_at: '2026-08-17T07:45:00Z',
    history: [
      { id: 'h-5', complaint_id: 'CF-2026-00422', old_status: ComplaintStatus.SUBMITTED, new_status: ComplaintStatus.ROUTED, changed_by: 'CivicFlow AI Engine', timestamp: '2026-08-16T14:20:10Z', comment: 'CRITICAL urgency flag set due to widespread population impact.' },
    ],
  },
  {
    id: 'CF-2026-00423',
    citizen_id: 'usr-citizen-3',
    citizen_name: 'Manoj Tiwari',
    citizen_email: 'manoj.tiwari@example.com',
    description: 'Huge dangerous open manhole directly outside St. Xavier Primary School gate. Children could fall in anytime!',
    original_language: 'English',
    normalized_text: 'Uncovered sewer manhole directly outside primary school gate creating imminent fatal safety hazard.',
    category: Category.DRAINAGE,
    subcategory: 'Open Manhole / Safety Hazard',
    priority: Priority.CRITICAL,
    severity_score: 0.97,
    city_id: 'city-1',
    city_name: 'New Delhi',
    ward_id: 'ward-101',
    ward_name: 'Ward 14 - Rohini Sector 9',
    location: 'Gate #2, St. Xavier School, Rohini Sector 9',
    latitude: 28.7150,
    longitude: 77.1190,
    duration: '1 day',
    department_id: 'dept-1',
    department_name: 'Municipal Water Supply & Sewerage Board',
    assigned_officer_id: 'off-1',
    assigned_officer_name: 'Rohan Deshmukh',
    status: ComplaintStatus.IN_PROGRESS,
    ai_confidence: 0.99,
    suggested_action: 'Emergency barricade placement within 30 minutes; install reinforced cast-iron manhole cover immediately.',
    cluster_id: null,
    related_complaints_count: 3,
    created_at: '2026-08-17T06:10:00Z',
    updated_at: '2026-08-17T08:00:00Z',
  },
  {
    id: 'CF-2026-00424',
    citizen_id: 'usr-citizen-4',
    citizen_name: 'Meera Iyer',
    citizen_email: 'meera.iyer@example.com',
    description: 'Multiple streetlights from pole 12 to 24 are completely dark on 100ft road Indiranagar. Women feel unsafe walking at night.',
    original_language: 'English',
    normalized_text: 'Dark street stretch due to 12 consecutive non-functioning streetlight poles along main 100ft arterial road.',
    category: Category.STREET_LIGHTING,
    subcategory: 'Dark Spot / LED Panel Failure',
    priority: Priority.HIGH,
    severity_score: 0.76,
    city_id: 'city-2',
    city_name: 'Bengaluru',
    ward_id: 'ward-203',
    ward_name: 'Ward 112 - Indiranagar 100ft Road',
    location: 'Poles 12-24, 100ft Road near 12th Main junction, Indiranagar',
    latitude: 12.9784,
    longitude: 77.6408,
    duration: '5 days',
    department_id: 'dept-4',
    department_name: 'Municipal Lighting & Electrical Services',
    assigned_officer_id: 'off-4',
    assigned_officer_name: 'Deepak Saxena',
    status: ComplaintStatus.RESOLVED,
    ai_confidence: 0.94,
    suggested_action: 'Replace blown 90W LED driver units and check underground conduit wiring cable fault.',
    cluster_id: null,
    related_complaints_count: 8,
    created_at: '2026-08-14T19:00:00Z',
    updated_at: '2026-08-16T16:30:00Z',
    resolved_at: '2026-08-16T16:30:00Z',
    feedback: {
      id: 'fb-1',
      complaint_id: 'CF-2026-00424',
      rating: 5,
      comment: 'Thank you! The team arrived with hydraulic lift and all lights are brightly illuminated now.',
      created_at: '2026-08-16T18:00:00Z',
    },
  },
  {
    id: 'CF-2026-00425',
    citizen_id: 'usr-citizen-5',
    citizen_name: 'Karan Joshi',
    citizen_email: 'karan.j@example.com',
    description: 'Deep 2-foot pothole on main road causing severe traffic bottlenecks and 2 bike skid accidents today.',
    original_language: 'English',
    normalized_text: 'Deep crater-sized pothole on main carriageway causing traffic congestion and vehicular skidding accidents.',
    category: Category.ROADS,
    subcategory: 'Pothole & Asphalt Damage',
    priority: Priority.HIGH,
    severity_score: 0.85,
    city_id: 'city-3',
    city_name: 'Mumbai',
    ward_id: 'ward-301',
    ward_name: 'Ward K-West - Andheri West',
    location: 'SV Road Junction, near Andheri West flyover descent',
    latitude: 19.1197,
    longitude: 72.8464,
    duration: '2 days',
    department_id: 'dept-3',
    department_name: 'Public Works & Roads Engineering Division',
    assigned_officer_id: 'off-3',
    assigned_officer_name: 'Kavita Sundaram',
    status: ComplaintStatus.IN_PROGRESS,
    ai_confidence: 0.95,
    suggested_action: 'Mobilize cold-mix bitumen patching team with roller compactor during night traffic window (11pm-4am).',
    cluster_id: null,
    related_complaints_count: 11,
    created_at: '2026-08-16T11:00:00Z',
    updated_at: '2026-08-17T08:20:00Z',
  },
  {
    id: 'CF-2026-00426',
    citizen_id: 'usr-citizen-6',
    citizen_name: 'Suresh Patel',
    citizen_email: 'suresh.patel@example.com',
    description: 'Vijay Nagar sector 33 me drainage line choked hone se ganda paani sadak par beh raha hai.',
    original_language: 'Hindi (हिंदी)',
    normalized_text: 'Drainage sewer line choked in Vijay Nagar sector 33 causing dirty sewage overflow on public road.',
    category: Category.DRAINAGE,
    subcategory: 'Sewage Overflow & Drain Clog',
    priority: Priority.HIGH,
    severity_score: 0.81,
    city_id: 'city-4',
    city_name: 'Indore',
    ward_id: 'ward-401',
    ward_name: 'Ward 33 - Vijay Nagar Main',
    location: 'Crossroad 4, Sector 33, Vijay Nagar, Indore',
    latitude: 22.7533,
    longitude: 75.8937,
    duration: '2 days',
    department_id: 'dept-1',
    department_name: 'Municipal Water Supply & Sewerage Board',
    assigned_officer_id: 'off-1',
    assigned_officer_name: 'Rohan Deshmukh',
    status: ComplaintStatus.ASSIGNED,
    ai_confidence: 0.93,
    suggested_action: 'Dispatch high-pressure jetting machine and suction tanker to clear silt block.',
    cluster_id: null,
    related_complaints_count: 5,
    created_at: '2026-08-17T07:15:00Z',
    updated_at: '2026-08-17T07:20:00Z',
  },
  {
    id: 'CF-2026-00427',
    citizen_id: 'usr-citizen-1',
    citizen_name: 'Aarav Sharma',
    citizen_email: 'aarav.sharma@example.com',
    description: 'Illegal temporary food stalls encroaching both sides of pedestrian footpath in Saket market.',
    original_language: 'English',
    normalized_text: 'Footpath encroachment by unauthorized commercial kiosks blocking pedestrian right of way.',
    category: Category.ENCROACHMENT,
    subcategory: 'Footpath Obstruction & Illegal Stalls',
    priority: Priority.MEDIUM,
    severity_score: 0.55,
    city_id: 'city-1',
    city_name: 'New Delhi',
    ward_id: 'ward-103',
    ward_name: 'Ward 45 - Saket & Mehrauli',
    location: 'Saket Community Center Perimeter Walkway',
    latitude: 28.5245,
    longitude: 77.2066,
    duration: '1 week',
    department_id: 'dept-5',
    department_name: 'Urban Transit & Traffic Operations',
    status: ComplaintStatus.CLASSIFIED,
    ai_confidence: 0.91,
    suggested_action: 'Issue 24-hour clearance notice followed by joint zonal enforcement inspection.',
    cluster_id: null,
    related_complaints_count: 2,
    created_at: '2026-08-17T08:00:00Z',
    updated_at: '2026-08-17T08:00:15Z',
  },
];

export const initialClusters: ComplaintCluster[] = [
  {
    id: 'cl-201',
    title: 'Bellandur Sector 150 Major Water Supply Main Failure',
    category: Category.WATER_SUPPLY,
    city_id: 'city-2',
    city_name: 'Bengaluru',
    ward_id: 'ward-201',
    ward_name: 'Ward 150 - Bellandur Tech Corridor',
    location: 'Bellandur Green Glen & Outer Ring Road Tech Belt',
    latitude: 12.9304,
    longitude: 77.6784,
    complaint_count: 47,
    priority: Priority.CRITICAL,
    confidence: 0.97,
    status: 'ACTIVE',
    recommended_action: 'Execute emergency pipeline isolation at junction 7, dispatch 8 municipal water tankers, and inspect 600mm distribution main.',
    member_complaint_ids: ['CF-2026-00422'],
    spike_percentage: 340,
    first_reported_at: '2026-08-15T06:00:00Z',
    last_reported_at: '2026-08-17T10:00:00Z',
    created_at: '2026-08-15T12:00:00Z',
    updated_at: '2026-08-17T10:00:00Z',
  },
  {
    id: 'cl-101',
    title: 'Karol Bagh Block 4 Uncollected Garbage & Overflow Spill',
    category: Category.WASTE_MANAGEMENT,
    city_id: 'city-1',
    city_name: 'New Delhi',
    ward_id: 'ward-102',
    ward_name: 'Ward 28 - Karol Bagh',
    location: 'Karol Bagh Market & Residential Sector 4',
    latitude: 28.6517,
    longitude: 77.1906,
    complaint_count: 23,
    priority: Priority.HIGH,
    confidence: 0.94,
    status: 'ACTIVE',
    recommended_action: 'Station permanent 10 cubic meter dumper placer bin and establish twice-daily tipper schedule.',
    member_complaint_ids: ['CF-2026-00421'],
    spike_percentage: 185,
    first_reported_at: '2026-08-14T09:00:00Z',
    last_reported_at: '2026-08-17T09:15:00Z',
    created_at: '2026-08-15T08:00:00Z',
    updated_at: '2026-08-17T09:15:00Z',
  },
  {
    id: 'cl-301',
    title: 'SV Road Andheri Monsoon Pothole Skidding Cluster',
    category: Category.ROADS,
    city_id: 'city-3',
    city_name: 'Mumbai',
    ward_id: 'ward-301',
    ward_name: 'Ward K-West - Andheri West',
    location: 'SV Road Junction Corridor, Andheri West',
    latitude: 19.1197,
    longitude: 72.8464,
    complaint_count: 18,
    priority: Priority.HIGH,
    confidence: 0.92,
    status: 'ACTIVE',
    recommended_action: 'Comprehensive milling and rapid mastic asphalt resurfacing across 400m critical carriageway stretch.',
    member_complaint_ids: ['CF-2026-00425'],
    spike_percentage: 210,
    first_reported_at: '2026-08-16T04:00:00Z',
    last_reported_at: '2026-08-17T08:20:00Z',
    created_at: '2026-08-16T10:00:00Z',
    updated_at: '2026-08-17T08:20:00Z',
  },
];

export const initialHotspots: Hotspot[] = [
  {
    id: 'hs-1',
    title: 'Bellandur Sector 150 Water Outage Zone',
    city: 'Bengaluru',
    ward: 'Ward 150 - Bellandur Tech Corridor',
    location: 'Outer Ring Road & Green Glen Area',
    lat: 12.9304,
    lng: 77.6784,
    category: Category.WATER_SUPPLY,
    complaint_count: 47,
    primary_issue: 'Critical Water Supply Pipeline Rupture',
    severity: Priority.CRITICAL,
    confidence: 0.97,
    recommended_action: 'Emergency engineering crew dispatch + Tanker convoy deployment',
  },
  {
    id: 'hs-2',
    title: 'Karol Bagh Solid Waste Spill Hotspot',
    city: 'New Delhi',
    ward: 'Ward 28 - Karol Bagh',
    location: 'Block 4 Market Perimeter',
    lat: 28.6517,
    lng: 77.1906,
    category: Category.WASTE_MANAGEMENT,
    complaint_count: 23,
    primary_issue: 'Multi-Day Garbage Dump Accumulation',
    severity: Priority.HIGH,
    confidence: 0.94,
    recommended_action: 'Heavy compactor clearing + Sanitize open drain area',
  },
  {
    id: 'hs-3',
    title: 'SV Road Andheri Highway Pothole Hazard',
    city: 'Mumbai',
    ward: 'Ward K-West - Andheri West',
    location: 'Flyover descent towards SV Road',
    lat: 19.1197,
    lng: 72.8464,
    category: Category.ROADS,
    complaint_count: 18,
    primary_issue: 'Asphalt Deterioration & High Collision Risk',
    severity: Priority.HIGH,
    confidence: 0.92,
    recommended_action: 'Emergency night resurfacing & Traffic advisory deployment',
  },
];

class DatabaseManager {
  private state: DatabaseState;

  constructor() {
    this.state = {
      users: [...initialUsers],
      cities: [...initialCities],
      wards: [...initialWards],
      departments: [...initialDepartments],
      officers: [...initialOfficers],
      complaints: [...initialComplaints],
      clusters: [...initialClusters],
      hotspots: [...initialHotspots],
    };
  }

  getUsers(): User[] {
    return this.state.users;
  }

  getUserById(id: string): User | undefined {
    return this.state.users.find(u => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  addUser(user: User): User {
    this.state.users.push(user);
    return user;
  }

  getCities(): City[] {
    return this.state.cities;
  }

  getWards(cityId?: string): Ward[] {
    if (cityId) {
      return this.state.wards.filter(w => w.city_id === cityId);
    }
    return this.state.wards;
  }

  getDepartments(cityId?: string): Department[] {
    if (cityId) {
      return this.state.departments.filter(d => d.city_id === cityId || !d.city_id);
    }
    return this.state.departments;
  }

  getOfficers(departmentId?: string, cityId?: string): Officer[] {
    let list = this.state.officers;
    if (departmentId) list = list.filter(o => o.department_id === departmentId);
    if (cityId) list = list.filter(o => o.city_id === cityId);
    return list;
  }

  getComplaints(filters?: {
    citizen_id?: string;
    city_id?: string;
    category?: string;
    department_id?: string;
    priority?: string;
    status?: string;
    search?: string;
    cluster_id?: string;
  }): Complaint[] {
    let result = [...this.state.complaints];

    if (!filters) return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    if (filters.citizen_id) {
      result = result.filter(c => c.citizen_id === filters.citizen_id);
    }
    if (filters.city_id && filters.city_id !== 'all') {
      result = result.filter(c => c.city_id === filters.city_id || c.city_name.toLowerCase() === filters.city_id.toLowerCase());
    }
    if (filters.category && filters.category !== 'all') {
      result = result.filter(c => c.category === filters.category);
    }
    if (filters.department_id && filters.department_id !== 'all') {
      result = result.filter(c => c.department_id === filters.department_id);
    }
    if (filters.priority && filters.priority !== 'all') {
      result = result.filter(c => c.priority === filters.priority);
    }
    if (filters.status && filters.status !== 'all') {
      result = result.filter(c => c.status === filters.status);
    }
    if (filters.cluster_id) {
      result = result.filter(c => c.cluster_id === filters.cluster_id);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(c =>
        c.id.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.normalized_text.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.city_name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  getComplaintById(id: string): Complaint | undefined {
    return this.state.complaints.find(c => c.id === id);
  }

  addComplaint(complaint: Complaint): Complaint {
    this.state.complaints.unshift(complaint);
    return complaint;
  }

  updateComplaint(id: string, updates: Partial<Complaint>, changedBy?: string, statusComment?: string): Complaint | undefined {
    const index = this.state.complaints.findIndex(c => c.id === id);
    if (index === -1) return undefined;

    const current = this.state.complaints[index];
    const updated: Complaint = {
      ...current,
      ...updates,
      departmentId: updates.department_id || updates.departmentId || current.department_id,
      administratorId: updates.assigned_officer_id || updates.administratorId || current.assigned_officer_id,
      jurisdictionId: updates.ward_id || updates.jurisdictionId || current.ward_id,
      updated_at: new Date().toISOString(),
    };

    if (updates.status && updates.status !== current.status) {
      const history = [...(current.history || current.timeline || [])];
      const newEntry = {
        id: `h-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        complaint_id: id,
        old_status: current.status,
        new_status: updates.status,
        changed_by: changedBy || updates.assigned_officer_name || 'Administrator',
        timestamp: new Date().toISOString(),
        comment: statusComment || `Status transition from ${current.status.replace('_', ' ')} to ${updates.status.replace('_', ' ')}`,
      };
      history.push(newEntry);
      updated.history = history;
      updated.timeline = history;

      if (updates.status === ComplaintStatus.RESOLVED && !updated.resolved_at) {
        updated.resolved_at = new Date().toISOString();
      }
    } else {
      updated.history = current.history || [];
      updated.timeline = current.history || [];
    }

    this.state.complaints[index] = updated;
    return updated;
  }

  addCommentToComplaint(complaintId: string, comment: { author_id: string; author_name: string; author_role: string; text: string; is_internal?: boolean }): Complaint | undefined {
    const index = this.state.complaints.findIndex(c => c.id === complaintId);
    if (index === -1) return undefined;

    const current = this.state.complaints[index];
    const newComment = {
      id: `comm-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      complaint_id: complaintId,
      author_id: comment.author_id,
      author_name: comment.author_name,
      author_role: comment.author_role,
      text: comment.text,
      is_internal: comment.is_internal || false,
      created_at: new Date().toISOString(),
    };

    const comments = [...(current.comments || []), newComment];
    
    // Also record a timeline touchpoint
    const history = [...(current.history || current.timeline || [])];
    history.push({
      id: `h-comm-${Date.now()}`,
      complaint_id: complaintId,
      old_status: current.status,
      new_status: current.status,
      changed_by: `${comment.author_name} (${comment.author_role})`,
      timestamp: new Date().toISOString(),
      comment: `Message: "${comment.text.length > 50 ? comment.text.substring(0, 50) + '...' : comment.text}"`,
    });

    const updated: Complaint = {
      ...current,
      comments,
      history,
      timeline: history,
      updated_at: new Date().toISOString(),
    };

    this.state.complaints[index] = updated;
    return updated;
  }

  getClusters(): ComplaintCluster[] {
    return [...this.state.clusters].sort((a, b) => b.complaint_count - a.complaint_count);
  }

  getClusterById(id: string): ComplaintCluster | undefined {
    return this.state.clusters.find(c => c.id === id);
  }

  addCluster(cluster: ComplaintCluster): ComplaintCluster {
    this.state.clusters.unshift(cluster);
    return cluster;
  }

  updateCluster(id: string, updates: Partial<ComplaintCluster>): ComplaintCluster | undefined {
    const idx = this.state.clusters.findIndex(c => c.id === id);
    if (idx === -1) return undefined;
    this.state.clusters[idx] = { ...this.state.clusters[idx], ...updates, updated_at: new Date().toISOString() };
    return this.state.clusters[idx];
  }

  getHotspots(): Hotspot[] {
    return [...this.state.hotspots];
  }
}

export const db = new DatabaseManager();
