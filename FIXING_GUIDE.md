# FREYNA Frontend — Action Plan to Fix & Complete

**Current Status:** UI Complete (95%) | API Integration Started (13%)
**Estimated Time to MVP:** 4-6 hours
**Priority Level:** 🔴 CRITICAL

---

## 📊 Executive Summary

The FREYNA frontend has **beautiful UI/UX** but **only 2 of 15 screens call backend APIs**, and **both have hardcoded inputs**. This document outlines exactly what needs to be fixed to make the app fully functional.

### What Works ✅
- Routing & Navigation (90/100)
- UI Components & Theming (95/100)
- Mobile Responsiveness (90/100)
- 40+ Screens & Components (95% complete)

### What Doesn't Work ❌
- Authentication (10/100) - Demo mode only
- API Integration (30/100) - Only 2 screens have partial API calls
- Error Handling (0/100) - No error states or recovery
- State Management (20/100) - No centralized state or persistence
- Form → API Connection (0/100) - Hardcoded inputs instead of form values

---

## 🎯 IMMEDIATE FIXES (Priority: DO TODAY)

### 1. FIX LOGIN AUTHENTICATION [1 hour]

**Current Problem:**
```typescript
// app/login.tsx line 41-49
const handleLogin = () => {
  setLoading(true);
  setTimeout(() => {
    setLoading(false);
    router.replace('/(main)/dashboard');  // ← ALWAYS SUCCEEDS!
  }, 1400);
};
```

**Issue:** Login ignores credentials; anyone reaches dashboard

**Fix:**
```typescript
// app/login.tsx
const [error, setError] = useState('');

const handleLogin = async () => {
  if (!email || !password) {
    setError('Please enter email and password');
    return;
  }

  setLoading(true);
  setError('');
  
  try {
    const result = await loginUser(email, password);
    
    if (result.ok) {
      // Save token to AsyncStorage
      await AsyncStorage.setItem('auth_token', result.data.token);
      // Save user info
      await AsyncStorage.setItem('user', JSON.stringify(result.data.user));
      // Navigate to dashboard
      router.replace('/(main)/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
  } catch (err) {
    setError('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};

// Add UI to show error
{error && <Text style={{color: colors.danger}}>{error}</Text>}
```

**Required Backend:** POST `/api/auth/login` (Returns: {token, user})

---

### 2. FIX FORECAST HARDCODED INPUTS [45 min]

**Current Problem:**
```typescript
// app/(main)/forecast.tsx line 32-60
const handleRefresh = async () => {
  const response = await predictForecast({
    origin_port: 'Rotterdam',           // ← HARDCODED
    destination_port: 'Singapore',      // ← HARDCODED
    vessel_type: 'Container Ship',      // ← HARDCODED
    cargo_type: 'Electronics',          // ← HARDCODED
    freight_rate_usd_ton: 45.50,        // ← HARDCODED
    bdi: 2150,                          // ← HARDCODED
    // ... 20+ more hardcoded
  });
  setForecastRate(values[values.length - 1] ?? null);
};
```

**Issue:** Form inputs (origin, destination) are ignored; predictions always use same data

**Fix:**
```typescript
// app/(main)/forecast.tsx
const [formData, setFormData] = useState({
  origin_port: 'Rotterdam',
  destination_port: 'Singapore',
  vessel_type: 'Container Ship',
  cargo_type: 'Electronics',
  freight_rate_usd_ton: 45.50,
  // ... all other fields
});

const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [forecasting, setForecasting] = useState(false);

const handleRefresh = async () => {
  // Validate inputs
  if (!formData.origin_port || !formData.destination_port) {
    setError('Please enter origin and destination');
    return;
  }

  setForecasting(true);
  setError('');

  try {
    const response = await predictForecast(formData);
    
    if (response.ok) {
      setForecastRate(response.data.prediction);
      setConfidence(response.data.confidence);
      setError('');
    } else {
      setError(response.error || 'Prediction failed');
      setForecastRate(null);
    }
  } catch (err) {
    setError('Network error. Please try again.');
  } finally {
    setForecasting(false);
  }
};

// Update form inputs
<TextInput
  value={formData.origin_port}
  onChangeText={(text) => setFormData({...formData, origin_port: text})}
/>

// Show error
{error && <Text style={{color: colors.danger}}>{error}</Text>}

// Show loading
{forecasting && <ActivityIndicator />}
```

