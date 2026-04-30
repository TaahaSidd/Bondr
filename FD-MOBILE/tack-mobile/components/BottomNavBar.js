import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";
import { useNavigation } from "@react-navigation/native";

const NavItem = ({ name, label, active, onPress }) => (
    <TouchableOpacity
        style={styles.navItem}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View style={[
            styles.iconContainer,
            active && styles.activeIconContainer
        ]}>
            <Ionicons
                name={active ? name : `${name}-outline`}
                size={22}
                color={active ? theme.colors.primary : theme.colors.textSecondary}
            />
        </View>
        <Text style={[
            styles.navLabel,
            {
                color: active ? theme.colors.primary : theme.colors.textSecondary,
                fontWeight: active ? "800" : "600"
            }
        ]}>
            {label}
        </Text>
    </TouchableOpacity>
);

export const BottomNavBar = ({ activeRoute = "Dashboard" }) => {
    // 2. Initialize navigation
    const navigation = useNavigation();

    return (
        <View style={styles.navContainer}>
            <NavItem
                name="grid"
                label="Dash"
                active={activeRoute === "Dashboard"}
                onPress={() => navigation.navigate("Dashboard")}
            />
            <NavItem
                name="layers"
                label="Materials"
                active={activeRoute === "Materials"}
                onPress={() => navigation.navigate("Materials")}
            />
            <NavItem
                name="flask"
                label="Batches"
                active={activeRoute === "Batches"}
                onPress={() => navigation.navigate("Batches")}
            />
            <NavItem
                name="cube"
                label="Stock"
                active={activeRoute === "Stock"}
                onPress={() => navigation.navigate("Stock")}
            />
            <NavItem
                name="cart"
                label="Orders"
                active={activeRoute === "Orders"}
                onPress={() => navigation.navigate("Orders")}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    navContainer: {
        flexDirection: "row",
        height: Platform.OS === 'ios' ? 90 : 75,
        backgroundColor: theme.colors.surface,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingBottom: Platform.OS === 'ios' ? 25 : 10,
        justifyContent: "space-between",
        alignItems: "center",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    navItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    iconContainer: {
        paddingVertical: 4,
        paddingHorizontal: 16,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeIconContainer: {
        backgroundColor: theme.colors.inProgress.bg,
    },
    navLabel: {
        fontSize: 10,
        marginTop: 2,
    }
});