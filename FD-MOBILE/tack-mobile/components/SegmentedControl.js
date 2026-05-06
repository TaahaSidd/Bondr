import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";

/**
 * SegmentedControl
 * Props:
 *   options  — string[]
 *   selected — string
 *   onChange — (option: string) => void
 */
export const SegmentedControl = ({ options, selected, onChange }) => {
    const { theme } = useTheme();
    const s = makeStyles(theme);

    return (
        <View style={s.container}>
            {options.map(opt => (
                <TouchableOpacity
                    key={opt}
                    style={[s.segment, selected === opt && s.segmentActive]}
                    onPress={() => onChange(opt)}
                    activeOpacity={0.7}
                >
                    <Text style={[s.label, selected === opt && s.labelActive]}>
                        {opt}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const makeStyles = (theme) => StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: theme.colors.surfaceContainerLow,
        borderRadius: 12,
        padding: 4,
    },
    segment: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
    },
    segmentActive: {
        backgroundColor: theme.colors.surfaceContainerLowest,
        shadowColor: "#000",
        shadowOpacity: theme.dark ? 0.2 : 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: theme.colors.outline,
    },
    labelActive: {
        color: theme.colors.primary,
        fontWeight: "700",
    },
});