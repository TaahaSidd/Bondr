import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../constants/theme";

export const InventoryCard = ({ name, sku, quantity, unit, unitCost, status, progress }) => {
    // Determine color based on urgency
    const isLow = status === "LOW STOCK" || status === "OUT OF STOCK";
    const accentColor = isLow ? theme.colors.error : theme.colors.primary;

    return (
        <View style={styles.card}>
            {/* Top Row: Name and Price */}
            <View style={styles.mainRow}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.nameText} numberOfLines={1}>{name}</Text>
                    <Text style={styles.skuText}>{sku}</Text>
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.label}>Cost/Unit</Text>
                    <Text style={styles.priceValue}>₹{unitCost}</Text>
                </View>
            </View>

            {/* Middle Row: Quantity Stats */}
            <View style={styles.dataRow}>
                <View style={styles.dataPoint}>
                    <Text style={styles.label}>On Hand</Text>
                    <Text style={styles.value}>
                        {quantity} <Text style={styles.unit}>{unit}</Text>
                    </Text>
                </View>

                {/* Visual indicator of stock health instead of a "Stable" tag */}
                {isLow && (
                    <View style={styles.alertContainer}>
                        <Text style={[styles.alertText, { color: theme.colors.error }]}>
                            {status}
                        </Text>
                    </View>
                )}
            </View>

            {/* Bottom: Ultra-thin Progress Bar */}
            <View style={styles.progressTrack}>
                <View
                    style={[
                        styles.progressBar,
                        { width: `${progress}%`, backgroundColor: accentColor }
                    ]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
    },
    mainRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    nameText: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.onSurface,
        letterSpacing: -0.5,
    },
    skuText: {
        fontSize: 11,
        color: theme.colors.outline,
        fontWeight: '600',
        marginTop: 2,
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    priceValue: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    dataRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dataPoint: {
        flexDirection: 'column',
    },
    label: {
        fontSize: 9,
        color: theme.colors.outline,
        fontWeight: '800',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    value: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.onSurface,
    },
    unit: {
        fontSize: 12,
        fontWeight: '500',
        color: theme.colors.outline,
    },
    alertContainer: {
        backgroundColor: theme.colors.errorContainer,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    alertText: {
        fontSize: 10,
        fontWeight: '900',
    },
    progressTrack: {
        height: 4,
        backgroundColor: theme.colors.surfaceContainer,
        borderRadius: 2,
        marginTop: 12,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
    },
});