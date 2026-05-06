import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

export const CustomHeader = ({ title, subtitle, showBack = false, isDashboard = false }) => {
    const navigation = useNavigation();
    const { theme, isDark } = useTheme();
    const s = makeStyles(theme);

    return (
        <View style={s.headerContainer}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

            <View style={s.mainRow}>
                <View style={s.leftSection}>
                    {showBack ? (
                        <View style={s.backRow}>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={s.backButton}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Ionicons name="chevron-back" size={24} color={theme.colors.onSurface} />
                            </TouchableOpacity>
                            <View>
                                <Text style={s.screenTitle}>{title || "Back"}</Text>
                                {subtitle && <Text style={s.subtitleText}>{subtitle}</Text>}
                            </View>
                        </View>
                    ) : (
                        <View>
                            <Text style={isDashboard ? s.brandLabel : s.screenTitle}>
                                {isDashboard ? "Welcome" : (title || "")}
                            </Text>
                            {!isDashboard && subtitle && (
                                <Text style={s.subtitleText}>{subtitle}</Text>
                            )}
                        </View>
                    )}
                </View>

                {isDashboard && (
                    <View style={s.rightSection}>
                        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                            <View style={s.avatar}>
                                <Ionicons name="person" size={16} color={theme.colors.primary} />
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

const makeStyles = (theme) => StyleSheet.create({
    headerContainer: {
        backgroundColor: theme.colors.background,
        paddingHorizontal: 24,
        paddingTop: Platform.OS === "ios" ? 48 : (StatusBar.currentHeight || 0) + 12,
        paddingBottom: 8,
    },
    mainRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: 40,
    },
    leftSection: { flex: 1 },
    backRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    backButton: { padding: 4, marginLeft: -8 },

    brandLabel: {
        fontSize: 12, fontWeight: "900",
        color: theme.colors.primary, letterSpacing: 1.5,
    },
    screenTitle: {
        fontSize: 18, fontWeight: "800",
        color: theme.colors.onSurface, letterSpacing: -0.2,
    },
    subtitleText: {
        fontSize: 11, fontWeight: "600",
        color: theme.colors.outline, marginTop: 1,
    },
    rightSection: { flexDirection: "row", alignItems: "center", gap: 12 },
    avatar: {
        width: 32, height: 32, borderRadius: 10,
        backgroundColor: theme.colors.surfaceContainerHigh,
        justifyContent: "center", alignItems: "center",
        borderWidth: 1, borderColor: theme.colors.outlineVariant,
    },
});