**Required Backend:** POST `/api/forecast` (Already exists)

---

### 3. FIX OPTIMIZER HARDCODED INPUTS [45 min]

**Current Problem:** Same as forecast - hardcoded inputs

**Fix:** Apply same solution as forecast (wire form → API)

**Required Backend:** POST `/api/vessel/idle-predict` (Already exists)

---

### 4. IMPLEMENT RISK PREDICTION [1 hour]

**Current Problem:**
```typescript
// app/(main)/risk.tsx - NO API CALL, JUST MOCK DATA
const [riskData] = useState({
  prediction: 'MEDIUM',
  probability: 68,
  // ... all hardcoded
});
```

**Fix:**
```typescript
// app/(main)/risk.tsx
const [riskData, setRiskData] = useState<any>(null);
const [formData, setFormData] = useState({
  freight_rate: 45.50,
  freight_volatility: 0.18,
  // ... all risk factors
});
const [analyzing, setAnalyzing] = useState(false);
const [error, setError] = useState('');

const handleAnalyze = async () => {
  setAnalyzing(true);
  setError('');

  try {
    const result = await predictRisk(formData);
    
    if (result.ok) {
      setRiskData(result.data);
    } else {
      setError(result.error);
    }
  } catch (err) {
    setError('Failed to analyze risk');
  } finally {
    setAnalyzing(false);
  }
};

// Add form inputs
<TextInput
  value={formData.freight_rate.toString()}
  onChangeText={(text) => setFormData({...formData, freight_rate: parseFloat(text)})}
/>

// Show error & loading
{error && <Text style={{color: colors.danger}}>{error}</Text>}
{analyzing && <ActivityIndicator />}

// Display results
{riskData && (
  <View>
    <Text>{riskData.prediction}</Text>
    <Text>{riskData.probability}%</Text>
  </View>
)}
```

**Required Backend:** POST `/api/risk/predict` (Model exists)

---

### 5. ADD PROTECTED ROUTES [30 min]

**Current Problem:** Dashboard is accessible without login

**Fix:**
```typescript
// app/(main)/_layout.tsx
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, Stack } from 'expo-router';

export default function MainLayout() {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        setAuthed(true);
      } else {
        router.replace('/login');
      }
    } catch (err) {
      router.replace('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;  // Or show splash screen
  if (!authed) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(main)" />
      {/* All other screens */}
    </Stack>
  );
}
```

---

## 🔧 SECONDARY FIXES (Do After Priority Fixes)

### 6. CONNECT PROFILE SCREEN [30 min]

```typescript
// app/(main)/profile.tsx
useEffect(() => {
  fetchProfile();
}, []);

const fetchProfile = async () => {
  try {
    const result = await getCurrentUser();
    if (result.ok) {
      setUser(result.data);
    } else {
      setError(result.error);
    }
  } catch (err) {
    setError('Failed to load profile');
  }
};
```

**Required Backend:** GET `/api/auth/me`

---

### 7. CONNECT ALERTS [30 min]

```typescript
// app/(main)/alerts.tsx
useEffect(() => {
  fetchAlerts();
}, []);

const fetchAlerts = async () => {
  try {
    const result = await getAlerts();
    if (result.ok) {
      setAlerts(result.data);
    }
  } catch (err) {
    console.error(err);
  }
};
```

**Required Backend:** GET `/api/alerts`

---

### 8. CONNECT VESSELS [30 min]

