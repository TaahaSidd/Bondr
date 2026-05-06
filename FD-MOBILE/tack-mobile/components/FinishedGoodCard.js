import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";

export const FinishedGoodCard = ({ name, sku, qty, unit, status, onPress }) => {
    const { theme } = useTheme();
    const s = makeStyles(theme);

    const isOut = status === "Out of Stock";
    const isLow = status === "Low Stock";

    // Dynamic color logic based on the current theme state
    const badgeBg = isOut ? theme.colors.errorContainer : isLow ? theme.colors.warningContainer : theme.colors.tertiaryFixed;
    const badgeText = isOut ? theme.colors.onErrorContainer : isLow ? theme.colors.onWarningContainer : theme.colors.onTertiaryFixedVariant;
    const qtyColor = isOut ? theme.colors.error : isLow ? "#f59e0b" : theme.colors.onSurface;

    return (
        <TouchableOpacity style={s.card} activeOpacity={0.7} onPress={onPress}>
            <View style={s.row}>
                <View style={{ flex: 1, marginRight: 12 }}>
                    <Text style={s.name} numberOfLines={1}>{name}</Text>
                    <Text style={s.sku}>{sku}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                    <Text style={[s.qty, { color: qtyColor }]}>{qty}</Text>
                    <Text style={s.unit}>{unit}</Text>
                </View>
            </View>

            <View style={s.footer}>
                <View style={[s.badge, { backgroundColor: badgeBg }]}>
                    <Text style={[s.badgeText, { color: badgeText }]}>{status}</Text>
                </View>
                <Text style={s.detailsLink}>Details →</Text>
            </View>
        </TouchableOpacity>
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
    row: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 10,
    },
    name: {
        fontSize: 14,
        fontWeight: "700",
        color: theme.colors.onSurface
    },
    sku: {
        fontSize: 11,
        color: theme.colors.outline,
        marginTop: 2
    },
    qty: {
        fontSize: 18,
        fontWeight: "700"
    },
    unit: {
        fontSize: 10,
        fontWeight: "600",
        color: theme.colors.outline,
        textAlign: "right"
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: theme.colors.outlineVariant,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6
    },
    badgeText: {
        fontSize: 10,
        fontWeight: "700"
    },
    detailsLink: {
        fontSize: 12,
        fontWeight: "600",
        color: theme.colors.primary
    },
});