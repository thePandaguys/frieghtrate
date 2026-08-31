import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '../constants/theme';

export default function ThreeDLoginScreen() {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const isMobile = width < 900;

  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [role, setRole] = useState('Chartering Manager (SAIL)');
  const [email, setEmail] = useState('analyst@steel-freight.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Three.js interactive 3D Bulk Carrier Cargo Ship Simulation in Dark Ocean Waters
  const threeHtml = useMemo(() => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <style>
    body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #040D14; font-family: sans-serif; }
    #canvas-container { width: 100%; height: 100%; position: absolute; top: 0; left: 0; }
    .telemetry-overlay {
      position: absolute;
      top: 20px;
      left: 20px;
      z-index: 10;
      pointer-events: none;
      background: rgba(7, 21, 33, 0.85);
      border: 1px solid rgba(41, 196, 232, 0.3);
      border-radius: 8px;
      padding: 12px 16px;
      backdrop-filter: blur(8px);
      color: #E8F0F5;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    }
    .hud-title { font-size: 11px; font-weight: 800; color: #29C4E8; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 4px; }
    .hud-stat { font-size: 13px; font-weight: 700; color: #FF7A00; }
    .hud-sub { font-size: 10px; color: #91A9B8; margin-top: 2px; }
  </style>
</head>
<body>
  <div class="telemetry-overlay">
    <div class="hud-title">3D BULK VESSEL SIMULATOR</div>
    <div class="hud-stat">CAPESIZE CLASS (180,000 DWT)</div>
    <div class="hud-sub">CORRIDOR: GLADSTONE &rarr; PARADIP | SPEED: 13.4 KTS</div>
  </div>
  <div id="canvas-container"></div>

  <script>
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040D14, 0.015);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(22, 14, 30);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // ─── Lights ───
    const ambientLight = new THREE.AmbientLight(0x0B2432, 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x29C4E8, 2.2);
    dirLight.position.set(30, 40, 20);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const orangeAccent = new THREE.PointLight(0xFF7A00, 3.5, 60);
    orangeAccent.position.set(-15, 8, 10);
    scene.add(orangeAccent);

    // ─── 3D Ocean Waves Geometry ───
    const oceanGeo = new THREE.PlaneGeometry(160, 160, 64, 64);
    oceanGeo.rotateX(-Math.PI / 2);
    const oceanMat = new THREE.MeshStandardMaterial({
      color: 0x071521,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: false,
    });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    scene.add(ocean);

    // Wireframe Grid Overlay for Technical Radar feel
    const gridMat = new THREE.MeshBasicMaterial({ color: 0x29C4E8, wireframe: true, transparent: true, opacity: 0.15 });
    const oceanGrid = new THREE.Mesh(oceanGeo, gridMat);
    oceanGrid.position.y = 0.05;
    scene.add(oceanGrid);

    // ─── 3D Detailed Cargo Ship Assembly ───
    const shipGroup = new THREE.Group();

    // Hull (Dark Marine Steel)
    const hullMat = new THREE.MeshStandardMaterial({ color: 0x0A1B29, roughness: 0.4, metalness: 0.6 });
    const keelMat = new THREE.MeshStandardMaterial({ color: 0x8B1E1E, roughness: 0.3, metalness: 0.7 }); // Anti-fouling red keel

    // Upper Hull
    const hullGeo = new THREE.BoxGeometry(7, 3.2, 28);
    const hull = new THREE.Mesh(hullGeo, hullMat);
    hull.position.y = 1.6;
    shipGroup.add(hull);

    // Lower Red Keel
    const keelGeo = new THREE.BoxGeometry(6.6, 1.4, 27.6);
    const keel = new THREE.Mesh(keelGeo, keelMat);
    keel.position.y = -0.4;
    shipGroup.add(keel);

    // Bow (Front V-shape)
    const bowGeo = new THREE.ConeGeometry(3.6, 5, 4);
    bowGeo.rotateZ(Math.PI / 2);
    bowGeo.rotateY(Math.PI / 4);
    const bow = new THREE.Mesh(bowGeo, hullMat);
    bow.position.set(0, 1.6, 16.5);
    shipGroup.add(bow);

    // Cargo Hatches (Bulk Coal Holds)
    const hatchMat = new THREE.MeshStandardMaterial({ color: 0x1A3549, roughness: 0.5, metalness: 0.5 });
    const coalMat = new THREE.MeshStandardMaterial({ color: 0x121417, roughness: 0.9, metalness: 0.1 });

    [-8, -3, 2, 7, 12].forEach(z => {
      const hatch = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.8, 3.6), hatchMat);
      hatch.position.set(0, 3.4, z);
      shipGroup.add(hatch);

      // Coal cargo pile inside open hatches
      const coal = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.5, 3.0), coalMat);
      coal.position.set(0, 3.8, z);
      shipGroup.add(coal);
    });

    // Deck Cranes (Bulk Gantry Grab Cranes)
    const craneMat = new THREE.MeshStandardMaterial({ color: 0xFF7A00, roughness: 0.3, metalness: 0.7 });
    [-5.5, -0.5, 4.5, 9.5].forEach(z => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 3), craneMat);
      post.position.set(0, 4.5, z);
      shipGroup.add(post);

      const boom = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 4), craneMat);
      boom.position.set(0, 6, z + 1.2);
      boom.rotation.x = -0.3;
      shipGroup.add(boom);
    });

    // Superstructure / Bridge (Aft Castle)
    const bridgeMat = new THREE.MeshStandardMaterial({ color: 0xE8F0F5, roughness: 0.2, metalness: 0.3 });
    const glassMat = new THREE.MeshBasicMaterial({ color: 0x29C4E8 });

    const castle = new THREE.Mesh(new THREE.BoxGeometry(5.8, 5, 4.5), bridgeMat);
    castle.position.set(0, 5.5, -11.5);
    shipGroup.add(castle);

    // Navigation Bridge Top & Windows
    const bridgeDeck = new THREE.Mesh(new THREE.BoxGeometry(6.6, 1.2, 2.5), bridgeMat);
    bridgeDeck.position.set(0, 8.2, -11);
    shipGroup.add(bridgeDeck);

    const windows = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.4, 2.6), glassMat);
    windows.position.set(0, 8.4, -11);
    shipGroup.add(windows);

    // Funnel / Exhaust Stack
    const funnelMat = new THREE.MeshStandardMaterial({ color: 0x8B1E1E, roughness: 0.3 });
    const funnel = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.9, 3, 16), funnelMat);
    funnel.position.set(0, 9.5, -13);
    shipGroup.add(funnel);

    // Radar Mast
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4), craneMat);
    mast.position.set(0, 10.5, -10.5);
    shipGroup.add(mast);

    // Navigation Stern / Bow Light Points
    const greenNav = new THREE.PointLight(0x20C997, 2, 10);
    greenNav.position.set(3.6, 4, 15);
    shipGroup.add(greenNav);

    const redNav = new THREE.PointLight(0xE85D75, 2, 10);
    redNav.position.set(-3.6, 4, 15);
    shipGroup.add(redNav);

    scene.add(shipGroup);

    // ─── Floating Container Beacons in the Distance ───
    const buoyMat = new THREE.MeshStandardMaterial({ color: 0x29C4E8, emissive: 0x29C4E8, emissiveIntensity: 0.6 });
    for (let i = 0; i < 8; i++) {
      const buoy = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 1.5, 8), buoyMat);
      const angle = (i / 8) * Math.PI * 2;
      buoy.position.set(Math.cos(angle) * 35, 0.5, Math.sin(angle) * 35);
      scene.add(buoy);
    }

    // ─── Animation Loop (Dynamic Ocean Waves + Ship Buoyancy Pitch & Roll) ───
    let clock = new THREE.Clock();
    const pos = oceanGeo.attributes.position;

    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Wave calculation on ocean vertices
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const v = pos.getZ(i);
        const wave = Math.sin(u * 0.15 + t * 1.8) * 0.45 + Math.cos(v * 0.15 + t * 1.2) * 0.45;
        pos.setY(i, wave);
      }
      pos.needsUpdate = true;

      // Realistic Ship Motion (Heave, Pitch, Roll, Yaw)
      shipGroup.position.y = Math.sin(t * 1.5) * 0.35 + 0.1;
      shipGroup.rotation.x = Math.sin(t * 1.2) * 0.04; // Pitch
      shipGroup.rotation.z = Math.cos(t * 1.4) * 0.05; // Roll
      shipGroup.rotation.y = Math.sin(t * 0.5) * 0.06; // Drift yaw

      // Slow orbital camera glide
      camera.position.x = Math.cos(t * 0.12) * 30;
      camera.position.z = Math.sin(t * 0.12) * 30;
      camera.position.y = 12 + Math.sin(t * 0.2) * 2;
      camera.lookAt(0, 2.5, 0);

      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  </script>
