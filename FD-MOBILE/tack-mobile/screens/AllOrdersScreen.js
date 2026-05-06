import React, { useState, useEffect, useCallback } from "react";
import {
    View, Text, StyleSheet, FlatList,
    TouchableOpacity, ActivityIndicator, RefreshControl
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../context/ThemeContext"; // Added Theme Hook
import { inventoryApi } from "../api/inventoryApi";

import { CustomHeader } from "../components/CustomHeader";
import { Button } from "../components/Button";
import { OrderCard } from "../components/OrderCard";

export default function AllOrdersScreen({ navigation }) {
    const { theme } = useTheme();           // Live theme
    const s = makeStyles(theme);            // Dynamic styles

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchOrders = useCallback(async () => {
        try {
            const res = await inventoryApi.getOrders();
            setOrders([...res.data].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
        } catch (e) {
            console.error("Order fetch error:", e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    return (
        <View style={s.container}>
            <CustomHeader showBack />

            {loading ? (
                <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={s.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => { setRefreshing(true); fetchOrders(); }}
                            tintColor={theme.colors.primary}
                        />
                    }
                    ListHeaderComponent={
                        <View style={s.listHeader}>
                            <Text style={s.screenTitle}>All Orders</Text>
                            <View style={s.headerRight}>
                                <Text style={s.countLabel}>{orders.length} total</Text>
                                
                                {/* <TouchableOpacity
                                    style={s.newBtn}
                                    onPress={() => navigation.navigate("Orders")}
                                >
                                    <Ionicons name="add" size={18} color="white" />
                                    <Text style={s.newBtnText}>New</Text>
                                </TouchableOpacity> */}
                            </View>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <OrderCard
                            variant="row"
                            order={item}
                            onPress={() => navigation.navigate("OrderDetails", { order: item })}
                        />
                    )}
                    ListEmptyComponent={
                        < Text style={s.emptyText} > No orders found.</Text >
                    }
                />
            )}
        </View >
    );
}

const makeStyles = (theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    listContent: { paddingHorizontal: 24, paddingBottom: 100 },

    listHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 16,
        marginBottom: 16,
    },
    screenTitle: {
        fontSize: 22, fontWeight: "700",
        color: theme.colors.onSurface,
    },
    headerRight: {
        flexDirection: "row", alignItems: "center", gap: 12,
    },
    countLabel: {
        fontSize: 13, fontWeight: "600", color: theme.colors.outline,
    },
    newBtn: {
        flexDirection: "row", alignItems: "center", gap: 4,
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 12, paddingVertical: 8,
        borderRadius: 8,
    },
    newBtnText: { color: "white", fontWeight: "700", fontSize: 13 },
    emptyText: { textAlign: "center", color: theme.colors.outline, marginTop: 40 },
});