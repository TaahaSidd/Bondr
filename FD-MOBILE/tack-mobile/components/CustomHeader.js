import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";
import { useNavigation } from "@react-navigation/native";

export const CustomHeader = ({
    title,
    subtitle,
    showBack = false,
    isDashboard = false
}) => {
    const navigation = useNavigation();

    return (
        <View style={styles.headerContainer}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.mainRow}>
                <View style={styles.leftSection}>
                    {showBack ? (
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Ionicons name="chevron-back" size={24} color={theme.colors.onSurface} />
                        </TouchableOpacity>
                    ) : (
                        <View>
                            <Text style={isDashboard ? styles.brandLabel : styles.screenTitle}>
                                {(title || "WELCOME")}
                            </Text>
                            {!isDashboard && subtitle && (
                                <Text style={styles.subtitleText}>{subtitle}</Text>
                            )}
                        </View>
                    )}
                </View>

                {/* Right icons only show on Dash */}
                {isDashboard && (
                    <View style={styles.rightSection}>
                        <TouchableOpacity style={styles.iconButton}>
                            <Ionicons name="notifications-outline" size={20} color={theme.colors.onSurface} />
                            <View style={styles.dot} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                            <View style={styles.avatar}>
                                <Ionicons name="person" size={16} color={theme.colors.primary} />
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: theme.colors.background,
        paddingHorizontal: 24, // Consistent Gutter
        paddingTop: Platform.OS === "ios" ? 48 : (StatusBar.currentHeight || 0) + 12,
        paddingBottom: 8, // Tightened bottom padding
    },
    mainRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    leftSection: {
        flex: 1
    },
    brandLabel: {
        fontSize: 12,
        fontWeight: "900",
        color: theme.colors.primary,
        letterSpacing: 1.5,
    },
    screenTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: theme.colors.onSurface,
        letterSpacing: -0.2,
    },
    subtitleText: {
        fontSize: 11,
        color: theme.colors.outline,
        fontWeight: "600",
        marginTop: 1,
    },
    rightSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12
    },
    iconButton: {
        position: "relative",
        padding: 4
    },
    dot: {
        position: "absolute",
        right: 4, top: 4,
        width: 6, height: 6,
        backgroundColor: "#ef4444",
        borderRadius: 3,
        borderWidth: 1.5,
        borderColor: theme.colors.background,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: theme.colors.surfaceContainerHigh,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
    },
    backButton: {
        padding: 4,
        marginLeft: -6,
    }
});