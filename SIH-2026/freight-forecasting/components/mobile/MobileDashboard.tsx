import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import MobileHero from './MobileHero';
import MobileIntelligenceFeed from './MobileIntelligenceFeed';
import MobileLiveMap from './MobileLiveMap';
import MobileMarketOverview from './MobileMarketOverview';
import MobileQuickActions from './MobileQuickActions';
import MobileTopNav from './MobileTopNav';
import MobileVoyagePlanner from './MobileVoyagePlanner';

const NAVY = '#061840';

export default function MobileDashboard() {
  const [origin, setOrigin] = useState('Qingdao');
  const [destination, setDestination] = useState('Rotterdam');
  const [cargo, setCargo] = useState('Coal');
  const [quantity, setQuantity] = useState('75000');
  const [vessel, setVessel] = useState('Panamax');
  const [contract, setContract] = useState('Time Charter');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 2600);
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={NAVY} />
      <MobileTopNav />
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <MobileHero origin={origin} destination={destination} />
        <MobileVoyagePlanner
          origin={origin} destination={destination}
          cargo={cargo} quantity={quantity}
          vessel={vessel} contract={contract}
          onOriginChange={setOrigin} onDestinationChange={setDestination}
          onCargoChange={setCargo} onQuantityChange={setQuantity}
          onVesselChange={setVessel} onContractChange={setContract}
          onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing}
        />
        <MobileLiveMap origin={origin} destination={destination} />
        <MobileIntelligenceFeed />
        <MobileMarketOverview />
        <MobileQuickActions />
        <View style={s.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: NAVY },
  scroll: { flex: 1, backgroundColor: '#08131F' },
  content: { paddingHorizontal: 14, paddingTop: 14 },
  bottomPad: { height: 32 },
});
