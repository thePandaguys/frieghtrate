import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import MobileDashboard from '../../components/mobile/MobileDashboard';

import Charts from '../../components/Charts';
import MarketCards from '../../components/MarketCards';
import RecommendationCard from '../../components/RecommendationCard';
import RightPanel from '../../components/RightPanel';
import Sidebar from '../../components/Sidebar';
import VoyagePlanner from '../../components/VoyagePlanner';
import WorldMap from '../../components/WorldMap';
import { useTheme } from '../../constants/theme';

const roleOptions = ['Administrator', 'Logistics Manager', 'Operations Manager', 'Fleet Manager', 'Chartering Manager', 'Freight Analyst', 'Port Operator', 'Risk Analyst', 'Viewer'] as const;
const notifications = ['Storm warning: South China Sea', 'High fuel price alert', 'Port congestion: Rotterdam', 'Weather update received'];

const searchCatalog = [
  { label: 'Dashboard', route: '/(main)/dashboard', tags: ['dashboard', 'home', 'overview'] },
  { label: 'Freight Forecast', route: '/(main)/forecast', tags: ['forecast', 'freight', 'market'] },
  { label: 'Market Entry', route: '/(main)/market-entry', tags: ['market', 'entry', 'charter'] },
  { label: 'Risk Analysis', route: '/(main)/risk', tags: ['risk', 'security', 'weather', 'delay'] },
  { label: 'Routes', route: '/(main)/routes', tags: ['routes', 'ports', 'corridors'] },
  { label: 'Reports', route: '/(main)/reports', tags: ['reports', 'voyage', 'analysis'] },
  { label: 'Statistics', route: '/(main)/stats', tags: ['stats', 'statistics', 'performance'] },
  { label: 'Settings', route: '/(main)/settings', tags: ['settings', 'preferences', 'system'] },
  { label: 'Alerts', route: '/(main)/alerts', tags: ['alerts', 'warning', 'notifications'] },
  { label: 'Vessel Optimizer', route: '/(main)/vessels', tags: ['vessel', 'optimizer', 'fleet'] },
];

