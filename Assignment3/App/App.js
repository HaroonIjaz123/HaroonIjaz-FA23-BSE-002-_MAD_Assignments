import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const telephoneIcon = require('./telephone.png');
const cameraIcon = require('./camera.png');
const camRecorderIcon = require('./cam-recorder.png');
const searchIcon = require('./search.png');
const statusIcon = require('./status.png');

const chatsData = [
  {
    id: '1',
    name: 'Ali Hassan',
    lastMessage: 'Bhai kal milte hain!',
    time: '10:45 AM',
    unread: 2,
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'Saleem Khan',
    lastMessage: 'Assignment bhej do please',
    time: '9:30 AM',
    unread: 0,
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    name: 'Study Group',
    lastMessage: 'Ahmed: Notes upload ho gaye',
    time: 'Yesterday',
    unread: 5,
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: '4',
    name: 'Usman Tariq',
    lastMessage: 'Okay done',
    time: 'Yesterday',
    unread: 0,
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
  {
    id: '5',
    name: 'Hamza Bhai',
    lastMessage: 'Haha sahi kaha',
    time: 'Mon',
    unread: 0,
    avatar: 'https://i.pravatar.cc/150?img=6',
  },
  {
    id: '6',
    name: 'Husnain',
    lastMessage: 'Thanks for helping!',
    time: 'Sun',
    unread: 0,
    avatar: 'https://i.pravatar.cc/150?img=7',
  },
];

const statusData = [
  {
    id: 'my',
    name: 'My Status',
    time: null,
    avatar: 'https://i.pravatar.cc/150?img=10',
    isMyStatus: true,
  },
  {
    id: 's1',
    name: 'Ali Hassan',
    time: '2 minutes ago',
    avatar: 'https://i.pravatar.cc/150?img=1',
    isMyStatus: false,
  },
  {
    id: 's2',
    name: 'Saleem Khan',
    time: '15 minutes ago',
    avatar: 'https://i.pravatar.cc/150?img=2',
    isMyStatus: false,
  },
  {
    id: 's3',
    name: 'Study Group',
    time: '1 hour ago',
    avatar: 'https://i.pravatar.cc/150?img=3',
    isMyStatus: false,
  },
  {
    id: 's4',
    name: 'Usman Tariq',
    time: '3 hours ago',
    avatar: 'https://i.pravatar.cc/150?img=4',
    isMyStatus: false,
  },
];

const callsData = [
  {
    id: 'c1',
    name: 'Ali Hassan',
    type: 'incoming',
    callType: 'voice',
    time: 'Today, 10:30 AM',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 'c2',
    name: 'Saleem Khan',
    type: 'outgoing',
    callType: 'video',
    time: 'Today, 9:00 AM',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: 'c3',
    name: 'Usman Tariq',
    type: 'missed',
    callType: 'voice',
    time: 'Yesterday, 8:45 PM',
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
  {
    id: 'c4',
    name: 'Hamza Bhai',
    type: 'outgoing',
    callType: 'video',
    time: 'Mon, 3:00 PM',
    avatar: 'https://i.pravatar.cc/150?img=6',
  },
];

function ChatsScreen() {
  const [search, setSearch] = useState('');

  const filteredChats = chatsData.filter(chat =>
    chat.name.toLowerCase().includes(search.toLowerCase()),
  );

  const ChatItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      </View>
      <View style={styles.chatInfo}>
        <View style={styles.chatTopRow}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        <View style={styles.chatBottomRow}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#075E54" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>WattsApp</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Image source={searchIcon} style={styles.headerIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Text style={styles.dotsIcon}>&#8942;</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search chats..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <FlatList
        data={filteredChats}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ChatItem item={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No chats found</Text>
        }
      />
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabMessageIcon}>&#128172;</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function StatusScreen() {
  const MyStatusItem = ({ item }) => (
    <TouchableOpacity style={styles.statusMyItem}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.addStatusIcon}>
          <Text style={styles.addStatusText}>+</Text>
        </View>
      </View>
      <View style={styles.statusInfo}>
        <Text style={styles.statusName}>{item.name}</Text>
        <Text style={styles.statusTime}>Tap to add status update</Text>
      </View>
    </TouchableOpacity>
  );

  const StatusItem = ({ item }) => (
    <TouchableOpacity style={styles.statusOtherItem}>
      <View style={styles.statusRing}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      </View>
      <View style={styles.statusInfo}>
        <Text style={styles.statusName}>{item.name}</Text>
        <Text style={styles.statusTime}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Status</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Text style={styles.dotsIcon}>&#8942;</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <Text style={styles.sectionLabel}>My Status</Text>
        <MyStatusItem item={statusData[0]} />
        <View style={styles.separator} />
        <Text style={styles.sectionLabel}>Recent Updates</Text>
        {statusData.slice(1).map(item => (
          <View key={item.id}>
            <StatusItem item={item} />
            <View style={styles.separator} />
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.fab}>
        <Image source={cameraIcon} style={styles.fabIcon} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function CallsScreen() {
  const getCallColor = type => {
    if (type === 'missed') return '#FF3B30';
    if (type === 'incoming') return '#34C759';
    return '#007AFF';
  };

  const getCallLabel = type => {
    if (type === 'missed') return 'Missed';
    if (type === 'incoming') return 'Incoming';
    return 'Outgoing';
  };

  const CallItem = ({ item }) => (
    <View style={styles.callItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.callInfo}>
        <Text
          style={[
            styles.callName,
            item.type === 'missed' && { color: '#FF3B30' },
          ]}>
          {item.name}
        </Text>
        <Text style={[styles.callMeta, { color: getCallColor(item.type) }]}>
          {getCallLabel(item.type)} · {item.time}
        </Text>
      </View>
      <TouchableOpacity style={styles.callActionBtn}>
        <Image
          source={item.callType === 'video' ? camRecorderIcon : telephoneIcon}
          style={[styles.callActionIcon, { tintColor: getCallColor(item.type) }]}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calls</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Image source={searchIcon} style={styles.headerIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Text style={styles.dotsIcon}>&#8942;</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.linkBanner}>
        <Image source={telephoneIcon} style={styles.linkBannerImg} />
        <View>
          <Text style={styles.linkBannerTitle}>Create Call Link</Text>
          <Text style={styles.linkBannerSubtitle}>
            Share a link for a WattsApp call
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.separator} />
      <Text style={styles.sectionLabel}>Recent</Text>
      <FlatList
        data={callsData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <CallItem item={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <TouchableOpacity style={styles.fab}>
        <Image source={telephoneIcon} style={styles.fabIcon} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#075E54',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#ddd',
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tab.Screen
        name="Chats"
        component={ChatsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22, color: focused ? '#075E54' : '#888' }}>
              &#128172;
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Status"
        component={StatusScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={statusIcon}
              style={[styles.tabIcon, { tintColor: focused ? '#075E54' : '#888' }]}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Calls"
        component={CallsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={telephoneIcon}
              style={[styles.tabIcon, { tintColor: focused ? '#075E54' : '#888' }]}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#075E54',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconBtn: {
    marginLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsIcon: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerIcon: {
    width: 22,
    height: 22,
    tintColor: '#fff',
    resizeMode: 'contain',
  },
  tabIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  fabIcon: {
    width: 26,
    height: 26,
    tintColor: '#fff',
    resizeMode: 'contain',
  },
  fabMessageIcon: {
    fontSize: 26,
    color: '#fff',
  },
  linkBannerImg: {
    width: 28,
    height: 28,
    tintColor: '#075E54',
    resizeMode: 'contain',
    marginRight: 10,
  },
  callActionIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  searchContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#ccc',
  },
  chatInfo: {
    flex: 1,
  },
  chatTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  chatTime: {
    fontSize: 12,
    color: '#888',
  },
  chatBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#25D366',
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  unreadText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 82,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#25D366',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 40,
    fontSize: 15,
  },
  sectionLabel: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#075E54',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  statusMyItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  statusOtherItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  addStatusIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#075E54',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  addStatusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  statusRing: {
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#25D366',
    padding: 2,
    marginRight: 14,
  },
  statusInfo: {
    flex: 1,
  },
  statusName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 3,
  },
  statusTime: {
    fontSize: 13,
    color: '#888',
  },
  linkBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    gap: 14,
  },
  linkBannerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#075E54',
  },
  linkBannerSubtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  callItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  callInfo: {
    flex: 1,
    marginLeft: 14,
  },
  callName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 3,
  },
  callMeta: {
    fontSize: 13,
  },
  callActionBtn: {
    padding: 8,
  },
});