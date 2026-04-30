import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../constants/theme";

export const StatCard = ({ label, value, subtext, type = "primary", style }) => {
    const accentColor = type === "error" ? theme.colors.error : theme.colors.primary;
    const indicatorColor = type === "error" ? theme.colors.error : theme.colors.outlineVariant;

    return (
        <View style={[styles.card, style]}>
            <View style={styles.header}>
                {/* A small vertical "pill" indicator instead of an icon */}
                {/* <View style={[styles.indicator, { backgroundColor: indicatorColor }]} /> */}
                <Text style={styles.labelText}>{label}</Text>
            </View>

            <View style={styles.content}>
                <Text style={[styles.valueText, { color: accentColor }]}>{value}</Text>
                <Text style={styles.subtext}>{subtext}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
        minHeight: 110,
        justifyContent: 'space-between'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    indicator: {
        width: 3,
        height: 12,
        borderRadius: 2
    },
    labelText: {
        fontSize: 10,
        fontWeight: '800',
        color: theme.colors.outline,
        letterSpacing: 1
    },
    content: {
        marginTop: 8
    },
    valueText: {
        fontSize: 26,
        fontWeight: '700',
        color: theme.colors.onSurface
    },
    subtext: {
        fontSize: 12,
        color: theme.colors.outline,
        fontWeight: '500',
        marginTop: 2
    },
});