```typescript
// app/(main)/vessels.tsx
const fetchFleet = async () => {
  try {
    const result = await getFleet({ limit: 20 });
    if (result.ok) {
      setVessels(result.data.vessels);
    }
  } catch (err) {
    setError('Failed to load fleet');
  }
};
```

**Required Backend:** GET `/api/fleet`

---

### 9. CONNECT STATS [30 min]

```typescript
// app/(main)/stats.tsx
const fetchStats = async () => {
  try {
    const result = await getStatistics({ period: '30d' });
    if (result.ok) {
      setStats(result.data);
    }
  } catch (err) {
    setError('Failed to load statistics');
  }
};
```

**Required Backend:** GET `/api/stats`

---

### 10. ADD LOGOUT [15 min]

```typescript
// app/(main)/profile.tsx
const handleLogout = async () => {
  try {
    await logoutUser();
  } catch (err) {
    console.error(err);
  } finally {
    // Clear storage
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user');
    // Navigate to login
    router.replace('/login');
  }
};
```

**Required Backend:** POST `/api/auth/logout`

---

## 📋 COMPLETE TASK LIST

### Phase 1: Critical (Today - 3 hours)
- [ ] Fix login to call `loginUser()` API
- [ ] Add token storage to AsyncStorage
- [ ] Add auth check to protected routes
- [ ] Wire forecast form inputs to API
- [ ] Wire optimizer form inputs to API
- [ ] Implement risk prediction API call
- [ ] Add error handling & UI to all 3 prediction screens
- [ ] Test with backend APIs

### Phase 2: Important (Tomorrow - 2 hours)
- [ ] Connect profile screen to `getCurrentUser()`
- [ ] Connect alerts screen to `getAlerts()`
- [ ] Connect vessels screen to `getFleet()`
- [ ] Connect stats screen to `getStatistics()`
- [ ] Implement logout functionality
- [ ] Test all connected screens

### Phase 3: Polish (Next 2 days - 2 hours)
- [ ] Add loading spinners to all API calls
- [ ] Add retry buttons to error states
- [ ] Connect remaining screens (reports, settings, market entry)
- [ ] Add form validation
- [ ] Test error scenarios (network down, API errors)

### Phase 4: Optimization (Final - 1 hour)
- [ ] Cache API responses where appropriate
- [ ] Optimize re-renders with memoization
- [ ] Add animations to data loading
- [ ] Performance testing

---

## 📝 FILES TO MODIFY

### High Priority (Critical fixes)
1. `app/login.tsx` - Add real authentication
2. `app/(main)/_layout.tsx` - Add auth guards
3. `app/(main)/forecast.tsx` - Wire form inputs
4. `app/(main)/optimizer.tsx` - Wire form inputs
5. `app/(main)/risk.tsx` - Add API call

### Medium Priority (Complete integration)
6. `app/(main)/profile.tsx` - Connect `getCurrentUser()`
7. `app/(main)/alerts.tsx` - Connect `getAlerts()`
8. `app/(main)/vessels.tsx` - Connect `getFleet()`
9. `app/(main)/stats.tsx` - Connect `getStatistics()`
10. `components/RightPanel.tsx` - Connect alerts feed

### Low Priority (Enhancements)
11. `app/(main)/reports.tsx` - Connect `getReports()`
12. `app/(main)/settings.tsx` - Connect `saveSettings()`
13. `app/(main)/market-entry.tsx` - Connect analysis API
14. All screens - Add error states & loading UI

---

## ✅ TESTING CHECKLIST

After applying fixes, verify:

### Authentication
- [ ] Login with valid email/password → Dashboard
- [ ] Login with invalid → Error message
- [ ] Can't access dashboard without login (protected route)
- [ ] Logout → Back to login
- [ ] Token persists across app restart

### Forecasting
- [ ] Change origin → Different results
- [ ] Change destination → Different results
- [ ] Empty fields → Validation error
- [ ] Network error → Shows error with retry

