import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";

const SettingItem = ({ icon, label, value, type = "link", onValueChange, onPress }) => (
    <TouchableOpacity
        style={styles.item}
        disabled={type === "toggle"}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View style={styles.itemLeft}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={22} color={theme.colors.primary} />
            </View>
            <Text style={styles.itemLabel}>{label}</Text>
        </View>
        <View style={styles.itemRight}>
            {type === "toggle" ? (
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: theme.colors.outlineVariant, true: theme.colors.primary }}
                />
            ) : (
                <>
                    {value && <Text style={styles.itemValue}>{value}</Text>}
                    <Ionicons name="chevron-forward" size={18} color={theme.colors.onSurfaceVariant} />
                </>
            )}
        </View>
    </TouchableOpacity>
);

export const SettingsGroup = ({ title, items }) => {
    return (
        <View style={styles.container}>
            {title && <Text style={styles.sectionHeader}>{title}</Text>}
            <View style={styles.group}>
                {items.map((item, index) => (
                    <SettingItem
                        key={index}
                        {...item}
                        // Remove border from the last item in the group
                        isLast={index === items.length - 1}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginBottom: 24 },
    sectionHeader: {
        fontSize: 12,
        fontWeight: '800',
        color: theme.colors.primary,
        marginBottom: 12,
        marginLeft: 4,
        //textTransform: 'uppercase',
        letterSpacing: 1
    },
    group: {
        backgroundColor: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.background // Acts as a separator
    },
    itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: theme.colors.surfaceContainerLow,
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemLabel: { fontSize: 16, fontWeight: '500', color: theme.colors.onSurface },
    itemRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    itemValue: { fontSize: 14, color: theme.colors.onSurfaceVariant },
});