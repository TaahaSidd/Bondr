import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    RefreshControl
} from "react-native";
import { theme } from "../constants/theme";
import { CustomHeader } from "../components/CustomHeader";
import { BottomNavBar } from "../components/BottomNavBar";
import { MetricCard } from "../components/MetricCard";
import { inventoryApi } from "../api/inventoryApi";

export function HomeScreen() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [metrics, setMetrics] = useState({ totalStock: 0, pendingOrders: 0 });
    const [recentOrders, setRecentOrders] = useState([]);

    const loadDashboardData = useCallback(async () => {
        try {
            const [prodRes, orderRes] = await Promise.all([
                inventoryApi.getProducts(),
                inventoryApi.getOrders()
            ]);

            // Calculate total units across all products
            const total = prodRes.data.reduce((acc, item) => acc + (item.stockQuantity || 0), 0);

            // Filter for orders that aren't completed/dispatched yet
            const pending = orderRes.data.filter(o => o.status !== 'COMPLETED').length;

            setMetrics({
                totalStock: total,
                pendingOrders: pending
            });

            // Get the 4 most recent orders
            setRecentOrders(orderRes.data.slice(0, 3));
        } catch (err) {
            console.error("Dashboard sync failed:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    const onRefresh = () => {
        setRefreshing(true);
        loadDashboardData();
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <CustomHeader isDashboard={true} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
                }
            >
                <View style={styles.titleContainer}>
                    <Text style={styles.screenTitle}>Factory Overview</Text>
                    <Text style={styles.subtitle}>Real-time inventory and sales metrics</Text>
                </View>

                {/* Metric Cards Section */}
                <View style={styles.metricsGrid}>
                    <MetricCard
                        title="Total Stock"
                        value={metrics.totalStock.toLocaleString()}
                        unit="units"
                        subtext="Across all categories"
                        iconName="archive-outline"
                        trendUp={metrics.totalStock > 1000}
                    />

                    <MetricCard
                        title="Pending Orders"
                        value={metrics.pendingOrders.toString()}
                        unit="active"
                        subtext="Awaiting processing"
                        iconName="cart-outline"
                        trendUp={metrics.pendingOrders > 5}
                    />
                </View>

                {/* Recent Orders Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Orders</Text>
                        <TouchableOpacity>
                            <Text style={styles.viewAll}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.tableRow}>
                        <Text style={[styles.tableHeader, { flex: 2 }]}>Customer</Text>
                        <Text style={[styles.tableHeader, { flex: 1, textAlign: 'right' }]}>Status</Text>
                    </View>

                    {recentOrders.length > 0 ? (
                        recentOrders.map((order) => (
                            <OrderRow
                                key={order.id}
                                name={order.customerName}
                                date={order.orderDate}
                                status={order.status || "Pending"}
                            />
                        ))
                    ) : (
                        <Text style={styles.emptyText}>No recent orders found.</Text>
                    )}
                </View>

                {/* Quick Action / Status Card */}
                <View style={styles.visualCard}>
                    <View>
                        <Text style={styles.visualTitle}>Warehouse A</Text>
                        <Text style={styles.visualSub}>Operational & Synced</Text>
                    </View>
                    <TouchableOpacity style={styles.syncBadge}>
                        <Text style={styles.syncText}>Live</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            <BottomNavBar activeRoute="Dashboard" />
        </SafeAreaView>
    );
}

const OrderRow = ({ name, date, status }) => {
    // Logic for dynamic status colors
    const isCompleted = status.toLowerCase() === 'completed';

    return (
        <View style={styles.tableDataRow}>
            <View style={{ flex: 2 }}>
                <Text style={[styles.cellText, { fontWeight: '700' }]}>{name}</Text>
                <Text style={styles.dateText}>{date}</Text>
            </View>
            <View style={[
                styles.statusBadge,
                { backgroundColor: isCompleted ? theme.colors.tertiaryFixed : theme.colors.primaryFixed }
            ]}>
                <Text style={[
                    styles.statusText,
                    { color: isCompleted ? theme.colors.onTertiaryFixedVariant : theme.colors.onPrimaryFixedVariant }
                ]}>
                    {status.toUpperCase()}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollContent: { paddingHorizontal: 24, paddingTop: 20 },
    titleContainer: { marginBottom: 24 },
    screenTitle: { fontSize: 28, fontWeight: '700', color: theme.colors.onSurface, letterSpacing: -0.5 },
    subtitle: { fontSize: 14, color: theme.colors.onSurfaceVariant, marginTop: 4 },
    metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 24 },
    sectionContainer: {
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
    },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.onSurface },
    viewAll: { color: theme.colors.primary, fontWeight: '700', fontSize: 14 },
    tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceContainer, paddingBottom: 12 },
    tableHeader: { fontSize: 11, fontWeight: '800', color: theme.colors.outline, letterSpacing: 1 },
    tableDataRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceContainerLow },
    cellText: { fontSize: 15, color: theme.colors.onSurface },
    dateText: { fontSize: 12, color: theme.colors.outline, marginTop: 2 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, minWidth: 80, alignItems: 'center' },
    statusText: { fontSize: 10, fontWeight: '900' },
    emptyText: { textAlign: 'center', color: theme.colors.outline, marginVertical: 20, fontSize: 14 },
    visualCard: {
        height: 120,
        backgroundColor: theme.colors.inverseSurface,
        borderRadius: 16,
        marginTop: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
    },
    visualTitle: { color: theme.colors.inverseOnSurface, fontSize: 20, fontWeight: '700' },
    visualSub: { color: theme.colors.outlineVariant, fontSize: 14, marginTop: 4 },
    syncBadge: { backgroundColor: '#4CAF50', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
    syncText: { color: 'white', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' }
});