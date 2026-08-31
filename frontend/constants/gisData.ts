export interface PortGeo {
  id: string;
  name: string;
  country: string;
  code: string;
  lat: number;
  lng: number;
  type: 'origin' | 'destination';
  region: string;
  maxDraftM: number;
  maxLoaM: number;
  status: 'Normal' | 'Congested' | 'Operational';
  waitingHours: number;
}

// ─── Overseas Bulk Loading Ports (Origins) ──────────────────────────────────
// Australia (Gladstone, Newcastle, Hay Point), Indonesia (Samarinda, Balikpapan, Banjarmasin),
// Mozambique (Maputo, Beira), Russia (Vostochny, Taman), US (Norfolk / Hampton Roads, New Orleans)
export const OVERSEAS_ORIGIN_PORTS: PortGeo[] = [
  { id: 'gladstone', name: 'Gladstone', country: 'Australia', code: 'AUGLT', lat: -23.843, lng: 151.258, type: 'origin', region: 'Australia', maxDraftM: 17.5, maxLoaM: 300, status: 'Operational', waitingHours: 14 },
  { id: 'newcastle', name: 'Newcastle', country: 'Australia', code: 'AUNTL', lat: -32.927, lng: 151.782, type: 'origin', region: 'Australia', maxDraftM: 15.2, maxLoaM: 300, status: 'Operational', waitingHours: 22 },
  { id: 'haypoint', name: 'Hay Point', country: 'Australia', code: 'AUHPT', lat: -21.283, lng: 149.300, type: 'origin', region: 'Australia', maxDraftM: 19.5, maxLoaM: 330, status: 'Operational', waitingHours: 18 },
  { id: 'samarinda', name: 'Samarinda (Muara Berau)', country: 'Indonesia', code: 'IDSRI', lat: -0.502, lng: 117.153, type: 'origin', region: 'Indonesia', maxDraftM: 14.0, maxLoaM: 230, status: 'Congested', waitingHours: 36 },
  { id: 'balikpapan', name: 'Balikpapan', country: 'Indonesia', code: 'IDBPN', lat: -1.269, lng: 116.831, type: 'origin', region: 'Indonesia', maxDraftM: 14.5, maxLoaM: 250, status: 'Operational', waitingHours: 18 },
  { id: 'banjarmasin', name: 'Taboneo (Banjarmasin)', country: 'Indonesia', code: 'IDBDJ', lat: -3.550, lng: 114.483, type: 'origin', region: 'Indonesia', maxDraftM: 13.5, maxLoaM: 225, status: 'Operational', waitingHours: 24 },
  { id: 'maputo', name: 'Maputo (Matola Coal)', country: 'Mozambique', code: 'MZMPM', lat: -25.969, lng: 32.573, type: 'origin', region: 'Mozambique', maxDraftM: 14.3, maxLoaM: 275, status: 'Operational', waitingHours: 16 },
  { id: 'beira', name: 'Beira', country: 'Mozambique', code: 'MZBEW', lat: -19.843, lng: 34.838, type: 'origin', region: 'Mozambique', maxDraftM: 11.5, maxLoaM: 200, status: 'Operational', waitingHours: 28 },
  { id: 'vostochny', name: 'Vostochny', country: 'Russia', code: 'RUVYP', lat: 42.733, lng: 133.083, type: 'origin', region: 'Russia', maxDraftM: 16.5, maxLoaM: 300, status: 'Operational', waitingHours: 12 },
  { id: 'taman', name: 'Taman Bulk Terminal', country: 'Russia', code: 'RUTAM', lat: 45.133, lng: 36.683, type: 'origin', region: 'Russia', maxDraftM: 18.0, maxLoaM: 300, status: 'Operational', waitingHours: 20 },
  { id: 'norfolk', name: 'Norfolk (Hampton Roads)', country: 'United States', code: 'USORF', lat: 36.850, lng: -76.285, type: 'origin', region: 'US East Coast', maxDraftM: 15.2, maxLoaM: 290, status: 'Operational', waitingHours: 15 },
  { id: 'neworleans', name: 'New Orleans / Convent', country: 'United States', code: 'USMSY', lat: 29.951, lng: -90.071, type: 'origin', region: 'US Gulf', maxDraftM: 14.0, maxLoaM: 260, status: 'Operational', waitingHours: 26 },
];