### Risk Analysis
- [ ] Enter risk factors → Get prediction
- [ ] Invalid data → Error message
- [ ] API fails → Error with retry option

### Profile
- [ ] User data displays from API
- [ ] Logout button works
- [ ] Can't access after logout

### Other Screens
- [ ] Alerts load from API
- [ ] Vessels load from API
- [ ] Stats display live data
- [ ] All show loading spinners

---

## 🚀 DEPLOYMENT CHECKLIST

Before deploying to production:

### Code Quality
- [ ] All API calls wrapped in try/catch
- [ ] All error states have UI
- [ ] Loading states for all async operations
- [ ] No console.error or console.log in production code
- [ ] All environment variables configured

### Testing
- [ ] Manual end-to-end testing on real device
- [ ] Test with network throttling (slow 3G)
- [ ] Test with network disconnected
- [ ] Test with API server down
- [ ] Test on iOS and Android

### Security
- [ ] Token stored securely in AsyncStorage
- [ ] Tokens included in API requests
- [ ] Logout clears all sensitive data
- [ ] No sensitive data in logs
- [ ] HTTPS only (in production)

### Performance
- [ ] App starts in < 3 seconds
- [ ] API responses < 2 seconds
- [ ] No memory leaks on long use
- [ ] Battery impact minimal

---

## 🎯 SUCCESS CRITERIA

The app is **READY** when:

1. ✅ Login requires valid credentials (not demo mode)
2. ✅ Dashboard requires login (protected route)
3. ✅ Forecast uses form inputs, not hardcoded values
4. ✅ Optimizer uses form inputs, not hardcoded values
5. ✅ Risk screen calls API and displays results
6. ✅ All screens with API calls have error handling
7. ✅ All async operations show loading states
8. ✅ User can logout and session clears
9. ✅ All major screens load live data from APIs
10. ✅ App tested on device without crashes

---

## 💾 REQUIRED BACKEND ENDPOINTS

**CRITICAL (Must have):**
- POST `/api/auth/login` - Authenticate user
- POST `/api/forecast` - Forecast freight rates (exists)
- POST `/api/vessel/idle-predict` - Predict vessel idle (exists)
- POST `/api/risk/predict` - Predict freight risk (exists)
- GET `/api/auth/me` - Get current user

**IMPORTANT (Should have):**
- POST `/api/auth/logout` - Logout
- GET `/api/alerts` - Fetch alerts
- GET `/api/fleet` - List vessels
- GET `/api/stats` - Statistics

**NICE TO HAVE:**
- GET `/api/reports` - Report management
- GET `/api/settings` - User settings
- POST `/api/settings` - Save settings
- And 10+ more per API_REQUIREMENTS.md

---

## 📞 COMMON ISSUES & SOLUTIONS

### Issue: Login always succeeds
**Cause:** Not calling loginUser() API
**Fix:** Add result = await loginUser(email, password) in handleLogin

### Issue: Forecast always shows same values
**Cause:** Inputs are hardcoded
**Fix:** Use form state values instead: origin_port: formData.origin_port

### Issue: Risk screen blank
**Cause:** No API call; no state for results
**Fix:** Call predictRisk() and setRiskData(result.data)

### Issue: App crashes on API error
**Cause:** No try/catch
**Fix:** Wrap API calls in try/catch/finally blocks

### Issue: Can access dashboard without login
**Cause:** No auth guard in (main)/_layout.tsx
**Fix:** Add checkAuth() and redirect to /login if not authorized

---

## 📊 PROGRESS TRACKING

**Week 1 Target:** 50/100 (Core auth & predictions working)
**Week 2 Target:** 75/100 (All main screens connected)
**Week 3 Target:** 90/100 (Polish & testing)
**Deployment Target:** 95/100 (Production ready)

---

**Last Updated:** 2026-08-30
**Next Review:** 2026-08-31
**Estimated Completion:** 2026-09-02
