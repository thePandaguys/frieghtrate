# API Integration Status — Visual Overview

## 🔗 WHAT'S CONNECTED TO BACKEND

```
CONNECTED ✅
│
├─ app/(main)/forecast.tsx
│  └─ predictForecast() ✅ [Called but inputs hardcoded]
│     └─ POST /api/forecast
│
└─ app/(main)/optimizer.tsx
   └─ predictVesselIdle() ✅ [Called but inputs hardcoded]
      └─ POST /api/vessel/idle-predict
```

**Status:** 2 screens attempt API calls; both have hardcoded inputs

---

## 🔌 WHAT'S NOT CONNECTED (Still Mock Data)

```
NOT CONNECTED ❌
│
├─ app/login.tsx
│  └─ NO CALL TO loginUser() [Just demo timeout]
│     └─ NEEDS: POST /api/auth/login
│
├─ app/(main)/risk.tsx
│  └─ NO CALL TO predictRisk() [All mock data]
│     └─ NEEDS: POST /api/risk/predict
│
├─ app/(main)/market-entry.tsx
│  └─ NO CALL TO analyzeMarketEntry() [All mock analysis]
│     └─ NEEDS: POST /api/market/entry-analysis
│
├─ app/(main)/profile.tsx
│  └─ NO CALL TO getCurrentUser() [All hardcoded user data]
│     └─ NEEDS: GET /api/auth/me
│
├─ app/(main)/settings.tsx
│  └─ NO CALLS [Settings not persisted]
│     └─ NEEDS: GET /api/settings + POST /api/settings
│
├─ app/(main)/vessels.tsx
│  └─ NO CALL TO getFleet() [Only 4 sample vessels shown]
│     └─ NEEDS: GET /api/fleet
│
├─ app/(main)/routes.tsx
│  └─ NO CALL TO getRoutes() [All mock data]
│     └─ NEEDS: GET /api/routes
│
├─ app/(main)/alerts.tsx
│  └─ NO CALL TO getAlerts() [6 hardcoded alerts]
│     └─ NEEDS: GET /api/alerts
│
├─ app/(main)/waste.tsx
│  └─ NO BACKEND DATA [4 hardcoded waste records]
│     └─ NEEDS: Custom waste tracking API
│
├─ app/(main)/reports.tsx
│  └─ NO CALL TO getReports() [No report data shown]
│     └─ NEEDS: GET /api/reports
│
├─ app/(main)/stats.tsx
│  └─ NO CALL TO getStatistics() [Mock chart data]
│     └─ NEEDS: GET /api/stats
│
├─ app/(main)/policy.tsx
│  └─ NO BACKEND DATA [Static policies]
│     └─ NEEDS: Custom policy API (or can stay static)
│
├─ app/(main)/simulator.tsx
│  └─ NO BACKEND DATA [Scenario simulation]
│     └─ NEEDS: POST /api/simulate
│
├─ components/RightPanel.tsx
│  └─ NO CALL TO getAlerts() [6 hardcoded alerts]
│     └─ NEEDS: GET /api/alerts
│
├─ components/Charts.tsx
│  └─ NO CALL TO getStatistics() [Hardcoded chart data]
│     └─ NEEDS: GET /api/stats
│
└─ components/Dashboard.tsx
   └─ NO CALL FOR MARKET DATA [Voyage planner disconnected]
      └─ NEEDS: Connection to forecast/optimizer APIs
```

**Status:** 13+ screens/components still using 100% mock data

---

## 📊 CURRENT INTEGRATION MAP

### Screens That Call APIs (2/15 = 13%)
| Screen | Function | API Endpoint | Input Status | Error Handling |
|--------|----------|-------------|--------------|---|
| Forecast | `predictForecast()` | POST /api/forecast | ❌ Hardcoded | ❌ None |
| Optimizer | `predictVesselIdle()` | POST /api/vessel/idle-predict | ❌ Hardcoded | ❌ None |

