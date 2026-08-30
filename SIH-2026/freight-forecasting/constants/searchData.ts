export type SearchItem = {
  label: string;
  path: string;
  type: 'page' | 'vessel' | 'cargo' | 'route' | 'port' | 'report' | 'setting' | 'risk' | 'forecast' | 'market' | 'optimizer';
  keywords: string[];
};

export const searchItems: SearchItem[] = [
  { label: 'Dashboard', path: '/(main)/dashboard', type: 'page', keywords: ['dashboard', 'home', 'overview', 'command center'] },
  { label: 'Freight Forecast', path: '/(main)/forecast', type: 'forecast', keywords: ['forecast', 'freight', 'rates', 'market'] },
  { label: 'Market Entry', path: '/(main)/market-entry', type: 'market', keywords: ['market entry', 'pricing', 'charter', 'market'] },
  { label: 'Risk Analysis', path: '/(main)/risk', type: 'risk', keywords: ['risk', 'weather', 'piracy', 'delay', 'storm'] },
  { label: 'Routes', path: '/(main)/routes', type: 'route', keywords: ['routes', 'corridors', 'voyage', 'lanes'] },
  { label: 'Reports', path: '/(main)/reports', type: 'report', keywords: ['reports', 'archive', 'voyage', 'summary'] },
  { label: 'Vessel Optimizer', path: '/(main)/vessels', type: 'vessel', keywords: ['vessel', 'fleet', 'optimizer', 'ship'] },
  { label: 'Cargo Optimizer', path: '/(main)/optimizer', type: 'optimizer', keywords: ['cargo optimizer', 'cargo', 'optimization', 'voyage'] },
  { label: 'Policy', path: '/(main)/policy', type: 'setting', keywords: ['policy', 'compliance', 'governance', 'chartering'] },
  { label: 'Alerts', path: '/(main)/alerts', type: 'page', keywords: ['alerts', 'warning', 'monitoring', 'risk'] },
  { label: 'Settings', path: '/(main)/settings', type: 'setting', keywords: ['settings', 'preferences', 'system', 'alert configuration'] },
  { label: 'Profile', path: '/(main)/profile', type: 'page', keywords: ['profile', 'account', 'user', 'identity'] },
  { label: 'Statistics', path: '/(main)/stats', type: 'page', keywords: ['statistics', 'stats', 'metrics', 'analytics'] },
  { label: 'Simulator', path: '/(main)/simulator', type: 'optimizer', keywords: ['simulator', 'scenario', 'model', 'forecasting'] },
  { label: 'Waste', path: '/(main)/waste', type: 'page', keywords: ['waste', 'environment', 'compliance', 'discharge'] },
  { label: 'Rotterdam Port', path: '/(main)/routes', type: 'port', keywords: ['rotterdam', 'port', 'berth', 'terminal'] },
  { label: 'Singapore Port', path: '/(main)/routes', type: 'port', keywords: ['singapore', 'port', 'terminal', 'hub'] },
  { label: 'Panamax Bulk Carrier', path: '/(main)/vessels', type: 'vessel', keywords: ['panamax', 'bulk carrier', 'vessel class'] },
  { label: 'Coal Cargo', path: '/(main)/optimizer', type: 'cargo', keywords: ['coal', 'cargo', 'commodity', 'bulk'] },
  { label: 'Time Charter Contract', path: '/(main)/reports', type: 'report', keywords: ['time charter', 'contract', 'agreement', 'charter'] },
];
