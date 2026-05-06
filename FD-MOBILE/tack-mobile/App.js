import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
// Import DefaultTheme and DarkTheme
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ThemeProvider, useTheme } from "./context/ThemeContext";
import SplashScreen from "./screens/SplashScreen";

import { HomeScreen } from "./screens/HomeScreen";
import MaterialsScreen from "./screens/MaterialsScreen";
import BatchesScreen from "./screens/BatchesScreen";
import StockScreen from "./screens/StockScreen";
import OrdersScreen from "./screens/OrdersScreen";
import SettingsScreen from "./screens/SettingsScreen";
import StaffScreen from "./screens/StaffScreen";
import AllOrderScreen from "./screens/AllOrdersScreen";
import OrderDetailScreen from "./screens/OrderDetailScreen";
import ProductDetailsScreen from "./screens/ProductDetailsScreen";
import MaterialStockScreen from "./screens/MaterialStockScreen";

const Stack = createNativeStackNavigator();

function AppNavigator() {
    const { isDark, theme } = useTheme();
    const [showSplash, setShowSplash] = useState(true);

    // Create a React Navigation theme that matches your Tack theme
    const navTheme = {
        ...(isDark ? DarkTheme : DefaultTheme),
        colors: {
            ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
            background: theme.colors.background, // This kills the white flash
            card: theme.colors.surface,
            text: theme.colors.onSurface,
            border: theme.colors.outlineVariant,
            primary: theme.colors.primary,
        },
    };

    return (
        <>
            <StatusBar style={isDark ? "light" : "dark"} />

            {/* Apply navTheme here */}
            <NavigationContainer theme={navTheme}>
                <Stack.Navigator
                    initialRouteName="Dashboard"
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: theme.colors.background },
                        animation: "slide_from_right",
                        orientation: "portrait",
                    }}
                >
                    <Stack.Screen name="Dashboard" component={HomeScreen} options={{ animation: "fade" }} />
                    <Stack.Screen name="Materials" component={MaterialsScreen} options={{ animation: "fade" }} />
                    <Stack.Screen name="Batches" component={BatchesScreen} options={{ animation: "fade" }} />
                    <Stack.Screen name="Stock" component={StockScreen} options={{ animation: "fade" }} />
                    <Stack.Screen name="Orders" component={OrdersScreen} options={{ animation: "fade" }} />
                    <Stack.Screen name="Settings" component={SettingsScreen} options={{ animation: "slide_from_right", gestureEnabled: true }} />
                    <Stack.Screen name="Staff" component={StaffScreen} options={{ animation: "slide_from_right", gestureEnabled: true }} />
                    <Stack.Screen name="AllOrders" component={AllOrderScreen} options={{ animation: "slide_from_right", gestureEnabled: true }} />
                    <Stack.Screen name="OrderDetails" component={OrderDetailScreen} options={{ animation: "slide_from_right", gestureEnabled: true }} />
                    <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ animation: "slide_from_right", gestureEnabled: true }} />
                    <Stack.Screen name="MaterialStock" component={MaterialStockScreen} options={{ animation: "slide_from_right", gestureEnabled: true }} />
                </Stack.Navigator>
            </NavigationContainer>

            {/* Renders on top of everything, fades out then unmounts */}
            {showSplash && (
                <SplashScreen onFinish={() => setShowSplash(false)} />
            )}
        </>
    );
}

export default function App() {
    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <AppNavigator />
            </ThemeProvider>
        </SafeAreaProvider>
    );
}