// ─── East Coast of India Discharge Ports (Destinations) ──────────────────────
// Paradip, Visakhapatnam (Vizag), Gangavaram, Gopalpur, Dhamra, Haldia, Sagar / Sandheads
export const EAST_COAST_INDIA_PORTS: PortGeo[] = [
  { id: 'paradip', name: 'Paradip', country: 'India', code: 'INPRT', lat: 20.264, lng: 86.671, type: 'destination', region: 'East Coast India', maxDraftM: 16.0, maxLoaM: 260, status: 'Operational', waitingHours: 18 },
  { id: 'vizag', name: 'Visakhapatnam (Vizag)', country: 'India', code: 'INVTZ', lat: 17.686, lng: 83.218, type: 'destination', region: 'East Coast India', maxDraftM: 18.1, maxLoaM: 300, status: 'Operational', waitingHours: 14 },
  { id: 'gangavaram', name: 'Gangavaram', country: 'India', code: 'INGGV', lat: 17.618, lng: 83.238, type: 'destination', region: 'East Coast India', maxDraftM: 20.0, maxLoaM: 330, status: 'Operational', waitingHours: 12 },
  { id: 'dhamra', name: 'Dhamra', country: 'India', code: 'INDHM', lat: 20.803, lng: 86.963, type: 'destination', region: 'East Coast India', maxDraftM: 18.5, maxLoaM: 320, status: 'Operational', waitingHours: 15 },
  { id: 'gopalpur', name: 'Gopalpur', country: 'India', code: 'INGPR', lat: 19.300, lng: 84.966, type: 'destination', region: 'East Coast India', maxDraftM: 14.5, maxLoaM: 230, status: 'Operational', waitingHours: 20 },
  { id: 'haldia', name: 'Haldia Dock Complex', country: 'India', code: 'INHAL', lat: 22.025, lng: 88.064, type: 'destination', region: 'East Coast India', maxDraftM: 8.5, maxLoaM: 230, status: 'Congested', waitingHours: 42 },
  { id: 'sandheads', name: 'Sagar / Sandheads Anchorage', country: 'India', code: 'INSAG', lat: 21.650, lng: 88.050, type: 'destination', region: 'East Coast India', maxDraftM: 14.0, maxLoaM: 250, status: 'Operational', waitingHours: 10 },
];

export const REAL_PORTS: PortGeo[] = [...OVERSEAS_ORIGIN_PORTS, ...EAST_COAST_INDIA_PORTS];

export interface VesselGeo {
  id: string;
  name: string;
  imo: string;
  type: 'Capesize' | 'Panamax' | 'Supramax' | 'Handysize';
  dwt: number;
  draftM: number;
  lat: number;
  lng: number;
  speedKnots: number;
  status: 'Underway' | 'Moored' | 'Anchored';
  origin: string;
  destination: string;
}

export const REAL_VESSELS: VesselGeo[] = [
  { id: 'v1', name: 'MV Samudra Ratna', imo: 'IMO 9482711', type: 'Capesize', dwt: 180000, draftM: 18.2, lat: -12.4, lng: 110.5, speedKnots: 12.8, status: 'Underway', origin: 'Gladstone', destination: 'Gangavaram' },
  { id: 'v2', name: 'MV Sagar Kanti', imo: 'IMO 9314820', type: 'Panamax', dwt: 75000, draftM: 14.1, lat: 6.2, lng: 94.8, speedKnots: 13.5, status: 'Underway', origin: 'Samarinda (Muara Berau)', destination: 'Paradip' },
  { id: 'v3', name: 'MV Steel Pioneer', imo: 'IMO 9720194', type: 'Supramax', dwt: 58000, draftM: 12.8, lat: -15.8, lng: 52.4, speedKnots: 13.0, status: 'Underway', origin: 'Maputo (Matola Coal)', destination: 'Visakhapatnam (Vizag)' },
  { id: 'v4', name: 'MV Utkal Star', imo: 'IMO 9651034', type: 'Panamax', dwt: 76000, draftM: 14.3, lat: 14.5, lng: 85.2, speedKnots: 14.2, status: 'Underway', origin: 'Newcastle', destination: 'Dhamra' },
  { id: 'v5', name: 'MV Bengal Express', imo: 'IMO 9284719', type: 'Handysize', dwt: 35000, draftM: 9.8, lat: 18.2, lng: 86.0, speedKnots: 11.5, status: 'Underway', origin: 'Taboneo (Banjarmasin)', destination: 'Haldia Dock Complex' },
];

