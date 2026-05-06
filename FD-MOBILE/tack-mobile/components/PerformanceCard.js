import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export const PerformanceCard = ({ efficiency, trend }) => {
    const { theme } = useTheme();
    const s = makeStyles(theme);

    return (
        <View style={s.card}>
            <View style={s.header}>
                <Ionicons name="trending-up" size={16} color={theme.colors.outline} />
                <Text style={s.headerLabel}>24H EFFICIENCY</Text>
            </View>
            <View style={s.valueRow}>
                <Text style={s.valueText}>{efficiency}%</Text>
                <Text style={s.trendText}>{trend}</Text>
            </View>
        </View>
    );
};

const makeStyles = (theme) => StyleSheet.create({
    card: {
        backgroundColor: theme.colors.surfaceContainerLowest,
        padding: 16,
        borderRadius: 12,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    headerLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: theme.colors.outline,
        marginLeft: 6,
        letterSpacing: 0.5
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between'
    },
    valueText: {
        fontSize: 32,
        fontWeight: '700',
        color: theme.colors.onSurface
    },
    trendText: {
        fontSize: 12,
        color: theme.colors.tertiary,
        fontWeight: '600'
    },
});