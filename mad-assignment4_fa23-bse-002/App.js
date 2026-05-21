import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import * as Location from 'expo-location';

let MapView, Marker, Circle;
try {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  Circle = Maps.Circle;
} catch (e) {
  MapView = null;
  Marker = null;
  Circle = null;
}

const { width } = Dimensions.get('window');
const GEOFENCE_RADIUS = 500;

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isWatching, setIsWatching] = useState(false);
  const [locationHistory, setLocationHistory] = useState([]);
  const [accuracy, setAccuracy] = useState('Balanced');
  const [messages, setMessages] = useState([]);
  const [insideGeofence, setInsideGeofence] = useState(false);
  const [activeTab, setActiveTab] = useState('map');
  const [mapReady, setMapReady] = useState(false);

  const watcherRef = useRef(null);
  const mapRef = useRef(null);

  const geofenceCenter = location
    ? {
        latitude: location.coords.latitude + 0.002,
        longitude: location.coords.longitude + 0.002,
      }
    : null;

  const accuracyOptions = {
    Lowest: Location.Accuracy.Lowest,
    Low: Location.Accuracy.Low,
    Balanced: Location.Accuracy.Balanced,
    High: Location.Accuracy.High,
    Highest: Location.Accuracy.Highest,
    BestForNav: Location.Accuracy.BestForNavigation,
  };

  const batteryLabel = {
    Lowest: '🟢 Minimal',
    Low: '🟡 Low',
    Balanced: '🟠 Medium',
    High: '🔴 High',
    Highest: '🔴 Very High',
    BestForNav: '🔴 Max Drain',
  };

  function broadcastMessage(msg) {
    const time = new Date().toLocaleTimeString();
    setMessages(prev => [`[${time}] ${msg}`, ...prev].slice(0, 30));
  }

  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function checkGeofence(coords) {
    if (!geofenceCenter) return;
    const dist = getDistance(
      coords.latitude,
      coords.longitude,
      geofenceCenter.latitude,
      geofenceCenter.longitude
    );
    const inside = dist <= GEOFENCE_RADIUS;
    if (inside !== insideGeofence) {
      setInsideGeofence(inside);
      broadcastMessage(inside ? '🟢 Entered Geofence Zone!' : '🔴 Exited Geofence Zone!');
    }
  }

  async function requestPermissions() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Location permission denied.');
      return false;
    }
    broadcastMessage('✅ Foreground permission granted');
    return true;
  }

  async function getOneTimeLocation() {
    const ok = await requestPermissions();
    if (!ok) return;
    broadcastMessage('📍 Fetching one-time location...');
    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: accuracyOptions[accuracy],
      });
      setLocation(loc);
      setLocationHistory(prev => [loc, ...prev].slice(0, 10));
      broadcastMessage(
        `📍 Got: ${loc.coords.latitude.toFixed(5)}, ${loc.coords.longitude.toFixed(5)}`
      );
      checkGeofence(loc.coords);
    } catch (e) {
      broadcastMessage('❌ Failed to get location');
      setErrorMsg('Could not get location.');
    }
  }

  async function startContinuousLocation() {
    const ok = await requestPermissions();
    if (!ok) return;
    broadcastMessage('🔄 Continuous tracking started...');
    setIsWatching(true);
    watcherRef.current = await Location.watchPositionAsync(
      {
        accuracy: accuracyOptions[accuracy],
        timeInterval: 3000,
        distanceInterval: 5,
      },
      loc => {
        setLocation(loc);
        setLocationHistory(prev => [loc, ...prev].slice(0, 10));
        checkGeofence(loc.coords);
        broadcastMessage(
          `🔄 Updated: ${loc.coords.latitude.toFixed(5)}, ${loc.coords.longitude.toFixed(5)}`
        );
      }
    );
  }

  function stopContinuousLocation() {
    if (watcherRef.current) {
      watcherRef.current.remove();
      watcherRef.current = null;
    }
    setIsWatching(false);
    broadcastMessage('⛔ Continuous tracking stopped');
  }

  useEffect(() => {
    return () => {
      if (watcherRef.current) watcherRef.current.remove();
    };
  }, []);

  const mapRegion = location
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : {
        latitude: 34.1688,
        longitude: 73.2215,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

  function renderMap() {
    if (!MapView) {
      return (
        <View style={styles.noMap}>
          <Text style={styles.noMapIcon}>🗺️</Text>
          <Text style={styles.noMapTitle}>Map not available here</Text>
          <Text style={styles.noMapText}>
            react-native-maps only works on a real device or emulator.
          </Text>
          <Text style={styles.noMapText}>
            📱 Scan the QR code with <Text style={{ color: '#4A90E2' }}>Expo Go</Text> to see the map.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          region={mapRegion}
          showsUserLocation
          showsMyLocationButton
          onMapReady={() => setMapReady(true)}>
          {location && (
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="You are here"
              description={`Accuracy: ${location.coords.accuracy?.toFixed(1)}m`}
              pinColor="#4A90E2"
            />
          )}
          {locationHistory.slice(1).map((loc, i) => (
            <Marker
              key={i}
              coordinate={{
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
              }}
              title={`History #${i + 1}`}
              pinColor="#94A3B8"
            />
          ))}
          {geofenceCenter && (
            <>
              <Marker
                coordinate={geofenceCenter}
                title="Geofence Center"
                description={`Radius: ${GEOFENCE_RADIUS}m`}
                pinColor="#F59E0B"
              />
              <Circle
                center={geofenceCenter}
                radius={GEOFENCE_RADIUS}
                strokeColor={insideGeofence ? '#00C853' : '#FF5252'}
                fillColor={
                  insideGeofence ? 'rgba(0,200,83,0.15)' : 'rgba(255,82,82,0.15)'
                }
                strokeWidth={2}
              />
            </>
          )}
        </MapView>
        <View style={styles.mapBadge}>
          <Text style={styles.mapBadgeText}>
            {insideGeofence ? '🟢 Inside Geofence' : '🔴 Outside Geofence'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📍 Location Explorer</Text>
        <Text style={styles.headerSub}>Assignment 4 — React Native Maps</Text>
      </View>

      <View style={styles.tabBar}>
        {[
          { key: 'map', icon: '🗺️', label: 'Map' },
          { key: 'controls', icon: '🎛️', label: 'Controls' },
          { key: 'info', icon: 'ℹ️', label: 'Info' },
          { key: 'messages', icon: '📢', label: 'Broadcast' },
        ].map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key)}>
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.activeTabLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'map' && renderMap()}

      {activeTab === 'controls' && (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>🎯 Accuracy Level</Text>
          <View style={styles.batteryRow}>
            <Text style={styles.batteryText}>Battery drain: </Text>
            <Text style={styles.batteryValue}>{batteryLabel[accuracy]}</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {Object.keys(accuracyOptions).map(key => (
              <TouchableOpacity
                key={key}
                style={[styles.chip, accuracy === key && styles.chipActive]}
                onPress={() => {
                  setAccuracy(key);
                  broadcastMessage(`🎯 Accuracy changed to: ${key}`);
                }}>
                <Text style={[styles.chipText, accuracy === key && styles.chipTextActive]}>
                  {key}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>📍 Location Type</Text>

          <TouchableOpacity style={styles.btn} onPress={getOneTimeLocation}>
            <Text style={styles.btnText}>📌  One-Time Location</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, isWatching ? styles.btnRed : styles.btnGreen]}
            onPress={isWatching ? stopContinuousLocation : startContinuousLocation}>
            <Text style={styles.btnText}>
              {isWatching ? '⛔  Stop Continuous Tracking' : '🔄  Start Continuous Tracking'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>🔵 Geofencing Info</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>
              A virtual boundary (500m circle) is drawn 200m northeast of your location.
              When your device moves in/out of this boundary, a broadcast fires automatically.
            </Text>
            <View style={styles.divider} />
            <Text style={[styles.cardText, { color: insideGeofence ? '#4ADE80' : '#F87171', fontWeight: '700' }]}>
              Current Status: {insideGeofence ? '✅ Inside Zone' : '❌ Outside Zone'}
            </Text>
          </View>
        </ScrollView>
      )}

      {activeTab === 'info' && (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>📊 Current Location Data</Text>
          {location ? (
            <>
              <InfoRow label="🌐 Latitude" value={location.coords.latitude.toFixed(6)} />
              <InfoRow label="🌐 Longitude" value={location.coords.longitude.toFixed(6)} />
              <InfoRow
                label="🎯 Accuracy"
                value={`±${location.coords.accuracy?.toFixed(1)} m`}
              />
              <InfoRow
                label="🏔️ Altitude"
                value={`${location.coords.altitude?.toFixed(1) ?? 'N/A'} m`}
              />
              <InfoRow
                label="💨 Speed"
                value={`${location.coords.speed?.toFixed(2) ?? '0.00'} m/s`}
              />
              <InfoRow
                label="🧭 Heading"
                value={`${location.coords.heading?.toFixed(1) ?? 'N/A'}°`}
              />
              <InfoRow
                label="🕐 Time"
                value={new Date(location.timestamp).toLocaleTimeString()}
              />
              <InfoRow label="📜 History Points" value={`${locationHistory.length} / 10`} />
            </>
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>No location fetched yet</Text>
              <Text style={styles.emptyHint}>Go to Controls → Get Location</Text>
            </View>
          )}

          <Text style={styles.sectionTitle}>📚 Concepts</Text>
          <TheoryCard
            icon="🟦"
            title="Foreground Location"
            desc="Active when app is open. Uses GPS + WiFi + Cell towers. More accurate but uses more battery."
          />
          <TheoryCard
            icon="⬛"
            title="Background Location"
            desc="Continues when app is minimized. Needs special permission. Used in tracking/delivery apps."
          />
          <TheoryCard
            icon="📌"
            title="One-Time Location"
            desc="Single location request. Fast and battery-efficient. Good for checkout or form fill."
          />
          <TheoryCard
            icon="🔄"
            title="Continuous Location"
            desc="Keeps updating by time (timeInterval) or distance (distanceInterval). Used in navigation."
          />
          <TheoryCard
            icon="🔋"
            title="Accuracy vs Battery"
            desc="BestForNavigation = GPS only = most accurate but drains battery fastest. Lowest = cell towers only = least accurate but very efficient."
          />
          <TheoryCard
            icon="🔵"
            title="Geofencing"
            desc="Virtual geographic boundary. App gets notified on enter/exit. Used in store alerts, parental controls, and fleet tracking."
          />
          <TheoryCard
            icon="📢"
            title="Broadcast Messaging"
            desc="App components communicate location events internally. Like a notification bus — one part fires an event, others listen and react."
          />
        </ScrollView>
      )}

      {activeTab === 'messages' && (
        <View style={styles.msgContainer}>
          <View style={styles.msgHeader}>
            <Text style={styles.sectionTitle}>📢 Broadcast Log</Text>
            <TouchableOpacity onPress={() => setMessages([])}>
              <Text style={styles.clearText}>🗑️ Clear</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.msgSubtitle}>
            Real-time events from location & geofence
          </Text>
          <ScrollView style={styles.msgList}>
            {messages.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyIcon}>📭</Text>
                <Text style={styles.emptyText}>No events yet</Text>
                <Text style={styles.emptyHint}>Trigger location actions to see logs</Text>
              </View>
            ) : (
              messages.map((msg, i) => (
                <View key={i} style={[styles.msgItem, i === 0 && styles.msgItemNew]}>
                  <Text style={styles.msgText}>{msg}</Text>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      )}

      {errorMsg && (
        <View style={styles.errorBar}>
          <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
        </View>
      )}
    </View>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function TheoryCard({ icon, title, desc }) {
  return (
    <View style={styles.theoryCard}>
      <Text style={styles.theoryIcon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.theoryTitle}>{title}</Text>
        <Text style={styles.theoryDesc}>{desc}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: {
    backgroundColor: '#1E293B',
    paddingTop: 52,
    paddingBottom: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitle: { color: '#F8FAFC', fontSize: 20, fontWeight: '800' },
  headerSub: { color: '#64748B', fontSize: 12, marginTop: 3 },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#4A90E2' },
  tabIcon: { fontSize: 16 },
  tabLabel: { fontSize: 10, color: '#64748B', marginTop: 2 },
  activeTabLabel: { color: '#4A90E2', fontWeight: '600' },
  mapContainer: { flex: 1 },
  map: { flex: 1 },
  mapBadge: {
    position: 'absolute',
    top: 14,
    alignSelf: 'center',
    backgroundColor: 'rgba(15,23,42,0.88)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  mapBadgeText: { color: '#F8FAFC', fontWeight: '700', fontSize: 13 },
  noMap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#0F172A',
  },
  noMapIcon: { fontSize: 56, marginBottom: 16 },
  noMapTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '700', marginBottom: 10 },
  noMapText: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 6,
  },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
  },
  batteryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  batteryText: { color: '#94A3B8', fontSize: 13 },
  batteryValue: { color: '#F59E0B', fontSize: 13, fontWeight: '700' },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  chipActive: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  chipText: { color: '#94A3B8', fontSize: 13 },
  chipTextActive: { color: '#fff', fontWeight: '700' },
  btn: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnGreen: { backgroundColor: '#059669' },
  btnRed: { backgroundColor: '#DC2626' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  cardText: { color: '#CBD5E1', fontSize: 13, lineHeight: 20 },
  divider: { height: 1, backgroundColor: '#334155', marginVertical: 10 },
  infoRow: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: { color: '#94A3B8', fontSize: 13 },
  infoValue: { color: '#4A90E2', fontWeight: '700', fontSize: 14 },
  theoryCard: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  theoryIcon: { fontSize: 20, marginTop: 2 },
  theoryTitle: { color: '#F8FAFC', fontSize: 14, fontWeight: '700', marginBottom: 4 },
  theoryDesc: { color: '#94A3B8', fontSize: 13, lineHeight: 19 },
  emptyBox: { alignItems: 'center', marginTop: 40, marginBottom: 20 },
  emptyIcon: { fontSize: 40, marginBottom: 10 },
  emptyText: { color: '#94A3B8', fontSize: 15, fontWeight: '600' },
  emptyHint: { color: '#475569', fontSize: 13, marginTop: 4 },
  msgContainer: { flex: 1, padding: 16 },
  msgHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  msgSubtitle: { color: '#475569', fontSize: 12, marginBottom: 12 },
  clearText: { color: '#EF4444', fontSize: 13, fontWeight: '600' },
  msgList: { flex: 1 },
  msgItem: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#334155',
  },
  msgItemNew: { borderLeftColor: '#4A90E2' },
  msgText: { color: '#CBD5E1', fontSize: 13, lineHeight: 18 },
  errorBar: {
    backgroundColor: '#7F1D1D',
    padding: 12,
  },
  errorText: { color: '#FCA5A5', textAlign: 'center', fontSize: 13 },
});