import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export const MetricCard = ({ title, value, unit, subtext }) => {
    const { theme } = useTheme();
    const s = makeStyles(theme);

    return (
        <View style={s.card}>
            <Text style={s.label} numberOfLines={1}>{title}</Text>
            <View style={s.valueRow}>
                <Text style={s.value}>{value}</Text>
                <Text style={s.unit}>{unit}</Text>
            </View>
            {subtext && <Text style={s.subtext} numberOfLines={1}>{subtext}</Text>}
        </View>
    );
};

const makeStyles = (theme) => StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: theme.colors.surfaceContainerLowest,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
    },
    label: {
        fontSize: 11,
        fontWeight: "600",
        color: theme.colors.onSurfaceVariant,
        marginBottom: 8,
    },
    valueRow: {
        flexDirection: "row",
        alignItems: "baseline",
        gap: 3,
    },
    value: {
        fontSize: 20,
        fontWeight: "700",
        color: theme.colors.onSurface,
    },
    unit: {
        fontSize: 11,
        fontWeight: "500",
        color: theme.colors.onSurfaceVariant,
    },
    subtext: {
        fontSize: 11,
        color: theme.colors.outline,
        marginTop: 6,
    },
});