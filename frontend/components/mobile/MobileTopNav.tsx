import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Sidebar from '../Sidebar';

const CYAN = '#00D4FF';
const ORANGE = '#FF7A00';
const NAVY = '#061840';

const notifications = [
  { text: 'Storm warning: South China Sea', level: 'critical' },
  { text: 'High fuel price alert', level: 'warning' },
  { text: 'Port congestion: Rotterdam', level: 'warning' },
  { text: 'AI forecast updated', level: 'info' },
];

const searchCatalog = [
  { label: 'Dashboard', route: '/(main)/dashboard' },
  { label: 'Freight Forecast', route: '/(main)/forecast' },
  { label: 'Market Entry', route: '/(main)/market-entry' },
  { label: 'Risk Analysis', route: '/(main)/risk' },
  { label: 'Routes', route: '/(main)/routes' },
  { label: 'Reports', route: '/(main)/reports' },
  { label: 'Statistics', route: '/(main)/stats' },
  { label: 'Alerts', route: '/(main)/alerts' },
  { label: 'Vessel Optimizer', route: '/(main)/vessels' },
];

export default function MobileTopNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [search, setSearch] = useState('');

  const results = search.trim()
    ? searchCatalog.filter(i => i.label.toLowerCase().includes(search.toLowerCase())).slice(0, 5)
    : [];

  return (
    <>
      {/* Drawer modal */}
      <Modal visible={menuOpen} animationType="slide" transparent onRequestClose={() => setMenuOpen(false)}>
        <View style={s.overlay}>
          <Pressable style={s.overlayBg} onPress={() => setMenuOpen(false)} />
          <View style={s.drawer}>
            <SafeAreaView style={{ flex: 1 }}>
              <View style={s.drawerHeader}>
                <View style={s.brand}>
                  <View style={s.brandMark}><Text style={s.brandMarkText}>F</Text></View>
                  <View>
                    <Text style={s.brandName}>FREYNA</Text>
                    <Text style={s.brandSub}>FREIGHT INTELLIGENCE</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setMenuOpen(false)} style={s.closeBtn}>
                  <Feather name="x" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              <Sidebar />
            </SafeAreaView>
          </View>
        </View>
      </Modal>

      {/* Notification modal */}
      <Modal visible={notifOpen} animationType="fade" transparent onRequestClose={() => setNotifOpen(false)}>
        <Pressable style={s.notifOverlay} onPress={() => setNotifOpen(false)}>
          <View style={s.notifPanel}>
            <Text style={s.notifTitle}>Notifications</Text>
            {notifications.map((n, i) => (
              <View key={i} style={s.notifRow}>
                <View style={[s.notifDot, { backgroundColor: n.level === 'critical' ? '#FF6B7A' : n.level === 'warning' ? '#FFBE5C' : CYAN }]} />
                <Text style={s.notifText}>{n.text}</Text>
              </View>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Top bar */}
      <View style={s.topBar}>
        <TouchableOpacity onPress={() => setMenuOpen(true)} style={s.iconBtn}>
          <Feather name="menu" size={20} color="#fff" />
        </TouchableOpacity>

        <View style={s.logoWrap}>
          <View style={s.logoMark}><Text style={s.logoText}>F</Text></View>
          <Text style={s.logoName}>FREYNA</Text>
        </View>

        <View style={s.rightBtns}>
          <TouchableOpacity onPress={() => setNotifOpen(true)} style={s.iconBtn}>
            <Feather name="bell" size={20} color="#fff" />
            <View style={s.notifBadge} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(main)/profile')} style={s.avatar}>
            <Text style={s.avatarText}>MS</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search bar */}
      <View style={s.searchWrap}>
        <View style={s.searchBar}>
          <Feather name="search" size={15} color={CYAN} />
          <TextInput
            value={search} onChangeText={setSearch}
            placeholder="Search route, vessel, port…"
            placeholderTextColor="rgba(0,212,255,0.4)"
            style={s.searchInput}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Feather name="x" size={14} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={s.aiBtn}>
          <Feather name="cpu" size={14} color="#fff" />
          <Text style={s.aiBtnText}>AI</Text>
        </TouchableOpacity>
      </View>

      {/* Search results */}
      {results.length > 0 && (
        <View style={s.searchResults}>
          {results.map(item => (
            <TouchableOpacity key={item.label} onPress={() => { setSearch(''); router.push(item.route as any); }} style={s.searchItem}>
              <Feather name="arrow-right" size={12} color={CYAN} />
              <Text style={s.searchItemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  );
}

const s = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: NAVY },
  iconBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  logoWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoMark: { width: 30, height: 30, borderRadius: 9, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center' },
  logoText: { color: '#fff', fontSize: 15, fontWeight: '900' },
  logoName: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  rightBtns: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  notifBadge: { position: 'absolute', top: 7, right: 7, width: 7, height: 7, borderRadius: 4, backgroundColor: ORANGE, borderWidth: 1.5, borderColor: NAVY },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  searchWrap: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingBottom: 12, backgroundColor: NAVY },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: 'rgba(0,212,255,0.2)' },
  searchInput: { flex: 1, color: '#fff', fontSize: 13 },
  aiBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: ORANGE, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10 },
  aiBtnText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  searchResults: { marginHorizontal: 16, backgroundColor: '#0A1E35', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(0,212,255,0.2)', overflow: 'hidden', marginBottom: 8 },
  searchItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: 'rgba(0,212,255,0.08)' },
  searchItemText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  overlay: { flex: 1, flexDirection: 'row' },
  overlayBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  drawer: { width: '80%', maxWidth: 320, backgroundColor: '#0A1A2A', height: '100%' },
  drawerHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: { width: 36, height: 36, borderRadius: 10, backgroundColor: ORANGE, alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { color: '#fff', fontSize: 18, fontWeight: '900' },
  brandName: { color: '#fff', fontSize: 16, fontWeight: '800' },
  brandSub: { color: 'rgba(0,212,255,0.7)', fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  closeBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  notifOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-start', paddingTop: 100, paddingHorizontal: 16 },
  notifPanel: { backgroundColor: '#0A1E35', borderRadius: 18, borderWidth: 1, borderColor: 'rgba(0,212,255,0.2)', padding: 16 },
  notifTitle: { color: '#fff', fontSize: 15, fontWeight: '800', marginBottom: 12 },
  notifRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(0,212,255,0.08)' },
  notifDot: { width: 8, height: 8, borderRadius: 4 },
  notifText: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '600', flex: 1 },
});
