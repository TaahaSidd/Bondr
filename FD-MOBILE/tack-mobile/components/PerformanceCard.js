import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";

export const PerformanceCard = ({ efficiency, trend }) => {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Ionicons name="trending-up" size={20} color={theme.colors.textSecondary} />
                <Text style={styles.headerLabel}>24H EFFICIENCY</Text>
            </View>
            <Text style={styles.valueText}>{efficiency}%</Text>
            <Text style={styles.trendText}>{trend} from yesterday</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#edf2fa", // Light blue tint from your screenshot
        padding: 20,
        borderRadius: theme.borderRadius.md,
        marginVertical: 20,
    },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    headerLabel: { fontSize: 12, fontWeight: '800', color: theme.colors.textSecondary, marginLeft: 8, letterSpacing: 0.5 },
    valueText: { fontSize: 42, fontWeight: 'bold', color: "#475569" },
    trendText: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 4, fontWeight: '500' },
});