import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import your screens
import { HomeScreen } from "./screens/HomeScreen";
import MaterialsScreen from "./screens/MaterialsScreen";
import BatchesScreen from "./screens/BatchesScreen";
import StockScreen from "./screens/StockScreen";
import OrdersScreen from "./screens/OrdersScreen";
import SettingsScreen from "./screens/SettingsScreen";
import StaffScreen from "./screens/StaffScreen";

const Stack = createNativeStackNavigator();

export default function App() {
    const isDarkMode = false;

    return (
        <SafeAreaProvider>
            {/* Logic: Change status bar based on mode */}
            <StatusBar style={isDarkMode ? "light" : "dark"} />

            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Dashboard"
                    screenOptions={{
                        headerShown: false,
                        // Logic: Background color of the "under-layer" during transitions
                        contentStyle: {
                            backgroundColor: isDarkMode ? "#121212" : "#f8f9fa"
                        },
                        // Animation: Standard "slide from right" for deeper screens
                        animation: "slide_from_right",
                        orientation: "portrait"
                    }}
                >
                    {/* Dashboard Screen */}
                    <Stack.Screen
                        name="Dashboard"
                        component={HomeScreen}
                        options={{
                            animation: "fade" // Faster transition for top-level tabs
                        }}
                    />

                    {/* Materials Screen */}
                    <Stack.Screen
                        name="Materials"
                        component={MaterialsScreen}
                        options={{
                            animation: "fade" // Keep tab-like feel
                        }}
                    />
                    <Stack.Screen
                        name="Batches"
                        component={BatchesScreen}
                        options={{
                            animation: "fade"
                        }} />

                    {/* Add placeholders for the other routes so BottomNavBar doesn't crash */}
                    <Stack.Screen
                        name="Stock"
                        component={StockScreen}
                        options={{
                            animation: "fade"
                        }}
                    />
                    <Stack.Screen
                        name="Orders"
                        component={OrdersScreen}
                        options={{
                            animation: "fade"
                        }} />

                    <Stack.Screen
                        name="Settings"
                        component={SettingsScreen}
                        options={{
                            animation: "slide_from_right",
                            gestureEnabled: true
                        }}
                    />

                    <Stack.Screen
                                            name="Staff"
                                            component={StaffScreen}
                                            options={{
                                                animation: "slide_from_right",
                                                gestureEnabled: true
                                            }}
                                        />

                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}