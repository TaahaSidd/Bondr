import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

const SettingItem = ({ icon, label, value, type = "link", onValueChange, onPress, isLast, theme, s }) => (
    <TouchableOpacity
        style={[s.item, isLast && { borderBottomWidth: 0 }]}
        disabled={type === "toggle"}
        onPress={onPress}
        activeOpacity={0.6}
    >
        <View style={s.itemLeft}>
            <View style={s.iconBox}>
                <Ionicons name={icon} size={18} color={theme.colors.primary} />
            </View>
            <Text style={s.itemLabel}>{label}</Text>
        </View>
        <View style={s.itemRight}>
            {type === "toggle" ? (
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: theme.colors.outlineVariant, true: theme.colors.primary }}
                    thumbColor="white"
                />
            ) : (
                <>
                    {value && <Text style={s.itemValue}>{value}</Text>}
                    <Ionicons name="chevron-forward" size={16} color={theme.colors.outline} />
                </>
            )}
        </View>
    </TouchableOpacity>
);

export const SettingsGroup = ({ title, items }) => {
    const { theme } = useTheme();
    const s = makeStyles(theme);

    return (
        <View style={s.container}>
            {title && <Text style={s.groupTitle}>{title}</Text>}
            <View style={s.card}>
                {items.map((item, index) => (
                    <SettingItem
                        key={index}
                        {...item}
                        theme={theme}
                        s={s}
                        isLast={index === items.length - 1}
                    />
                ))}
            </View>
        </View>
    );
};

const makeStyles = (theme) => StyleSheet.create({
    container: { marginBottom: 20 },

    groupTitle: {
        fontSize: 13,
        fontWeight: "600",
        color: theme.colors.onSurfaceVariant,
        marginBottom: 8,
        marginLeft: 2,
    },

    card: {
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
        overflow: "hidden",
    },

    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.outlineVariant,
    },
    itemLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconBox: {
        width: 34,
        height: 34,
        borderRadius: 9,
        backgroundColor: theme.colors.primaryContainer,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12, // Replaces gap for compatibility
    },
    itemLabel: {
        fontSize: 15,
        fontWeight: "500",
        color: theme.colors.onSurface
    },
    itemRight: {
        flexDirection: "row",
        alignItems: "center",
    },
    itemValue: {
        fontSize: 13,
        color: theme.colors.onSurfaceVariant,
        marginRight: 6, // Replaces gap for compatibility
    },
});