import React, { useEffect, useState, useRef } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Auth Screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { ProfileScreen } from '../screens/auth/ProfileScreen';

// Main Screens
import { DashboardScreen } from '../screens/DashboardScreen';

// Plant Screens
import { AddPlantScreen } from '../screens/plants/AddPlantScreen';
import { MyPlantsScreen } from '../screens/plants/MyPlantsScreen';
import { PlantDetailsScreen } from '../screens/plants/PlantDetailsScreen';
import { PlantZonesScreen } from '../screens/plants/PlantZonesScreen';

// Community Screens
import { CommunityScreen } from '../screens/community/CommunityScreen';
import { CreatePostScreen } from '../screens/community/CreatePostScreen';
import { DiscoverUsersScreen } from '../screens/community/DiscoverUsersScreen';

// Help Screens
import { HelpRequestsScreen } from '../screens/help/HelpRequestsScreen';
import { CreateHelpRequestScreen } from '../screens/help/CreateHelpRequestScreen';

// Controllers
import { AuthController } from '../controllers/AuthController';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack Navigator
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { 
        backgroundColor: '#4CAF50',
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: '#fff',
      headerTitleStyle: { 
        fontWeight: 'bold',
        fontSize: 20,
      },
    }}
  >
    <Stack.Screen 
      name="Login" 
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="Register" 
      component={RegisterScreen}
      options={{ 
        title: 'Create Account',
        headerBackTitle: 'Back',
      }}
    />
  </Stack.Navigator>
);

// Plants Stack Navigator
const PlantsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { 
        backgroundColor: '#4CAF50',
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: '#fff',
      headerTitleStyle: { 
        fontWeight: 'bold',
        fontSize: 20,
      },
    }}
  >
    <Stack.Screen 
      name="MyPlants" 
      component={MyPlantsScreen}
      options={{ title: '🌱 My Plants' }}
    />
    <Stack.Screen 
      name="AddPlant" 
      component={AddPlantScreen}
      options={{ title: 'Add New Plant' }}
    />
    <Stack.Screen 
      name="PlantDetails" 
      component={PlantDetailsScreen}
      options={{ title: 'Plant Details' }}
    />
    <Stack.Screen 
      name="PlantZones" 
      component={PlantZonesScreen}
      options={{ title: 'Plant Zones' }}
    />
  </Stack.Navigator>
);

// Community Stack Navigator
const CommunityStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { 
        backgroundColor: '#4CAF50',
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: '#fff',
      headerTitleStyle: { 
        fontWeight: 'bold',
        fontSize: 20,
      },
    }}
  >
    <Stack.Screen 
      name="Community" 
      component={CommunityScreen}
      options={{ title: '👥 Community' }}
    />
    <Stack.Screen 
      name="CreatePost" 
      component={CreatePostScreen}
      options={{ title: 'Create Post' }}
    />
    <Stack.Screen 
      name="DiscoverUsers" 
      component={DiscoverUsersScreen}
      options={{ title: 'Discover Users' }}
    />
  </Stack.Navigator>
);

// Help Stack Navigator
const HelpStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { 
        backgroundColor: '#4CAF50',
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: '#fff',
      headerTitleStyle: { 
        fontWeight: 'bold',
        fontSize: 20,
      },
    }}
  >
    <Stack.Screen 
      name="HelpRequests" 
      component={HelpRequestsScreen}
      options={{ title: '🤝 Help Requests' }}
    />
    <Stack.Screen 
      name="CreateHelpRequest" 
      component={CreateHelpRequestScreen}
      options={{ title: 'Request Help' }}
    />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#4CAF50',
      tabBarInactiveTintColor: '#999',
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        height: 60,
        paddingBottom: 8,
        paddingTop: 8,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
      },
      headerShown: false,
    }}
  >
    <Tab.Screen 
      name="DashboardTab" 
      component={DashboardScreen}
      options={{
        title: 'Dashboard',
        tabBarIcon: ({ color, focused }) => (
          <Text style={{ fontSize: focused ? 28 : 24 }}>🏠</Text>
        ),
      }}
    />
    <Tab.Screen 
      name="PlantsTab" 
      component={PlantsStack}
      options={{
        title: 'Plants',
        tabBarIcon: ({ color, focused }) => (
          <Text style={{ fontSize: focused ? 28 : 24 }}>🌱</Text>
        ),
      }}
    />
    <Tab.Screen 
      name="CommunityTab" 
      component={CommunityStack}
      options={{
        title: 'Community',
        tabBarIcon: ({ color, focused }) => (
          <Text style={{ fontSize: focused ? 28 : 24 }}>👥</Text>
        ),
      }}
    />
    <Tab.Screen 
      name="HelpTab" 
      component={HelpStack}
      options={{
        title: 'Help',
        tabBarIcon: ({ color, focused }) => (
          <Text style={{ fontSize: focused ? 28 : 24 }}>🤝</Text>
        ),
      }}
    />
    <Tab.Screen 
      name="ProfileTab" 
      component={ProfileScreen}
      options={{
        title: 'Profile',
        tabBarIcon: ({ color, focused }) => (
          <Text style={{ fontSize: focused ? 28 : 24 }}>👤</Text>
        ),
        headerShown: true,
        headerStyle: { 
          backgroundColor: '#4CAF50',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#fff',
        headerTitleStyle: { 
          fontWeight: 'bold',
          fontSize: 20,
        },
        headerTitle: '👤 Profile',
      }}
    />
  </Tab.Navigator>
);

// Root Navigator with Auth Check
export const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const authController = useRef(new AuthController()).current;

  // Check login status
  const checkLoginStatus = async () => {
    try {
      const currentUser = await authController.getCurrentUser();
      setIsLoggedIn(!!currentUser);
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Check on mount
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // ALWAYS check login status every 2 seconds (both logged in and logged out)
  useEffect(() => {
    const interval = setInterval(() => {
      checkLoginStatus();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1F8E9' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ marginTop: 10, color: '#666' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;