</body>
</html>
    `;
  }, []);

  const handleAuthSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/(main)/dashboard');
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        {/* Left/Background 3D Ocean Vessel Canvas */}
        <View style={[styles.canvasPane, isMobile && styles.canvasPaneMobile]}>
          {Platform.OS === 'web' ? (
            <iframe
              srcDoc={threeHtml}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="3D Ocean Bulk Vessel Scene"
            />
          ) : (
            <View style={{ flex: 1, backgroundColor: '#071521', justifyContent: 'center', alignItems: 'center' }}>
              <MaterialCommunityIcons name="ferry" size={64} color={colors.accent} />
              <Text style={{ color: colors.text, marginTop: 12, fontWeight: '700' }}>3D Maritime Portal</Text>
            </View>
          )}

          {/* Institutional Watermark Badge on Top Left */}
          <View style={styles.brandOverlay}>
            <View style={[styles.brandMark, { backgroundColor: colors.deepAccent }]}>
              <Text style={styles.brandMarkText}>F</Text>
            </View>
            <View>
              <Text style={styles.brandTitle}>FREYNA MARITIME INTELLIGENCE</Text>
              <Text style={styles.brandSub}>MINISTRY OF STEEL • SAIL BULK PROCUREMENT (SIH 26006)</Text>
            </View>
          </View>
        </View>

        {/* Right Glassmorphism Auth Console Form */}
        <View style={[styles.authPane, isMobile && styles.authPaneMobile, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ScrollView contentContainerStyle={styles.authScroll} showsVerticalScrollIndicator={false}>
            {/* Header / Security Badge */}
            <View style={styles.formHeader}>
              <View style={[styles.securityBadge, { backgroundColor: colors.success + '15', borderColor: colors.success }]}>
                <Feather name="shield" size={12} color={colors.success} />
                <Text style={[styles.securityText, { color: colors.success }]}>SECURE ENTERPRISE GATEWAY</Text>
              </View>
              <Text style={[styles.formHeading, { color: colors.text }]}>
                {authMode === 'signin' ? 'Sign In to Command Center' : 'Register Operator Account'}
              </Text>
              <Text style={[styles.formSub, { color: colors.textSecondary }]}>
                Intelligent Freight Forecasting & Vessel Chartering for Indian East Coast Ports
              </Text>
            </View>

            {/* Auth Mode Toggle */}
            <View style={[styles.modeToggleWrap, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
              <Pressable
                onPress={() => setAuthMode('signin')}
                style={[
                  styles.modeToggleBtn,
                  authMode === 'signin' && { backgroundColor: colors.deepAccent, borderColor: colors.accent },
                ]}
              >
                <Text style={[styles.modeToggleText, { color: authMode === 'signin' ? '#FFFFFF' : colors.textMuted }]}>
                  OPERATOR LOGIN
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setAuthMode('register')}
                style={[
                  styles.modeToggleBtn,
                  authMode === 'register' && { backgroundColor: colors.deepAccent, borderColor: colors.accent },
                ]}
              >
                <Text style={[styles.modeToggleText, { color: authMode === 'register' ? '#FFFFFF' : colors.textMuted }]}>
                  NEW CLEARANCE
                </Text>
              </Pressable>
            </View>

            {/* Form Fields */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.inputLabel, { color: colors.textMuted }]}>COMMAND ROLE</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
                <Feather name="user-check" size={15} color={colors.primary} />
                <TextInput
                  value={role}
                  onChangeText={setRole}
                  style={[styles.textInput, { color: colors.inputText }]}
                  placeholderTextColor={colors.placeholder}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.inputLabel, { color: colors.textMuted }]}>OFFICIAL EMAIL / SSO ID</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
                <Feather name="mail" size={15} color={colors.primary} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={[styles.textInput, { color: colors.inputText }]}
                  placeholderTextColor={colors.placeholder}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.inputLabel, { color: colors.textMuted }]}>SECURITY CLEARANCE KEY</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
                <Feather name="lock" size={15} color={colors.primary} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={[styles.textInput, { color: colors.inputText }]}
                  placeholderTextColor={colors.placeholder}
                />
                <Pressable onPress={() => setShowPassword(v => !v)}>
                  <Feather name={showPassword ? 'eye-off' : 'eye'} size={15} color={colors.textMuted} />
                </Pressable>
              </View>
            </View>

            {/* Quick Demo Info Pill */}
            <View style={[styles.demoPill, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
              <Feather name="info" size={13} color={colors.primary} />
              <Text style={[styles.demoPillText, { color: colors.textSecondary }]}>
                Pre-configured for Ministry of Steel / SAIL freight forecasting simulation.
              </Text>
            </View>

            {/* Submit Action Button */}
            <Pressable
              onPress={handleAuthSubmit}
              disabled={loading}
              style={[styles.submitButton, { backgroundColor: colors.accent }]}
            >
              {loading ? (
                <Text style={styles.submitButtonText}>AUTHENTICATING CLEARANCE...</Text>
              ) : (
                <View style={styles.submitBtnInner}>
                  <Text style={styles.submitButtonText}>
                    {authMode === 'signin' ? 'ENTER COMMAND CENTER' : 'REQUEST PORT CLEARANCE'}
                  </Text>
                  <Feather name="arrow-right" size={16} color="#FFFFFF" />
                </View>
              )}
            </Pressable>

            {/* Direct Bypass Button */}
            <Pressable onPress={() => router.push('/(main)/dashboard')} style={styles.bypassBtn}>
              <Text style={[styles.bypassText, { color: colors.textMuted }]}>
                Skip to Live Dashboard &rarr;
              </Text>
            </Pressable>

            {/* Footer Institutional Notice */}
            <View style={styles.formFooter}>
              <Text style={[styles.footerNotice, { color: colors.textMuted }]}>
                SIH 2026 • Problem Statement 26006 • Freight Intelligence System
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  canvasPane: {
    flex: 1.25,
    position: 'relative',
    backgroundColor: '#040D14',
  },
  canvasPaneMobile: {
    display: 'none',
  },
  brandOverlay: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(7,21,33,0.85)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(41,196,232,0.3)',
    backdropFilter: 'blur(8px)',
  },
  brandMark: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandMarkText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  brandTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E8F0F5',
    letterSpacing: 0.8,
  },
  brandSub: {
    fontSize: 9,
    fontWeight: '700',
    color: '#29C4E8',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  authPane: {
    width: 460,
    borderLeftWidth: 1,
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  authPaneMobile: {
    width: '100%',
    borderLeftWidth: 0,
  },
  authScroll: {
    padding: 32,
    justifyContent: 'center',
    minHeight: '100%',
  },
  formHeader: {
    marginBottom: 24,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 12,
  },
  securityText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  formHeading: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  formSub: {
    fontSize: 12,
    lineHeight: 18,
  },
  modeToggleWrap: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    padding: 4,
    marginBottom: 20,
    gap: 4,
  },
  modeToggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  modeToggleText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    outlineStyle: 'none',
  },
  demoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
  },
  demoPillText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
  },
  submitButton: {
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  submitBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  bypassBtn: {
    marginTop: 16,
    alignItems: 'center',
  },
  bypassText: {
    fontSize: 12,
    fontWeight: '700',
  },
  formFooter: {
    marginTop: 32,
    borderTopWidth: 1,
    borderTopColor: 'rgba(35, 70, 91, 0.4)',
    paddingTop: 16,
    alignItems: 'center',
  },
  footerNotice: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
});