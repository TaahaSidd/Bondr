import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ToastAndroid, Platform, Alert } from "react-native";
import Constants from 'expo-constants'; // Import Expo Constants

import { useTheme } from "../context/ThemeContext";
import { SettingsGroup } from "../components/SettingsGroup";
import { staffApi } from "../api/staffApi";

export default function SettingsScreen({ navigation }) {
    const { theme, isDark, toggleTheme } = useTheme();
    const s = makeStyles(theme);

    const [staffCount, setStaffCount] = useState(null);

    // Dynamic version from app.json
    const appVersion = Constants.expoConfig?.version || "1.0.0";

    useEffect(() => {
        staffApi.getAllStaff()
            .then(r => setStaffCount(r.data.length))
            .catch(() => setStaffCount(null));
    }, []);

    const showVersionToast = () => {
        const msg = `Tack Version ${appVersion}`;
        if (Platform.OS === 'android') {
            ToastAndroid.show(msg, ToastAndroid.SHORT);
        } else {
            // ToastAndroid doesn't exist on iOS, using Alert as a fallback
            Alert.alert("App Info", msg);
        }
    };

    const businessItems = [
        { icon: "business-outline", label: "Company Profile", value: "FoxGlue" },
        {
            icon: "people-outline",
            label: "Staff Management",
            value: staffCount !== null ? `${staffCount} Members` : "—",
            onPress: () => navigation.navigate("Staff"),
        },
    ];

    const preferenceItems = [
        {
            icon: "moon-outline",
            label: "Dark Mode",
            type: "toggle",
            value: isDark,
            onValueChange: toggleTheme,
        },
    ];

    const supportItems = [
        { icon: "cloud-download-outline", label: "Export Data", value: "CSV / PDF" },
        { icon: "help-circle-outline", label: "Support" },
        {
            icon: "information-circle-outline",
            label: "Version",
            value: appVersion,
            onPress: showVersionToast // Triggers the toast/alert
        },
    ];

    return (
        <View style={s.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
                <Text style={s.screenTitle}>Settings</Text>

                <SettingsGroup title="Business" items={businessItems} />
                <SettingsGroup title="Preferences" items={preferenceItems} />
                <SettingsGroup title="Data & Support" items={supportItems} />

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

// ... styles remain the same

const makeStyles = (theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },

    screenTitle: {
        fontSize: 22, fontWeight: "700",
        color: theme.colors.onSurface, marginBottom: 16, marginTop: 24,
    },
    profileCard: {
        flexDirection: "row", alignItems: "center", gap: 14,
        backgroundColor: theme.colors.surfaceContainerLowest,
        padding: 16, borderRadius: 16, marginBottom: 24,
        borderWidth: 1, borderColor: theme.colors.outlineVariant,
    },
    avatar: {
        width: 52, height: 52, borderRadius: 14,
        backgroundColor: theme.colors.primaryContainer,
        justifyContent: "center", alignItems: "center",
    },
    userName: { fontSize: 15, fontWeight: "700", color: theme.colors.onSurface },
    userRole: { fontSize: 13, color: theme.colors.onSurfaceVariant, marginTop: 2 },
});