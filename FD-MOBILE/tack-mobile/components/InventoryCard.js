import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export const InventoryCard = ({ name, sku, quantity, unit, unitCost, status, progress }) => {
    const { theme } = useTheme();
    const s = makeStyles(theme);

    const isOut = status === "OUT OF STOCK";
    const isLow = status === "LOW STOCK";

    // Dynamic color logic based on status and theme
    const badgeBg = isOut ? theme.colors.errorContainer : isLow ? theme.colors.warningContainer : theme.colors.tertiaryFixed;
    const badgeText = isOut ? theme.colors.onErrorContainer : isLow ? theme.colors.onWarningContainer : theme.colors.onTertiaryFixedVariant;
    const barColor = isOut ? theme.colors.error : isLow ? "#f59e0b" : theme.colors.primary;

    return (
        <View style={s.card}>
            {/* Row 1: name + badge */}
            <View style={s.topRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={s.name} numberOfLines={1}>{name}</Text>
                    <Text style={s.sku} numberOfLines={1}>{sku}</Text>
                </View>
                <View style={[s.badge, { backgroundColor: badgeBg }]}>
                    <Text style={[s.badgeText, { color: badgeText }]}>{status}</Text>
                </View>
            </View>

            {/* Row 2: quantity + cost */}
            <View style={s.bottomRow}>
                <Text style={s.qty}>
                    {quantity} <Text style={s.unit}>{unit}</Text>
                </Text>
                <Text style={s.cost}>₹{unitCost} / kg</Text>
            </View>

            {/* Progress bar */}
            <View style={s.track}>
                <View style={[s.bar, { width: `${progress}%`, backgroundColor: barColor }]} />
            </View>
        </View>
    );
};

const makeStyles = (theme) => StyleSheet.create({
    card: {
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 8,
    },
    name: {
        fontSize: 14,
        fontWeight: "700",
        color: theme.colors.onSurface,
    },
    sku: {
        fontSize: 11,
        color: theme.colors.outline,
        marginTop: 2,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        alignSelf: "flex-start",
    },
    badgeText: {
        fontSize: 10,
        fontWeight: "700",
    },
    bottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: 10,
    },
    qty: {
        fontSize: 16,
        fontWeight: "700",
        color: theme.colors.onSurface,
    },
    unit: {
        fontSize: 12,
        fontWeight: "500",
        color: theme.colors.outline,
    },
    cost: {
        fontSize: 13,
        fontWeight: "600",
        color: theme.colors.onSurfaceVariant,
    },
    track: {
        height: 3,
        backgroundColor: theme.colors.surfaceContainer,
        borderRadius: 2,
        overflow: "hidden",
    },
    bar: { height: "100%" },
});