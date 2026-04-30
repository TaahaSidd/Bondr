import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";
import { SettingsGroup } from "../components/SettingsGroup";

export default function SettingsScreen({ navigation }) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const businessItems = [
        { icon: "business-outline", label: "Company Profile", value: "Tack Manufacturing" },
        {
            icon: "people-outline",
            label: "Staff Management",
            value: "4 Members",
            onPress: () => navigation.navigate("Staff")
        },
        { icon: "receipt-outline", label: "Tax & Billing", value: "GST Enabled" },
        { icon: "location-outline", label: "Warehouses", value: "2 Active" },
    ];

    const preferenceItems = [
        {
            icon: "moon-outline",
            label: "Dark Mode",
            type: "toggle",
            value: isDarkMode,
            onValueChange: setIsDarkMode,
        },
        { icon: "notifications-outline", label: "Stock Alerts", value: "Enabled" },
    ];

    const supportItems = [
        { icon: "cloud-download-outline", label: "Export Data", value: "CSV/PDF" },
        { icon: "help-circle-outline", label: "Support" },
        { icon: "information-circle-outline", label: "Version", value: "1.0.4-beta" },
    ];

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Settings</Text>
                </View>

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarLarge}>
                        <Ionicons name="person" size={40} color={theme.colors.primary} />
                    </View>
                    <View>
                        <Text style={styles.userName}>Industrial Owner</Text>
                        <Text style={styles.userRole}>Administrator • Tack Pro</Text>
                    </View>
                </View>

                <SettingsGroup title="Business Details" items={businessItems} />
                <SettingsGroup title="App Preferences" items={preferenceItems} />
                <SettingsGroup title="Data & Support" items={supportItems} />

                <TouchableOpacity style={styles.logoutBtn}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollContent: { paddingHorizontal: 24, paddingTop: 60 },
    header: { marginBottom: 24 },
    title: { fontSize: 32, fontWeight: '700', color: theme.colors.onSurface },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant
    },
    avatarLarge: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: theme.colors.primaryContainer,
        justifyContent: 'center',
        alignItems: 'center'
    },
    userName: { fontSize: 20, fontWeight: '700', color: theme.colors.onSurface },
    userRole: { fontSize: 14, color: theme.colors.onSurfaceVariant },
    logoutBtn: {
        marginTop: 8,
        padding: 16,
        alignItems: 'center',
        borderRadius: 16,
        backgroundColor: '#fee2e2' // Light red background
    },
    logoutText: { color: '#ef4444', fontWeight: '700', fontSize: 16 }
});