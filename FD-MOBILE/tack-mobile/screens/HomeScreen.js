import React, { useState, useEffect, useCallback } from "react";
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, SafeAreaView,
    ActivityIndicator, RefreshControl
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { CustomHeader } from "../components/CustomHeader";
import { BottomNavBar } from "../components/BottomNavBar";
import { MetricCard } from "../components/MetricCard";
import { OrderList } from "../components/OrderList";
import { inventoryApi } from "../api/inventoryApi";
import { staffApi } from "../api/staffApi";

export function HomeScreen({ navigation }) {
    const { theme } = useTheme();           // ← live theme, updates when dark mode toggles
    const s = makeStyles(theme);            // ← styles rebuilt with current theme

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [metrics, setMetrics] = useState({ totalStock: 0, pendingOrders: 0, staffCount: 0 });
    const [recentOrders, setRecentOrders] = useState([]);

    const loadDashboardData = useCallback(async () => {
        try {
            const [prodRes, orderRes, staffRes] = await Promise.all([
                inventoryApi.getProducts(),
                inventoryApi.getOrders(),
                staffApi.getAllStaff(),
            ]);
            setMetrics({
                totalStock: prodRes.data.reduce((a, p) => a + (p.stockQuantity || 0), 0),
                pendingOrders: orderRes.data.filter(o => o.status !== "COMPLETED").length,
                staffCount: staffRes.data.length,
            });
            setRecentOrders([...orderRes.data]
                .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
                .slice(0, 3)
            );
        } catch (err) {
            console.error("Dashboard sync failed:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { loadDashboardData(); }, [loadDashboardData]);

    if (loading) {
        return (
            <View style={[s.container, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={s.container}>
            <CustomHeader isDashboard />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={s.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => { setRefreshing(true); loadDashboardData(); }}
                        tintColor={theme.colors.primary}
                    />
                }
            >
                {/* Greeting */}
                <View style={s.greeting}>
                    <View>
                        <Text style={s.greetLabel}>Good morning</Text>
                        <Text style={s.greetTitle}>Factory Overview</Text>
                    </View>
                </View>

                {/* Metric cards */}
                <View style={s.metricsRow}>
                    <MetricCard title="Total Stock" value={metrics.totalStock.toLocaleString()} unit="units" subtext="All products" />
                    <MetricCard title="Pending Orders" value={metrics.pendingOrders.toString()} unit="active" subtext="Awaiting dispatch" />
                    <MetricCard title="Staff" value={metrics.staffCount.toString()} unit="members" subtext="On roster" />
                </View>

                {/* Quick nav */}
                <View style={s.quickRow}>
                    {[
                        { label: "Materials", icon: "flask-outline", route: "Materials" },
                        { label: "Production", icon: "hardware-chip-outline", route: "Batches" },
                        { label: "Stock", icon: "layers-outline", route: "Stock" },
                        { label: "Staff", icon: "people-outline", route: "Staff" },
                    ].map(item => (
                        <TouchableOpacity key={item.route} style={s.quickItem} onPress={() => navigation.navigate(item.route)}>
                            <View style={s.quickIcon}>
                                <Ionicons name={item.icon} size={20} color={theme.colors.primary} />
                            </View>
                            <Text style={s.quickLabel}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Recent orders */}
                <Text style={s.sectionTitle}>Recent Orders</Text>
                <View style={s.card}>
                    {recentOrders.length === 0 ? (
                        <Text style={s.emptyText}>No orders yet.</Text>
                    ) : (
                        <OrderList
                            orders={recentOrders}
                            onItemPress={order => navigation.navigate("OrderDetails", { order })}
                        />
                    )}
                    <TouchableOpacity style={s.viewAllRow} onPress={() => navigation.navigate("AllOrders")}>
                        <Text style={s.viewAllText}>View all orders</Text>
                        <Ionicons name="arrow-forward" size={14} color={theme.colors.primary} />
                    </TouchableOpacity>
                </View>

                {/* Status card */}
                {/* <View style={s.statusCard}>
                    <View style={s.statusLeft}>
                        <View style={s.statusDot} />
                        <View>
                            <Text style={s.statusTitle}>Warehouse A</Text>
                            <Text style={s.statusSub}>Operational · Synced</Text>
                        </View>
                    </View>
                    <Text style={s.statusTime}>Just now</Text>
                </View> */}

                <View style={{ height: 120 }} />
            </ScrollView>

            <BottomNavBar activeRoute="Dashboard" />
        </SafeAreaView>
    );
}

// Styles as a function of theme so they update on mode switch
const makeStyles = (theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollContent: { paddingHorizontal: 24, paddingTop: 16 },

    greeting: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
    greetLabel: { fontSize: 13, color: theme.colors.onSurfaceVariant, fontWeight: "500", marginBottom: 2 },
    greetTitle: { fontSize: 22, fontWeight: "700", color: theme.colors.onSurface },

    liveBadge: {
        flexDirection: "row", alignItems: "center", gap: 5,
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderWidth: 1, borderColor: theme.colors.outlineVariant,
        paddingHorizontal: 10, paddingVertical: 5, borderRadius: 99,
    },
    liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#10b981" },
    liveText: { fontSize: 12, fontWeight: "600", color: theme.colors.onSurface },

    metricsRow: { flexDirection: "row", gap: 10, marginBottom: 20 },

    quickRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 28 },
    quickItem: { alignItems: "center", gap: 8 },
    quickIcon: {
        width: 52, height: 52,
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderRadius: 14,
        borderWidth: 1, borderColor: theme.colors.outlineVariant,
        justifyContent: "center", alignItems: "center",
    },
    quickLabel: { fontSize: 11, fontWeight: "600", color: theme.colors.onSurfaceVariant },

    sectionTitle: { fontSize: 16, fontWeight: "700", color: theme.colors.onSurface, marginBottom: 12 },

    card: {
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderRadius: 16, borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
        marginBottom: 12,
    },
    viewAllRow: {
        flexDirection: "row", alignItems: "center", justifyContent: "center",
        gap: 6, paddingVertical: 14,
        borderTopWidth: 1, borderTopColor: theme.colors.outlineVariant,
    },
    viewAllText: { fontSize: 13, fontWeight: "600", color: theme.colors.primary },
    emptyText: { textAlign: "center", color: theme.colors.outline, paddingVertical: 24, fontSize: 14 },

    statusCard: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderRadius: 16, borderWidth: 1, borderColor: theme.colors.outlineVariant,
        padding: 16, marginBottom: 12,
    },
    statusLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
    statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#10b981" },
    statusTitle: { fontSize: 14, fontWeight: "700", color: theme.colors.onSurface },
    statusSub: { fontSize: 12, color: theme.colors.onSurfaceVariant, marginTop: 1 },
    statusTime: { fontSize: 12, color: theme.colors.outline },
});