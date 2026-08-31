import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { calculateMarineRoute, REAL_PORTS, REAL_VESSELS } from '../constants/gisData';
import { useTheme } from '../constants/theme';

interface WorldMapProps {
  activeOrigin?: string;
  activeDestination?: string;
  onSelectPort?: (portName: string) => void;
}

export default function WorldMap({
  activeOrigin = 'Gladstone',
  activeDestination = 'Paradip',
  onSelectPort,
}: WorldMapProps) {
  const { colors } = useTheme();
  const [showVessels, setShowVessels] = useState(true);
  const [showCorridors, setShowCorridors] = useState(true);

  const originPort = REAL_PORTS.find(p => p.name.toLowerCase() === activeOrigin.toLowerCase()) || REAL_PORTS[0];
  const destPort = REAL_PORTS.find(p => p.name.toLowerCase() === activeDestination.toLowerCase()) || REAL_PORTS[12];

  // Dynamic marine water-way corridor computation
  const marineRouteCoords = useMemo(() => {
    return calculateMarineRoute(originPort, destPort);
  }, [originPort, destPort]);

  // Leaflet Interactive Real Web Map HTML with Clean Dark Carto Tiles & Waterway Waypoint Navigation
  const mapHtml = useMemo(() => {
    const isDark = colors.background === '#071521' || colors.card === '#102A3D';
    // Use standard public OSM and Carto subdomains
    const tileUrl = isDark
      ? 'https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
      : 'https://cartodb-basemaps-a.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png';
    const tileAttribution = '&copy; OpenStreetMap contributors &copy; CARTO';

    const portsJson = JSON.stringify(REAL_PORTS);
    const vesselsJson = JSON.stringify(REAL_VESSELS);
    const routeWaypointsJson = JSON.stringify(marineRouteCoords);
    const originJson = JSON.stringify(originPort);
    const destJson = JSON.stringify(destPort);

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    body, html, #map { margin: 0; padding: 0; width: 100%; height: 100%; background: ${isDark ? '#071521' : '#F4F7FB'}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .leaflet-control-attribution { font-size: 8px !important; background: rgba(7,21,33,0.8) !important; color: #91A9B8 !important; }
    .leaflet-control-attribution a { color: #29C4E8 !important; }
    .port-marker-origin {
      background: #FF7A00 !important;
      border: 2px solid #FFFFFF !important;
      border-radius: 50%;
      box-shadow: 0 0 14px rgba(255,122,0,0.95) !important;
    }
    .port-marker-dest {
      background: #20C997 !important;
      border: 2px solid #FFFFFF !important;
      border-radius: 50%;
      box-shadow: 0 0 14px rgba(32,201,151,0.95) !important;
    }
    .port-marker-default {
      background: #29C4E8;
      border: 1.5px solid #FFFFFF;
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(41,196,232,0.8);
    }
    .vessel-marker {
      background: #102A3D;
      border: 1.5px solid #FF7A00;
      color: #FF7A00;
      border-radius: 6px;
      padding: 2px 6px;
      font-size: 10px;
      font-weight: 700;
      white-space: nowrap;
      box-shadow: 0 2px 6px rgba(0,0,0,0.6);
    }
    .leaflet-popup-content-wrapper {
      background: #102A3D !important;
      color: #E8F0F5 !important;
      border: 1px solid #23465B !important;
      border-radius: 8px !important;
      box-shadow: 0 8px 24px rgba(0,0,0,0.6) !important;
    }
    .leaflet-popup-tip { background: #102A3D !important; }
    .popup-title { font-weight: 800; font-size: 12px; color: #29C4E8; margin-bottom: 4px; }
    .popup-meta { font-size: 11px; color: #91A9B8; line-height: 1.45; }
    .popup-highlight { color: #FF7A00; font-weight: 700; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    const map = L.map('map', {
      center: [5.0, 85.0],
      zoom: 2.3,
      minZoom: 1.5,
      maxZoom: 10,
      zoomControl: true,
      attributionControl: true
    });

    L.tileLayer('${tileUrl}', {
      attribution: '${tileAttribution}',
      maxZoom: 18,
      subdomains: ['a', 'b', 'c', 'd']
    }).addTo(map);

    const ports = ${portsJson};
    const vessels = ${vesselsJson};
    const marineRoute = ${routeWaypointsJson};
    const originPort = ${originJson};
    const destPort = ${destJson};
    const showVesselsFlag = ${showVessels};
    const showCorridorsFlag = ${showCorridors};

    // Major Global Bulk Shipping Lanes to East Coast of India
    if (showCorridorsFlag) {
      const maritimeCorridors = [
        // Australia to Bay of Bengal (Torres / Lombok Strait)
        [[-23.8, 151.2], [-10.6, 142.2], [-10.2, 130.0], [-8.8, 115.5], [6.0, 90.0], [18.0, 84.5]],
        // Indonesia to Bay of Bengal (Sunda / Malacca Strait)
        [[-0.5, 117.1], [-6.1, 105.8], [5.8, 94.5], [17.7, 83.2]],
        // Mozambique to India (Equatorial Ocean route)
        [[-25.9, 32.5], [-18.0, 42.0], [0.0, 68.0], [5.5, 80.5], [20.2, 86.6]],
        // Atlantic / US Cape route to India
        [[36.8, -76.2], [-34.8, 18.5], [-20.0, 55.0], [5.5, 80.5], [20.8, 86.9]],
      ];

      maritimeCorridors.forEach(coords => {
        L.polyline(coords, {
          color: '#29C4E8',
          weight: 2,
          opacity: 0.3,
          dashArray: '6, 10'
        }).addTo(map);
      });
    }

    // Active Waterway Marine Polyline (Glow + Nav Line)
    L.polyline(marineRoute, {
      color: '#FF7A00',
      weight: 3.5,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    L.polyline(marineRoute, {
      color: '#FFFFFF',
      weight: 1.5,
      opacity: 0.6,
      dashArray: '6, 12'
    }).addTo(map);

    // Port Markers
    ports.forEach(port => {
      const isOrigin = port.name.toLowerCase() === originPort.name.toLowerCase();
      const isDest = port.name.toLowerCase() === destPort.name.toLowerCase();
      let iconClass = 'port-marker-default';
      let radius = 5;
      if (isOrigin) { iconClass = 'port-marker-origin'; radius = 8; }
      if (isDest) { iconClass = 'port-marker-dest'; radius = 8; }

      const icon = L.divIcon({
        className: iconClass,
        iconSize: [radius * 2, radius * 2],
        iconAnchor: [radius, radius]
      });

      const marker = L.marker([port.lat, port.lng], { icon }).addTo(map);
      marker.bindPopup(\`
        <div class="popup-title">\${port.name} (\${port.code})</div>
        <div class="popup-meta">
          <strong>Type:</strong> <span class="popup-highlight">\${port.type === 'origin' ? 'Loading Port (Origin)' : 'Discharge Port (India East Coast)'}</span><br/>
          <strong>Country / Region:</strong> \${port.country} (\${port.region})<br/>
          <strong>Max Permissible Draft:</strong> \${port.maxDraftM} m | <strong>Max LOA:</strong> \${port.maxLoaM} m<br/>
          <strong>Status:</strong> \${port.status} (\${port.waitingHours} hrs dwell)
        </div>
      \`);
    });

    // Vessel Markers
    if (showVesselsFlag) {
      vessels.forEach(v => {
        const vIcon = L.divIcon({
          className: 'vessel-marker',
          html: '⚓ ' + v.name.replace('MV ', ''),
          iconAnchor: [24, 10]
        });

        const vMarker = L.marker([v.lat, v.lng], { icon: vIcon }).addTo(map);
        vMarker.bindPopup(\`
          <div class="popup-title">\${v.name} (\${v.imo})</div>
          <div class="popup-meta">
            <strong>Class:</strong> \${v.type} (\${v.dwt.toLocaleString()} DWT)<br/>
            <strong>Laden Draft:</strong> \${v.draftM} m | <strong>Speed:</strong> \${v.speedKnots} kts<br/>
            <strong>Corridor:</strong> \${v.origin} &rarr; \${v.destination}
          </div>
        \`);
      });
    }

    // Fit map bounds to view the active origin, destination, and full marine corridor
    if (marineRoute && marineRoute.length > 0) {
      const bounds = L.latLngBounds(marineRoute);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 5 });
    }
  </script>
</body>
</html>
    `;
  }, [colors, originPort, destPort, marineRouteCoords, showVessels, showCorridors]);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }]}>
      {/* Header & Layer Toggles */}
      <View style={styles.headerRow}>
        <View>
          <View style={styles.badgeRow}>
            <Text style={[styles.eyebrow, { color: colors.primary }]}>MARITIME GIS OPERATIONS (WEB MAP TILE STREAM)</Text>
            <View style={[styles.livePill, { backgroundColor: colors.success + '15', borderColor: colors.success }]}>
              <View style={[styles.liveDot, { backgroundColor: colors.success }]} />
              <Text style={[styles.liveText, { color: colors.success }]}>CARTO / OPENSTREETMAP LIVE</Text>
            </View>
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Global Freight Corridors & Fleet GIS Telemetry</Text>
        </View>

        <View style={styles.layerControls}>
          <Pressable
            onPress={() => setShowVessels(v => !v)}
            style={[
              styles.toggleBtn,
              {
                backgroundColor: showVessels ? colors.cardHighlight : colors.cardAlt,
                borderColor: showVessels ? colors.accent : colors.border,
              },
            ]}
          >
            <MaterialCommunityIcons name="ship-wheel" size={13} color={showVessels ? colors.accent : colors.textMuted} />
            <Text style={[styles.toggleText, { color: showVessels ? colors.text : colors.textMuted }]}>Fleet Layer</Text>
          </Pressable>

          <Pressable
            onPress={() => setShowCorridors(v => !v)}
            style={[
              styles.toggleBtn,
              {
                backgroundColor: showCorridors ? colors.cardHighlight : colors.cardAlt,
                borderColor: showCorridors ? colors.primary : colors.border,
              },
            ]}
          >
            <Feather name="git-branch" size={13} color={showCorridors ? colors.primary : colors.textMuted} />
            <Text style={[styles.toggleText, { color: showCorridors ? colors.text : colors.textMuted }]}>Shipping Lanes</Text>
          </Pressable>
        </View>
      </View>

      {/* Real Interactive Web GIS Tile Map Container */}
      <View style={[styles.mapCanvas, { backgroundColor: colors.backgroundAlt, borderColor: colors.border }]}>
        {Platform.OS === 'web' ? (
          <iframe
            srcDoc={mapHtml}
            style={{
              width: '100%',
              height: '380px',
              border: 'none',
              borderRadius: '12px',
            }}
            title="Real Maritime Web GIS Map"
          />
        ) : (
          <View style={{ height: 380, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: colors.textSecondary }}>Live Map Available in Web Console</Text>
          </View>
        )}
      </View>

      {/* Selected Entity / Active Corridor Details Strip */}
      <View style={[styles.footerStrip, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
        <View style={styles.footerCol}>
          <Text style={[styles.footerMeta, { color: colors.textMuted }]}>ACTIVE VOYAGE CORRIDOR</Text>
          <Text style={[styles.footerValue, { color: colors.text }]}>
            {originPort.name} ({originPort.code}) → {destPort.name} ({destPort.code})
          </Text>
        </View>

        <View style={styles.footerCol}>
          <Text style={[styles.footerMeta, { color: colors.textMuted }]}>ESTIMATED TRANSIT</Text>
          <Text style={[styles.footerValue, { color: colors.primary }]}>26.4 Days (11,480 NM)</Text>
        </View>

        <View style={styles.footerCol}>
          <Text style={[styles.footerMeta, { color: colors.textMuted }]}>ORIGIN WAITING TIME</Text>
          <Text style={[styles.footerValue, { color: originPort.waitingHours > 20 ? colors.warning : colors.success }]}>
            {originPort.waitingHours}h ({originPort.status})
          </Text>
        </View>

        <View style={styles.footerCol}>
          <Text style={[styles.footerMeta, { color: colors.textMuted }]}>DESTINATION STATUS</Text>
          <Text style={[styles.footerValue, { color: destPort.waitingHours > 20 ? colors.warning : colors.success }]}>
            {destPort.waitingHours}h ({destPort.status})
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  liveText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  layerControls: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  mapCanvas: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    minHeight: 380,
  },
  footerStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  footerCol: {
    minWidth: 140,
  },
  footerMeta: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  footerValue: {
    fontSize: 12,
    fontWeight: '700',
  },
});
