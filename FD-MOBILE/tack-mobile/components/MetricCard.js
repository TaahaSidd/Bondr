import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";

export const MetricCard = ({ title, value, unit, subtext, iconName, trendUp }) => {
    const trendColor = trendUp ? "#10b981" : "#ef4444";

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Ionicons name={iconName} size={16} color={theme.colors.primary} />
                <Text style={styles.cardLabel} numberOfLines={1}>{title}</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.valueRow}>
                    <Text style={styles.cardValue}>{value}</Text>
                    <Text style={styles.unitText}>{unit}</Text>
                </View>

                {subtext && (
                    <View style={[styles.trendBadge, { backgroundColor: trendColor + '15' }]}>
                        <Ionicons
                            name={trendUp ? "trending-up" : "trending-down"}
                            size={12}
                            color={trendColor}
                        />
                        <Text style={[styles.subtext, { color: trendColor }]}>
                            {subtext}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1, // Allows cards to sit side-by-side in a Row
        backgroundColor: theme.colors.surface,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
        // Subtle depth
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 6
    },
    cardLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: theme.colors.onSurfaceVariant,
        //textTransform: 'uppercase',
        letterSpacing: 0.4
    },
    content: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    cardValue: {
        fontSize: 22,
        fontWeight: '800',
        color: theme.colors.onSurface,
    },
    unitText: {
        fontSize: 12,
        color: theme.colors.onSurfaceVariant,
        marginLeft: 3,
        fontWeight: '600'
    },
    trendBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4
    },
    subtext: {
        fontSize: 10,
        fontWeight: '700',
        marginLeft: 3
    },
});