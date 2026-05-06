import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

// ── Helpers ───────────────────────────────────────────────────────────────────
const getStatusColors = (status, theme) => {
    switch (status?.toUpperCase()) {
        case "COMPLETED":
            return { bg: theme.colors.tertiaryFixed, text: theme.colors.onTertiaryFixedVariant };
        case "CANCELLED":
            return { bg: theme.colors.errorContainer, text: theme.colors.onErrorContainer };
        default: // PENDING
            return { bg: theme.colors.primaryFixed, text: theme.colors.onPrimaryFixedVariant };
    }
};

// ── Variant: "row" — used in AllOrdersScreen list ────────────────────────────
const OrderCardRow = ({ order, onPress, theme, styles }) => {
    const { bg, text } = getStatusColors(order.status, theme);
    return (
        <TouchableOpacity style={styles.rowCard} onPress={onPress} activeOpacity={0.7}>
            <View style={{ flex: 1 }}>
                <Text style={styles.rowName} numberOfLines={1}>{order.customerName}</Text>
                <Text style={styles.rowMeta}>{order.orderDate}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: bg }]}>
                <Text style={[styles.badgeText, { color: text }]}>
                    {(order.status || "PENDING").toUpperCase()}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.outline} style={{ marginLeft: 8 }} />
        </TouchableOpacity>
    );
};

// ── Variant: "detail-item" — used in OrderDetailScreen per line item ──────────
const OrderLineItem = ({ item, isLast, styles }) => (
    <View style={[styles.lineItem, isLast && { borderBottomWidth: 0 }]}>
        <View style={{ flex: 1 }}>
            <Text style={styles.lineItemName}>{item.productName}</Text>
            <Text style={styles.lineItemSub}>
                {item.length ? `${item.length}mm` : ""}{item.color ? ` · ${item.color}` : ""}
            </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.lineItemQty}>× {item.quantity}</Text>
            {item.pricePerUnit || item.price
                ? <Text style={styles.lineItemPrice}>₹{item.pricePerUnit ?? item.price}</Text>
                : null
            }
        </View>
    </View>
);

// ── Main export — picks variant via `variant` prop ────────────────────────────
export const OrderCard = ({ variant = "row", order, item, isLast, onPress }) => {
    const { theme } = useTheme();
    const styles = makeStyles(theme);

    if (variant === "row") return <OrderCardRow order={order} onPress={onPress} theme={theme} styles={styles} />;
    if (variant === "line-item") return <OrderLineItem item={item} isLast={isLast} styles={styles} />;
    return null;
};

const makeStyles = (theme) => StyleSheet.create({
    // Row variant
    rowCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
    },
    rowName: {
        fontSize: 14,
        fontWeight: "700",
        color: theme.colors.onSurface,
    },
    rowMeta: {
        fontSize: 12,
        color: theme.colors.outline,
        marginTop: 2,
    },

    // Shared badge
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        marginLeft: 10,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: "700"
    },

    // Line item variant
    lineItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.outlineVariant,
    },
    lineItemName: {
        fontSize: 14,
        fontWeight: "700",
        color: theme.colors.onSurface
    },
    lineItemSub: {
        fontSize: 12,
        color: theme.colors.outline,
        marginTop: 2
    },
    lineItemQty: {
        fontSize: 14,
        fontWeight: "700",
        color: theme.colors.primary
    },
    lineItemPrice: {
        fontSize: 12,
        color: theme.colors.outline,
        marginTop: 2
    },
});