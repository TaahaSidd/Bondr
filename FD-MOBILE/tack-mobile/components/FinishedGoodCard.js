import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";

export const FinishedGoodCard = ({ name, sku, qty, unit, status }) => {
    const isCritical = status === "Out of stocK" || status === "Low Stock";
    const statusColor = isCritical ? theme.colors.error : theme.colors.primary;

    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.7}>
            <View style={styles.topRow}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.titleText}>{name}</Text>
                    <Text style={styles.skuText}>{sku}</Text>
                </View>
                <View style={styles.qtyContainer}>
                    <Text style={[styles.qtyValue, { color: statusColor }]}>{qty}</Text>
                    <Text style={styles.unitLabel}>{unit}</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <View style={styles.statusIndicator}>
                    {/* <View style={[styles.dot, { backgroundColor: statusColor }]} /> */}
                    <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
                </View>
                <View style={styles.detailsBtn}>
                    <Text style={styles.detailsText}>Details</Text>
                    <Ionicons name="chevron-forward" size={14} color={theme.colors.primary} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant
    },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    titleText: { fontSize: 18, fontWeight: '700', color: theme.colors.onSurface },
    skuText: { fontSize: 11, color: theme.colors.outline, fontWeight: '600', marginTop: 2 },
    qtyContainer: { alignItems: 'flex-end' },
    qtyValue: { fontSize: 22, fontWeight: '800' },
    unitLabel: { fontSize: 10, fontWeight: '800', color: theme.colors.outline },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: theme.colors.surfaceContainerLow
    },
    statusIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    dot: { width: 6, height: 6, borderRadius: 3 },
    statusText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
    detailsBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
    detailsText: { fontSize: 12, fontWeight: '700', color: theme.colors.primary }
});