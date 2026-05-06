import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { theme } from "../constants/theme";

/**
 * PillSelector
 * Props:
 *   options  — string[]
 *   selected — string
 *   onSelect — (option: string) => void
 *   colorMap — { [option]: activeBackgroundColor } (optional)
 *   label    — string (optional, shown above)
 */
export const PillSelector = ({ options, selected, onSelect, colorMap, label }) => (
    <View style={styles.wrapper}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={styles.row}>
            {options.map(opt => {
                const isSelected = selected === opt;
                const color = colorMap?.[opt] ?? theme.colors.primary;
                return (
                    <TouchableOpacity
                        key={opt}
                        style={[
                            styles.pill,
                            isSelected && { backgroundColor: color, borderColor: color },
                        ]}
                        onPress={() => onSelect(opt)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
                            {opt.charAt(0) + opt.slice(1).toLowerCase()}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    </View>
);

const styles = StyleSheet.create({
    wrapper: { marginBottom: 16 },
    label: {
        fontSize: 12, fontWeight: "600",
        color: theme.colors.outline, marginBottom: 8,
    },
    row: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
    pill: {
        paddingHorizontal: 16, paddingVertical: 8,
        borderRadius: 20, borderWidth: 1.5,
        borderColor: theme.colors.outlineVariant,
    },
    pillText: { fontSize: 13, fontWeight: "600", color: theme.colors.outline },
    pillTextActive: { color: "white" },
});