// ─── True Marine Navigation Waterway Waypoint Calculator ────────────────────
// Generates densely routed maritime waypoints navigating strictly through water bodies
export function calculateMarineRoute(origin: PortGeo, dest: PortGeo): [number, number][] {
  const oLat = origin.lat;
  const oLng = origin.lng;
  const dLat = dest.lat;
  const dLng = dest.lng;

  // Approach waypoint into destination port along Bay of Bengal deep water corridor
  const destApproach: [number, number][] = [
    [dLat - 0.5, dLng + 0.8],
    [dLat, dLng]
  ];

  // 1. Australia East Coast (Gladstone, Newcastle, Hay Point) -> India East Coast
  // Dense navigation along Great Barrier Reef shipping channel -> Torres Strait -> Arafura Sea -> Timor Sea -> South of Java / Lombok -> Deep Indian Ocean -> Great Channel -> Bay of Bengal
  if (origin.region === 'Australia') {
    return [
      [oLat, oLng],
      [-21.5, 150.2], // Capricorn Channel
      [-19.0, 148.5], // Great Barrier Inner Route
      [-14.5, 145.5], // Coral Sea coastal channel
      [-11.5, 143.8], // Cape York North Approach
      [-10.4, 142.4], // Prince of Wales Channel (Torres Strait)
      [-10.2, 139.0], // West Torres Strait exit
      [-9.8, 135.0],  // Arafura Sea Central corridor
      [-9.5, 130.0],  // North of Melville Island
      [-10.8, 126.0], // Timor Sea / Sahul Banks deep water
      [-11.2, 121.5], // South of Rote Island
      [-10.5, 116.0], // South of Sumba / Lombok
      [-9.5, 110.0],  // South of Java deep Indian Ocean trench
      [-8.0, 102.0],  // Southwest of Sumatra (Open Ocean)
      [-4.0, 95.0],   // West Sumatra Outer Sea Lane
      [1.0, 93.0],    // Equatorial Indian Ocean
      [5.8, 93.5],    // Great Channel (between Sumatra & Nicobar)
      [9.0, 89.0],    // Andaman Sea / Bay of Bengal deep channel
      [14.0, 86.0],   // Central Bay of Bengal
      ...destApproach
    ];
  }

  // 2. Indonesia (Samarinda, Balikpapan, Taboneo) -> India East Coast
  // Navigation: Makassar Strait -> Java Sea / Sunda Strait -> Western Sumatra -> Great Channel -> Bay of Bengal
  if (origin.region === 'Indonesia') {
    const isEastKalimantan = origin.code === 'IDSRI' || origin.code === 'IDBPN';
    const initPoints: [number, number][] = isEastKalimantan
      ? [
          [oLat, oLng],
          [-1.5, 117.5],  // Makassar Strait Southbound TSS
          [-3.8, 117.0],  // South Makassar exit
          [-5.2, 112.5],  // Java Sea North of Madura
          [-5.8, 108.0],  // Java Sea Central
        ]
      : [
          [oLat, oLng],
          [-4.5, 114.5],  // South Kalimantan departure
          [-5.8, 108.0],  // Java Sea Central
        ];

    return [
      ...initPoints,
      [-5.9, 106.0],  // Sunda Strait North Entrance
      [-6.0, 105.7],  // Sunda Strait mid-passage
      [-6.3, 105.3],  // Sunda Strait South Exit (Krakatoa clear)
      [-5.5, 103.0],  // South Sumatra offshore
      [-3.0, 99.0],   // Mentawai Strait outer deep water
      [1.0, 95.5],    // Western Sumatra corridor
      [5.8, 94.2],    // Great Channel passage
      [10.5, 90.5],   // Andaman deep basin
      [15.0, 86.5],   // Bay of Bengal deep fairway
      ...destApproach
    ];
  }

  // 3. Mozambique (Maputo, Beira) -> India East Coast
  // Dense navigation: Mozambique Channel -> East of Madagascar -> North of Seychelles -> Equatorial Crossing -> South Sri Lanka (Dondra Head TSS) -> Bay of Bengal
  if (origin.region === 'Mozambique') {
    return [
      [oLat, oLng],
      [-24.0, 35.5],  // Mozambique coast clearance
      [-20.5, 38.0],  // Mozambique Channel south
      [-16.0, 42.0],  // Mozambique Channel mid
      [-12.0, 47.0],  // North of Madagascar (Cap d'Ambre)
      [-7.0, 53.0],   // East of Aldabra / Amirante
      [-2.0, 60.0],   // Seychelles offshore deep corridor
      [2.0, 68.0],    // Chagos / Maldives passage
      [5.2, 77.0],    // South of India / Cape Comorin approach
      [5.6, 80.5],    // Dondra Head TSS (South Sri Lanka)
      [6.5, 82.5],    // Southeast Sri Lanka (Great Basses Reef clear)
      [10.0, 84.0],   // Southwest Bay of Bengal
      [15.5, 85.5],   // Central Bay of Bengal
      ...destApproach
    ];
  }

  // 4. US East Coast / Gulf (Norfolk, New Orleans) -> India East Coast
  // Navigation: Florida Straits / North Atlantic -> Mid Atlantic South -> Cape of Good Hope -> Southern Ocean Roaring 40s -> Agulhas Return -> Mauritius waters -> Dondra Head -> Bay of Bengal
  if (origin.region === 'US East Coast' || origin.region === 'US Gulf') {
    const isGulf = origin.region === 'US Gulf';
    const initPoints: [number, number][] = isGulf
      ? [
          [oLat, oLng],
          [28.0, -89.5],  // Mississippi River mouth exit
          [24.5, -83.5],  // Dry Tortugas
          [24.0, -80.5],  // Straits of Florida
          [25.5, -77.0],  // Providence Channel
          [24.0, -65.0],  // Atlantic open ocean
        ]
      : [
          [oLat, oLng],
          [36.8, -75.0],  // Chesapeake Bay exit
          [32.0, -68.0],  // Bermuda West
          [22.0, -55.0],  // North Atlantic trade route
        ];

    return [
      ...initPoints,
      [10.0, -40.0],  // Mid Atlantic North
      [0.0, -25.0],   // Atlantic Equator crossing
      [-15.0, -12.0], // South Atlantic (Ascension / St Helena)
      [-28.0, 2.0],   // South Atlantic deep ocean
      [-34.5, 17.5],  // Cape of Good Hope offshore waypoint
      [-35.2, 20.0],  // Cape Agulhas southern tip
      [-35.0, 26.0],  // Agulhas current marine fairway
      [-32.0, 38.0],  // Southwest Indian Ocean
      [-22.0, 52.0],  // South of Madagascar / Reunion
      [-10.0, 65.0],  // Central Indian Ocean
      [0.0, 75.0],    // Maldives equatorial marine gap
      [5.5, 80.5],    // Dondra Head TSS (South Sri Lanka)
      [7.0, 82.8],    // Sri Lanka East Coast
      [12.0, 85.0],   // Bay of Bengal
      ...destApproach
    ];
  }

  // 5. Russia East (Vostochny) / Black Sea (Taman) -> India East Coast
  if (origin.region === 'Russia') {
    if (origin.code === 'RUVYP') {
      return [
        [oLat, oLng],
        [41.5, 132.0],  // Peter the Great Gulf exit
        [36.5, 130.5],  // Sea of Japan central
        [34.5, 129.0],  // Tsushima Strait North
        [33.0, 127.5],  // Korea Strait / East China Sea
        [29.0, 124.0],  // East China Sea deep fairway
        [24.5, 120.0],  // Taiwan Strait north
        [21.5, 117.5],  // Taiwan Strait south
        [15.0, 113.0],  // South China Sea international route
        [8.0, 109.0],   // South China Sea southern basin
        [3.0, 105.5],   // Eastern approach to Singapore
        [1.3, 104.2],   // Singapore Strait East entrance
        [1.25, 103.6],  // Singapore Strait TSS
        [2.5, 101.5],   // Malacca Strait mid-channel
        [4.5, 99.0],    // Malacca Strait North
        [5.8, 96.5],    // North Malacca exit (Banda Aceh offshore)
        [8.5, 93.0],    // Andaman Sea
        [14.0, 87.0],   // Bay of Bengal
        ...destApproach
      ];
    } else {
      return [
        [oLat, oLng],
        [44.8, 36.5],   // Black Sea Kerch approach
        [43.0, 33.0],   // Central Black Sea
        [41.3, 29.2],   // Bosphorus North
        [40.8, 28.5],   // Sea of Marmara
        [40.0, 26.0],   // Dardanelles Strait
        [38.0, 25.0],   // Aegean Sea
        [35.0, 27.5],   // East of Crete
        [32.0, 31.5],   // Port Said approach
        [31.2, 32.3],   // Suez Canal North
        [29.9, 32.5],   // Suez Canal South
        [27.5, 34.0],   // Gulf of Suez
        [23.0, 37.5],   // Red Sea Central
        [15.0, 42.0],   // Red Sea South (Hanish Islands)
        [12.6, 43.3],   // Bab-el-Mandeb Strait
        [12.0, 47.0],   // Gulf of Aden deep TSS
        [12.5, 52.5],   // Socotra North
        [10.0, 62.0],   // Arabian Sea fairway
        [6.0, 75.0],    // Lakshadweep Sea
        [5.5, 80.5],    // South of Sri Lanka (Dondra Head)
        [7.5, 83.0],    // Sri Lanka East passage
        [13.0, 85.5],   // Bay of Bengal
        ...destApproach
      ];
    }
  }

  // Safe fallback water navigation
  return [
    [oLat, oLng],
    [5.5, 80.5],
    ...destApproach
  ];
}