### Screens That Should Call APIs (13/15 = 87%)
| Screen | Function Needed | API Endpoint | Current State | Priority |
|--------|-----------------|-------------|---|---|
| Login | `loginUser()` | POST /api/auth/login | DEMO MODE | 🔴 CRITICAL |
| Risk | `predictRisk()` | POST /api/risk/predict | MOCK | 🔴 CRITICAL |
| Profile | `getCurrentUser()` | GET /api/auth/me | HARDCODED | 🟠 HIGH |
| Settings | `getSettings()` + `saveSettings()` | GET/POST /api/settings | HARDCODED | 🟠 HIGH |
| Vessels | `getFleet()` | GET /api/fleet | MOCK (4 samples) | 🟠 HIGH |
| Alerts | `getAlerts()` | GET /api/alerts | MOCK (6 samples) | 🟠 HIGH |
| Reports | `getReports()` | GET /api/reports | MOCK | 🟡 MEDIUM |
| Stats | `getStatistics()` | GET /api/stats | MOCK | 🟡 MEDIUM |
| Routes | `getRoutes()` | GET /api/routes | MOCK (28 routes) | 🟡 MEDIUM |
| Market Entry | `analyzeMarketEntry()` | POST /api/market/entry-analysis | MOCK | 🟡 MEDIUM |
| Waste | Custom API | Custom endpoint | MOCK | 🟢 LOW |
| Policy | N/A | Static content | STATIC | 🟢 LOW |
| Simulator | `simulateScenario()` | POST /api/simulate | MOCK | 🟢 LOW |

---

## 🚨 CRITICAL PROBLEMS

### Problem 1: Hardcoded Inputs
**Screens Affected:** Forecast, Optimizer
**Issue:**
```typescript
// forecast.tsx - inputs are hardcoded!
const response = await predictForecast({
  origin_port: 'Rotterdam',  // ← Should come from form/dashboard
  destination_port: 'Singapore',  // ← Should come from form/dashboard
  // ... 20+ more hardcoded values
});
```

**Impact:** Form inputs are ignored; predictions always use same data

### Problem 2: No Form → API Connection
**Screens Affected:** All prediction screens
**Issue:** Voyage planner on dashboard (origin, destination, cargo, vessel) doesn't connect to forecast/optimizer screens

**Impact:** User can't input parameters; predictions are always the same

### Problem 3: No Error Handling
**Example:**
```typescript
// No try/catch; if API fails, app crashes
const response = await predictForecast({...});
setForecastRate(values[values.length - 1] ?? null);  // ← Can fail silently
```

**Impact:** Any API failure will crash the screen

### Problem 4: No Authentication
**Issue:** Login doesn't validate credentials; anyone gets into dashboard

```typescript
const handleLogin = () => {
  setTimeout(() => {
    router.replace('/(main)/dashboard');  // ← Always succeeds!
  }, 1400);
};
```

**Impact:** No security; no session management

---

## 🔧 FIX ROADMAP

### Phase 1: Critical Auth (Today - 1 hour)
```typescript
// Make login actually call API
const handleLogin = async () => {
  setLoading(true);
  const result = await loginUser(email, password);
  if (result.ok) {
    await AsyncStorage.setItem('auth_token', result.data.token);
    router.replace('/(main)/dashboard');
  } else {
    setError(result.error);
  }
  setLoading(false);
};
```

### Phase 2: Wire Forms to APIs (Today - 2 hours)
```typescript
// Make forecast use form inputs instead of hardcoded
const handleAnalyze = async () => {
  try {
    const response = await predictForecast({
      origin_port: originInput,  // ← From form, not hardcoded
      destination_port: destinationInput,  // ← From form
      // ... rest from form
    });
    if (response.ok) {
      setForecastRate(response.data.prediction);
    } else {
      setError(response.error);
    }
  } catch (err) {
    setError('Network error');
  }
};
```

### Phase 3: Add Protected Routes (1 hour)
```typescript
// In app/(main)/_layout.tsx
export default function MainLayout() {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) return <SplashScreen />;
  if (!authed) return null;  // Redirect to login
  
  return <Stack>...</Stack>;
}
```

