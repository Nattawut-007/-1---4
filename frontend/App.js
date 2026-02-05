import React, { useContext } from 'react';
import { Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, AuthContext } from './src/context/AuthContext';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import ManageBooksScreen from './src/screens/ManageBooksScreen';
import UsersScreen from './src/screens/UsersScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const UserTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="History" component={HistoryScreen} />
    {/* Profile/Logout could be here */}
  </Tab.Navigator>
);

const AdminTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Dashboard" component={AdminDashboardScreen} options={{ title: 'แดชบอร์ด' }} />
    <Tab.Screen name="ManageBooks" component={ManageBooksScreen} options={{ title: 'จัดการหนังสือ' }} />
    <Tab.Screen name="Users" component={UsersScreen} options={{ title: 'สมาชิก' }} />
  </Tab.Navigator>
);

const RootNavigator = () => {
  const { user, loading, logout } = useContext(AuthContext);

  if (loading) {
    return null; // Or Loading Spinner
  }

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator>
          {user.role === 'admin' ? (
            <Stack.Screen name="AdminApp" component={AdminTabs} options={{
              headerRight: () => <Button title="ออกจากระบบ" color="#e74c3c" onPress={logout} />,
              title: 'ระบบยืม-คืน (แอดมิน)',
              headerTitleStyle: { fontWeight: 'bold' }
            }} />
          ) : (
            <Stack.Screen name="UserApp" component={UserTabs} options={{
              headerRight: () => <Button title="ออกจากระบบ" color="#e74c3c" onPress={logout} />,
              title: `ยินดีต้อนรับคุณ ${user.username}`
            }} />
          )}
        </Stack.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
