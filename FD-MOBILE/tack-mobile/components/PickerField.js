import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";

export const PickerField = ({ label, value, placeholder, onPress, helperText, containerStyle }) => {
    return (
        <View style={[styles.wrapper, containerStyle]}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
                style={styles.picker}
                onPress={onPress}
                activeOpacity={0.7}
            >
                <Text
                    style={[styles.value, !value && styles.placeholder]}
                    numberOfLines={1}
                >
                    {value || placeholder}
                </Text>
                <Ionicons name="chevron-down" size={18} color={theme.colors.primary} />
            </TouchableOpacity>
            {helperText && <Text style={styles.helper}>{helperText}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 16,
    },
    label: {
        fontSize: 11,
        fontWeight: "800",
        color: theme.colors.onSurfaceVariant,
        marginBottom: 8,
        letterSpacing: 1,
      //  textTransform: 'uppercase',
    },
    picker: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 52,
    },
    value: {
        fontSize: 15,
        fontWeight: '500',
        color: theme.colors.onSurface,
        flex: 1,
    },
    placeholder: {
        color: theme.colors.outline,
    },
    helper: {
        fontSize: 11,
        color: theme.colors.primary,
        marginTop: 6,
        fontWeight: '600',
    },
});