export default function DashboardScreen() {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const isMobile = width < 768;
  const [role, setRole] = useState('Logistics Manager');
  const [origin, setOrigin] = useState('Gladstone');
  const [destination, setDestination] = useState('Paradip');
  const [cargo, setCargo] = useState('Coal');
  const [quantity, setQuantity] = useState('75000');
  const [vessel, setVessel] = useState('Panamax');
  const [contract, setContract] = useState('Time Charter');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredSearchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    return searchCatalog.filter((item) => {
      const haystack = `${item.label} ${item.tags.join(' ')}`.toLowerCase();
      return haystack.includes(query);
    }).slice(0, 6);
  }, [searchQuery]);

  const now = useMemo(() => new Date(), []);
  const dateLabel = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const timeLabel = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 2600);
  };

  if (isMobile) return <MobileDashboard />;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.shell, { backgroundColor: colors.background }]}>
        {!isMobile && <Sidebar />}

        {isMobile && mobileMenuOpen && (
          <Pressable style={styles.mobileOverlay} onPress={() => setMobileMenuOpen(false)}>
            <Pressable style={[styles.mobileDrawer, { backgroundColor: colors.sidebar, borderRightColor: colors.sidebarBorder }]} onPress={() => undefined}>
              <View style={styles.drawerHeader}>
                <View style={styles.brandWrap}>
                  <View style={[styles.brandMark, { backgroundColor: colors.deepAccent }]}>
                    <Text style={styles.brandMarkText}>F</Text>
                  </View>
                  <View>
                    <Text style={[styles.brandText, { color: colors.text }]}>FREYNA</Text>
                    <Text style={[styles.brandSubText, { color: colors.textMuted }]}>FREIGHT INTELLIGENCE</Text>
                  </View>
                </View>
                <Pressable onPress={() => setMobileMenuOpen(false)} style={[styles.drawerCloseBtn, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                  <Text style={[styles.drawerCloseText, { color: colors.text }]}>×</Text>
                </Pressable>
              </View>
              <Sidebar />
            </Pressable>
          </Pressable>
        )}

        <View style={[styles.mainArea, { backgroundColor: colors.background }]}>
          {/* TopBar */}
          <View style={[styles.topBar, { backgroundColor: colors.topBar, borderBottomColor: colors.topBarBorder, shadowColor: colors.shadow }]}>
            {isMobile && (
              <Pressable style={[styles.hamburger, { backgroundColor: colors.cardAlt, borderColor: colors.border }]} onPress={() => setMobileMenuOpen(true)}>
                <Feather name="menu" size={20} color={colors.text} />
              </Pressable>
            )}

            <View style={styles.topBarLeft}>
              <Text style={[styles.eyebrow, { color: colors.primary }]}>FREYNA Freight Intelligence & Analytics</Text>
              <Text style={[styles.title, { color: colors.text }]}>Command Center</Text>
              {!isMobile && (
                <View style={styles.metaRow}>
                  <View style={[styles.metaChip, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                    <Text style={[styles.metaLabel, { color: colors.textMuted }]}>Weather</Text>
                    <Text style={[styles.metaValue, { color: colors.text }]}>18 kt / 15°C</Text>
                  </View>
                  <View style={[styles.metaChip, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                    <Text style={[styles.metaLabel, { color: colors.textMuted }]}>System</Text>
                    <Text style={[styles.metaValue, { color: colors.success }]}>Operational</Text>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.topBarRight}>
              <View style={[styles.searchWrap, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
                <Feather name="search" size={14} color={colors.primary} />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search route, vessel, port…"
                  placeholderTextColor={colors.placeholder}
                  style={[styles.searchInput, { color: colors.inputText }]}
                />
              </View>

              {filteredSearchResults.length > 0 && (
                <View style={[styles.searchResults, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadowMd }]}>
                  {filteredSearchResults.map((item) => (
                    <Pressable
                      key={item.label}
                      onPress={() => { setSearchQuery(''); router.push(item.route as any); }}
                      style={({ pressed }) => [styles.searchResultItem, { borderBottomColor: colors.divider }, pressed && { backgroundColor: colors.navHover }]}
                    >
                      <Text style={[styles.searchResultLabel, { color: colors.text }]}>{item.label}</Text>
                    </Pressable>
                  ))}
                </View>
              )}

              {!isMobile && (
                <>
                  <View style={[styles.metaChip, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                    <Text style={[styles.metaLabel, { color: colors.textMuted }]}>Date</Text>
                    <Text style={[styles.metaValue, { color: colors.text }]}>{dateLabel}</Text>
                  </View>
                  <View style={[styles.metaChip, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                    <Text style={[styles.metaLabel, { color: colors.textMuted }]}>Time</Text>
                    <Text style={[styles.metaValue, { color: colors.text }]}>{timeLabel}</Text>
                  </View>
                  <Pressable
                    onPress={() => setNotificationsOpen(v => !v)}
                    style={({ pressed }) => [styles.iconBtn, { backgroundColor: colors.cardAlt, borderColor: colors.border, opacity: pressed ? 0.8 : 1 }]}
                  >
                    <Feather name="bell" size={16} color={colors.primary} />
                    <View style={[styles.alertDot, { backgroundColor: colors.deepAccent }]} />
                  </Pressable>
                  <View style={[styles.userWrap, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                    <Pressable onPress={() => router.push('/(main)/profile')} style={[styles.avatar, { backgroundColor: colors.deepAccent }]}>
                      <Text style={styles.avatarText}>MS</Text>
                    </Pressable>
                    <View>
                      <Text style={[styles.userName, { color: colors.text }]}>Mahi Sharma</Text>
                      <Pressable onPress={() => setRoleOpen(v => !v)} style={styles.roleBtn}>
                        <Text style={[styles.roleText, { color: colors.primary }]}>{role}</Text>
                        <Text style={[styles.roleChevron, { color: colors.primary }]}>{roleOpen ? '▴' : '▾'}</Text>
                      </Pressable>
                    </View>
                  </View>
                </>
              )}
            </View>

            {roleOpen && (
              <View style={[styles.roleMenu, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadowMd }]}>
                <ScrollView style={{ maxHeight: 260 }} showsVerticalScrollIndicator={false}>
                  {roleOptions.map(opt => (
                    <Pressable
                      key={opt}
                      onPress={() => { setRole(opt); setRoleOpen(false); }}
                      style={({ pressed }) => [styles.roleOption, { borderBottomColor: colors.divider }, pressed && { backgroundColor: colors.navHover }]}
                    >
                      <Text style={[styles.roleOptionText, { color: opt === role ? colors.deepAccent : colors.text }]}>{opt}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}

            {notificationsOpen && (
              <View style={[styles.notifPanel, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadowMd }]}>
                <Text style={[styles.notifTitle, { color: colors.text }]}>Notifications</Text>
                {notifications.map(item => (
                  <View key={item} style={[styles.notifRow, { borderBottomColor: colors.divider }]}>
                    <View style={[styles.notifDot, { backgroundColor: colors.deepAccent }]} />
                    <Text style={[styles.notifText, { color: colors.textSecondary }]}>{item}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Breadcrumb */}
            <View style={styles.breadcrumbRow}>
              <Text style={[styles.breadcrumbLink, { color: colors.primary }]} onPress={() => router.push('/(main)/dashboard')}>Dashboard</Text>
              <Text style={[styles.breadcrumbSep, { color: colors.textMuted }]}> › </Text>
              <Text style={[styles.breadcrumbCurrent, { color: colors.textMuted }]}>Overview</Text>
            </View>

            {/* Hero Banner */}
            <View style={[styles.heroBanner, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }]}>
              <View style={[styles.heroAccent, { backgroundColor: colors.deepAccent }]} />
              <View style={styles.heroContent}>
                <View style={styles.heroLeft}>
                  <Text style={[styles.heroEyebrow, { color: colors.primary }]}>MARITIME INTELLIGENCE PLATFORM</Text>
                  <Text style={[styles.heroTitle, { color: colors.text }]}>FREYNA Freight Intelligence</Text>
                  <Text style={[styles.heroSub, { color: colors.textSecondary }]}>AI-powered ocean freight analytics and voyage optimization</Text>
                  <View style={styles.heroStatusRow}>
                    <View style={[styles.statusPill, { backgroundColor: colors.success + '15', borderColor: colors.success + '40' }]}>
                      <View style={[styles.liveDot, { backgroundColor: colors.success }]} />
                      <Text style={[styles.statusText, { color: colors.success }]}>System Operational</Text>
                    </View>
                    <View style={[styles.statusPill, { backgroundColor: colors.deepAccent + '15', borderColor: colors.deepAccent + '40' }]}>
                      <Text style={[styles.statusText, { color: colors.deepAccent }]}>Role: {role}</Text>
                    </View>
                  </View>
                </View>
                {/* KPI Strip */}
                <View style={styles.heroKPIs}>
                  {[
                    { label: 'FREIGHT RATE', value: '$42.8', sub: '/ MT', change: '+8.4%' },
                    { label: 'FORECAST', value: '$47.6', sub: '40D', change: '+11.2%' },
                    { label: 'ACCURACY', value: '91.8%', sub: 'AI', change: '+3.2%' },
                  ].map(k => (
                    <View key={k.label} style={[styles.kpiItem, { borderLeftColor: colors.divider }]}>
                      <Text style={[styles.kpiLabel, { color: colors.textMuted }]}>{k.label}</Text>
                      <View style={styles.kpiValueRow}>
                        <Text style={[styles.kpiValue, { color: colors.deepAccent }]}>{k.value}</Text>
                        <Text style={[styles.kpiSub, { color: colors.textMuted }]}>{k.sub}</Text>
                      </View>
                      <Text style={[styles.kpiChange, { color: colors.success }]}>{k.change}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            <View style={[styles.contentGrid, isMobile && styles.contentGridMobile]}>
              <View style={styles.primaryColumn}>
                {/* Large GIS Maritime Operations World Map */}
                <WorldMap
                  activeOrigin={origin}
                  activeDestination={destination}
                  onSelectPort={(portName) => {
                    if (portName !== destination) setOrigin(portName);
                  }}
                />

                {/* Voyage Planner */}
                <VoyagePlanner
                  origin={origin}
                  destination={destination}
                  cargo={cargo}
                  quantity={quantity}
                  vessel={vessel}
                  contract={contract}
                  onOriginChange={setOrigin}
                  onDestinationChange={setDestination}
                  onCargoChange={setCargo}
                  onQuantityChange={setQuantity}
                  onVesselChange={setVessel}
                  onContractChange={setContract}
                  onAnalyze={handleAnalyze}
                  isAnalyzing={isAnalyzing}
                />

                <MarketCards />
                <RecommendationCard
                  vessel={vessel}
                  confidence="96.2%"
                  eta="8.4 days"
                  fuelCost="$845 / mt"
                  risk="Low"
                  expectedFreight="$1.24M"
                  trend="Bullish"
                  reason="The corridor aligns with an advantageous weather window and lower berth congestion, while the selected vessel class preserves cargo density and reduces fuel burn across the route."
                />
                <Charts />
              </View>

              <View style={[styles.rightColumn, isMobile && styles.rightColumnMobile]}>
                <RightPanel />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  shell: { flex: 1, flexDirection: 'row' },
  mainArea: { flex: 1, minWidth: 0 },

  mobileOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 100, backgroundColor: 'rgba(13,27,42,0.5)', flexDirection: 'row',
  },
  mobileDrawer: {
    width: '82%', maxWidth: 360,
    borderRightWidth: 1, paddingTop: 22, paddingBottom: 18,
  },
  drawerHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 18, paddingHorizontal: 16,
  },
  brandWrap: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  brandText: { fontSize: 16, fontWeight: '800' },
  brandSubText: { fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  drawerCloseBtn: { width: 32, height: 32, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  drawerCloseText: { fontSize: 22, lineHeight: 24 },

  topBar: {
    position: 'relative', flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'space-between', gap: 16, paddingHorizontal: 20,
    paddingTop: 18, paddingBottom: 16, borderBottomWidth: 1,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 8, elevation: 3, zIndex: 10,
  },
  hamburger: {
    width: 40, height: 40, borderRadius: 12, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center', marginRight: 4,
  },
  topBarLeft: { flex: 1, gap: 8 },
  eyebrow: { fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: '700' },
  title: { fontSize: 24, fontWeight: '800' },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metaChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  metaLabel: { fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 },
  metaValue: { fontSize: 12, fontWeight: '700' },
  topBarRight: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8, width: 240,
    paddingHorizontal: 12, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5,
  },
  searchInput: { flex: 1, fontSize: 13, fontWeight: '500' },
  searchResults: {
    position: 'absolute', top: 58, left: 0, right: 0,
    borderRadius: 14, borderWidth: 1, overflow: 'hidden',
    zIndex: 20, elevation: 20,
    shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 16,
  },
  searchResultItem: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1 },
  searchResultLabel: { fontSize: 12, fontWeight: '600' },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  alertDot: {
    position: 'absolute', width: 8, height: 8, borderRadius: 4,
    top: 6, right: 6, borderWidth: 1.5, borderColor: '#FFFFFF',
  },
  userWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, borderWidth: 1,
  },
  avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  userName: { fontSize: 12, fontWeight: '700' },
  roleBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  roleText: { fontSize: 10, fontWeight: '700' },
  roleChevron: { fontSize: 10 },
  roleMenu: {
    position: 'absolute', top: 100, right: 18, width: 220,
    borderRadius: 14, borderWidth: 1, paddingVertical: 6,
    zIndex: 999, elevation: 20,
    shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 16,
  },
  roleOption: { paddingHorizontal: 14, paddingVertical: 11, borderBottomWidth: 1 },
  roleOptionText: { fontSize: 13, fontWeight: '600' },
  notifPanel: {
    position: 'absolute', top: 90, right: 118, width: 280,
    borderRadius: 14, borderWidth: 1, padding: 14,
    zIndex: 999, elevation: 20,
    shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 16,
  },
  notifTitle: { fontWeight: '700', fontSize: 13, marginBottom: 10 },
  notifRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, borderBottomWidth: 1 },
  notifDot: { width: 8, height: 8, borderRadius: 4 },
  notifText: { fontSize: 12, fontWeight: '600', flex: 1 },

  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 36, paddingHorizontal: 18, paddingTop: 18 },

  breadcrumbRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  breadcrumbLink: { fontSize: 13, fontWeight: '700' },
  breadcrumbSep: { fontSize: 13, marginHorizontal: 4 },
  breadcrumbCurrent: { fontSize: 13, fontWeight: '600' },

  heroBanner: {
    borderRadius: 20, borderWidth: 1, marginBottom: 20, overflow: 'hidden',
    flexDirection: 'row',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12, elevation: 4,
  },
  heroAccent: { width: 5 },
  heroContent: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 20, gap: 16 },
  heroLeft: { flex: 1, minWidth: 200 },
  heroEyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 6 },
  heroTitle: { fontSize: 26, fontWeight: '800', letterSpacing: -0.3, marginBottom: 6 },
  heroSub: { fontSize: 13, lineHeight: 19, marginBottom: 14 },
  heroStatusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statusPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1,
  },
  liveDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: '700' },
  heroKPIs: { flexDirection: 'row', gap: 0, alignItems: 'stretch' },
  kpiItem: { paddingLeft: 20, paddingRight: 8, borderLeftWidth: 1 },
  kpiLabel: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  kpiValueRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 3 },
  kpiValue: { fontSize: 22, fontWeight: '800' },
  kpiSub: { fontSize: 11, marginBottom: 3 },
  kpiChange: { fontSize: 11, fontWeight: '700', marginTop: 4 },

  contentGrid: { flexDirection: 'row', alignItems: 'flex-start', gap: 18 },
  contentGridMobile: { flexDirection: 'column', gap: 0 },
  primaryColumn: { flex: 1, minWidth: 0 },
  rightColumn: { width: 320 },
  rightColumnMobile: { width: '100%' },
});
