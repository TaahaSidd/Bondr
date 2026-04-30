import React from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    View
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";

export const Button = ({
    label,
    onPress,
    variant = "primary", // primary, secondary, inverted, outline, text
    icon,
    loading = false,
    disabled = false,
    style
}) => {

    // Determine styles based on variant
    const getVariantStyles = () => {
        switch (variant) {
            case "secondary":
                return {
                    button: { backgroundColor: theme.colors.secondaryContainer },
                    text: { color: theme.colors.onSecondaryContainer },
                    icon: theme.colors.onSecondaryContainer
                };
            case "inverted":
                return {
                    button: { backgroundColor: theme.colors.inverseSurface },
                    text: { color: theme.colors.inverseOnSurface },
                    icon: theme.colors.inverseOnSurface
                };
            case "outline":
                return {
                    button: {
                        backgroundColor: "transparent",
                        borderWidth: 1.5,
                        borderColor: theme.colors.outline
                    },
                    text: { color: theme.colors.onSurface },
                    icon: theme.colors.onSurface
                };
            case "text":
                return {
                    button: { backgroundColor: "transparent" },
                    text: { color: theme.colors.primary, fontWeight: "700" },
                    icon: theme.colors.primary
                };
            default: // Primary
                return {
                    button: { backgroundColor: theme.colors.primary },
                    text: { color: theme.colors.onPrimary },
                    icon: theme.colors.onPrimary
                };
        }
    };

    const stylesConfig = getVariantStyles();

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            style={[
                styles.baseButton,
                stylesConfig.button,
                disabled && styles.disabledButton,
                style
            ]}
        >
            {loading ? (
                <ActivityIndicator color={stylesConfig.text.color} />
            ) : (
                <View style={styles.content}>
                    {icon && (
                        <Ionicons
                            name={icon}
                            size={20}
                            color={stylesConfig.icon}
                            style={styles.iconStyle}
                        />
                    )}
                    <Text style={[styles.baseText, stylesConfig.text]}>
                        {label}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    baseButton: {
        height: 56, // Per design system specs
        borderRadius: 12, // md rounding: 0.75rem
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
        flexDirection: "row",
        marginVertical: 8,
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    baseText: {
        fontSize: 16, // body-md
        fontWeight: "600",
        letterSpacing: 0.5,
        textAlign: "center",
    },
    iconStyle: {
        marginRight: 10,
    },
    disabledButton: {
        opacity: 0.5,
        backgroundColor: theme.colors.surfaceContainerHighest,
    }
});