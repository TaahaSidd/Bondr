import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { theme } from "../constants/theme";

export const Input = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = "default",
    multiline = false,
    style,
    ...props
}) => {
    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.inputLabel}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    multiline && styles.textArea
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.outline}
                keyboardType={keyboardType}
                multiline={multiline}
                textAlignVertical={multiline ? "top" : "center"}
                {...props}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 11,
        fontWeight: "800",
        color: theme.colors.outline,
        marginBottom: 8,
        letterSpacing: 1,
    },
    input: {
        backgroundColor: theme.colors.surfaceContainerLow,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: theme.colors.onSurface,
        height: 52, // Standardizing height for touch targets
    },
    textArea: {
        height: 100,
        paddingTop: 12,
    },
});