### Phase 4: Hook Up Remaining APIs (2-3 hours)
- Risk screen → predictRisk()
- Profile → getCurrentUser()
- Settings → getSettings()
- Vessels → getFleet()
- Etc.

### Phase 5: Error Handling UI (1 hour)
Add error states to all screens with retry buttons

---

## 💡 QUICK FIX EXAMPLES

### Example 1: Fix Login
**Before:**
```typescript
const handleLogin = () => {
  setTimeout(() => {
    router.replace('/(main)/dashboard');
  }, 1400);
};
```

**After:**
```typescript
const handleLogin = async () => {
  try {
    const result = await loginUser(email, password);
    if (result.ok) {
      await AsyncStorage.setItem('token', result.data.token);
      router.replace('/(main)/dashboard');
    } else {
      Alert.alert('Login Failed', result.error);
    }
  } catch (err) {
    Alert.alert('Error', 'Network connection failed');
  }
};
```

### Example 2: Fix Forecast Form Connection
**Before:**
```typescript
const handleRefresh = async () => {
  const response = await predictForecast({
    origin_port: 'Rotterdam',  // Hardcoded!
    destination_port: 'Singapore',  // Hardcoded!
  });
};
```

**After:**
```typescript
const handleRefresh = async () => {
  if (!originPort || !destinationPort) {
    setError('Please fill in all fields');
    return;
  }
  
  try {
    const response = await predictForecast({
      origin_port: originPort,  // From state
      destination_port: destinationPort,  // From state
      // ... rest from state
    });
    
    if (response.ok) {
      setForecastRate(response.data.prediction);
      setError(null);
    } else {
      setError(response.error);
    }
  } catch (err) {
    setError('Failed to fetch prediction');
  }
};
```

### Example 3: Fix Risk Screen
**Before:**
```typescript
// No API call; just hardcoded data
const [riskData] = useState({
  prediction: 'MEDIUM',
  probability: 68,
  factors: [...]
});
```

**After:**
```typescript
const [risk, setRisk] = useState<any>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

const analyzeRisk = async () => {
  setLoading(true);
  try {
    const result = await predictRisk({
      freight_rate: formData.freightRate,
      freight_volatility: formData.volatility,
      bdi: formData.bdi,
      // ... all parameters from form
    });
    
    if (result.ok) {
      setRisk(result.data);
      setError('');
    } else {
      setError(result.error);
    }
  } catch (err) {
    setError('Failed to analyze risk');
  } finally {
    setLoading(false);
  }
};
```

---

## 📈 Integration Progress Tracker

### Week 1 Goal: Core APIs Working
- [x] Create API service module - DONE
- [ ] Implement real login/auth
- [ ] Wire forecast/optimizer form inputs
- [ ] Implement risk prediction
- [ ] Add error handling

### Week 2 Goal: Full Integration
- [ ] Connect profile, settings, alerts
- [ ] Implement vessel fleet
- [ ] Add reports generation
- [ ] WebSocket for real-time alerts

### Week 3 Goal: Polish & Testing
- [ ] Error recovery flows
- [ ] Loading states for all screens
- [ ] User testing
- [ ] Performance optimization

---

## ✅ Testing Checklist

Before considering the app "done", verify:

### Authentication ✅
- [ ] Login with valid credentials → Dashboard
- [ ] Login with invalid → Error message
- [ ] Logout → Redirects to login
- [ ] Back button → Cannot access dashboard
- [ ] Token persists across app restart

### Predictions ✅
- [ ] Forecast: Enter origin/destination/cargo → Get prediction
- [ ] Optimizer: Enter vessel details → Get idle hours
- [ ] Risk: Enter risk factors → Get risk level

### Error Handling ✅
- [ ] Network down → Shows error, allows retry
- [ ] API error → Shows error message
- [ ] Invalid input → Shows validation error

### UI/UX ✅
- [ ] Loading spinner during API calls
- [ ] Success feedback after prediction
- [ ] Error state recoverable (retry button)
- [ ] Mobile responsive at all widths

---

*Status: Frontend UI Complete (95%)|API Integration Started (13%)*
*Estimated Time to MVP: 4-6 hours*
