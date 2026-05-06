import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

const NavItem = ({ name, label, active, onPress, theme, styles }) => (
    <TouchableOpacity
        style={styles.navItem}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View style={[
            styles.iconContainer,
            active && { backgroundColor: theme.colors.primaryContainer }
        ]}>
            <Ionicons
                name={active ? name : `${name}-outline`}
                size={22}
                color={active ? theme.colors.primary : theme.colors.outline}
            />
        </View>
        <Text style={[
            styles.navLabel,
            {
                color: active ? theme.colors.primary : theme.colors.outline,
                fontWeight: active ? "800" : "600"
            }
        ]}>
            {label}
        </Text>
    </TouchableOpacity>
);

export const BottomNavBar = ({ activeRoute = "Dashboard" }) => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const s = makeStyles(theme);

    return (
        <View style={s.navContainer}>
            <NavItem
                name="grid"
                label="Dash"
                active={activeRoute === "Dashboard"}
                onPress={() => navigation.navigate("Dashboard")}
                theme={theme} styles={s}
            />
            <NavItem
                name="layers"
                label="Materials"
                active={activeRoute === "Materials"}
                onPress={() => navigation.navigate("Materials")}
                theme={theme} styles={s}
            />
            <NavItem
                name="flask"
                label="Batches"
                active={activeRoute === "Batches"}
                onPress={() => navigation.navigate("Batches")}
                theme={theme} styles={s}
            />
            <NavItem
                name="cube"
                label="Stock"
                active={activeRoute === "Stock"}
                onPress={() => navigation.navigate("Stock")}
                theme={theme} styles={s}
            />
            <NavItem
                name="cart"
                label="Orders"
                active={activeRoute === "Orders"}
                onPress={() => navigation.navigate("Orders")}
                theme={theme} styles={s}
            />
        </View>
    );
};

const makeStyles = (theme) => StyleSheet.create({
    navContainer: {
        flexDirection: "row",
        height: Platform.OS === 'ios' ? 90 : 75,
        backgroundColor: theme.colors.background,
        borderTopWidth: 1,
        borderTopColor: theme.colors.outlineVariant,
        paddingBottom: Platform.OS === 'ios' ? 25 : 10,
        justifyContent: "space-between",
        alignItems: "center",
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        elevation: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: theme.dark ? 0.3 : 0.05,
        shadowRadius: 10,
    },
    navItem: { flex: 1, alignItems: "center", justifyContent: "center" },
    iconContainer: {
        paddingVertical: 4,
        paddingHorizontal: 16,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navLabel: { fontSize: 10, marginTop: 2 }
});