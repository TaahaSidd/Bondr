import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export const StatCard = ({ label, value, subtext, type = "primary", style }) => {
    const { theme } = useTheme();
    const s = makeStyles(theme);

    // Dynamic value color selection based on theme colors
    const valueColor =
        type === "error" ? theme.colors.error :
            type === "tertiary" ? theme.colors.onTertiaryFixedVariant :
                theme.colors.primary;

    return (
        <View style={[s.card, style]}>
            <Text style={s.label}>{label}</Text>
            <Text style={[s.value, { color: valueColor }]}>{value}</Text>
            {subtext && <Text style={s.subtext}>{subtext}</Text>}
        </View>
    );
};

const makeStyles = (theme) => StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
        justifyContent: "space-between",
    },
    label: {
        fontSize: 11,
        fontWeight: "600",
        color: theme.colors.onSurfaceVariant,
        marginBottom: 8,
    },
    value: {
        fontSize: 20,
        fontWeight: "700",
    },
    subtext: {
        fontSize: 11,
        color: theme.colors.outline,
        marginTop: 4,
    },
});