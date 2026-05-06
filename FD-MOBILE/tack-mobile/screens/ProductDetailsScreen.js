import React, { useState, useEffect, useCallback } from "react";
import {
    View, Text, StyleSheet, ScrollView, ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../context/ThemeContext"; // Added Theme Hook
import { CustomHeader } from "../components/CustomHeader";
import { inventoryApi } from "../api/inventoryApi";

// ── Stat tile used in the summary row ────────────────────────────────────────
const StatTile = ({ label, value, sub, theme, styles }) => (
    <View style={styles.tile}>
        <Text style={styles.tileValue}>{value ?? "—"}</Text>
        <Text style={styles.tileLabel}>{label}</Text>
        {sub && <Text style={styles.tileSub}>{sub}</Text>}
    </View>
);

// ── One row in the order history list ────────────────────────────────────────
const HistoryRow = ({ order, isLast, styles }) => (
    <View style={[styles.historyRow, isLast && { borderBottomWidth: 0 }]}>
        <View style={{ flex: 1 }}>
            <Text style={styles.historyCustomer}>{order.customerName ?? "—"}</Text>
            <Text style={styles.historyDate}>{order.orderDate ?? ""}</Text>
        </View>
        <Text style={styles.historyQty}>{order.quantity} units</Text>
    </View>
);

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function ProductDetailScreen({ route }) {
    const { theme } = useTheme();           // Live theme
    const s = makeStyles(theme);            // Dynamic styles
    const { product } = route.params;

    const [lastBatch, setLastBatch] = useState(null);
    const [production, setProduction] = useState(null);
    const [history, setHistory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const LENGTH_LABELS = {
        L5_5: "5.5", L6: "6.0", L7: "7.0",
        L7_5: "7.5", L8_5: "8.5", L9: "9.0", L9_5: "9.5",
    };

    const lengthLabel = LENGTH_LABELS[product.length] ?? product.length ?? "—";

    const load = useCallback(async () => {
        setLoading(true);
        setError(false);
        try {
            const [lbRes, tpRes, histRes] = await Promise.all([
                inventoryApi.getLastBatch(product.id),
                inventoryApi.getTotalProduction(product.id),
                inventoryApi.getProductHistory(product.id),
            ]);
            setLastBatch(lbRes.data);
            setProduction(tpRes.data);
            setHistory(histRes.data);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [product.id]);

    useEffect(() => { load(); }, [load]);

    const formatDateTime = (dt) => {
        if (!dt) return "—";
        const d = new Date(dt);
        return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    };

    const stockStatus =
        product.stockQuantity === 0 ? "Out of Stock" :
            product.stockQuantity < 500 ? "Low Stock" : "Stable";

    const statusBg =
        product.stockQuantity === 0 ? theme.colors.errorContainer :
            product.stockQuantity < 500 ? theme.colors.warningContainer : theme.colors.tertiaryFixed;

    const statusText =
        product.stockQuantity === 0 ? theme.colors.onErrorContainer :
            product.stockQuantity < 500 ? theme.colors.onWarningContainer : theme.colors.onTertiaryFixedVariant;

    return (
        <View style={s.container}>
            <CustomHeader showBack />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={s.scrollContent}
            >
                <Text style={s.screenTitle}>{product.name}</Text>

                {/* ── Identity card ── */}
                <View style={s.card}>
                    <View style={s.identityRow}>
                        <View style={s.productIcon}>
                            <Ionicons name="cube-outline" size={24} color={theme.colors.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={s.productName}>{product.name}</Text>
                            <Text style={s.productSub}>
                                {lengthLabel}mm · Tack-{product.name.replace(/\s+/g, "-")}
                            </Text>
                        </View>
                        <View style={[s.badge, { backgroundColor: statusBg }]}>
                            <Text style={[s.badgeText, { color: statusText }]}>{stockStatus}</Text>
                        </View>
                    </View>

                    <View style={s.divider} />

                    <View style={s.tilesRow}>
                        <StatTile
                            label="In Stock"
                            value={(product.stockQuantity || 0).toLocaleString("en-IN")}
                            sub="units"
                            theme={theme}
                            styles={s}
                        />
                        <View style={s.tileDivider} />
                        <StatTile
                            label="Total Produced"
                            value={production?.totalProduced?.toLocaleString("en-IN") ?? "—"}
                            sub="all time"
                            theme={theme}
                            styles={s}
                        />
                        <View style={s.tileDivider} />
                        <StatTile
                            label="Last Batch"
                            value={lastBatch ? formatDateTime(lastBatch.lastBatchCreatedAt) : "—"}
                            sub={lastBatch?.lastBatchQuantity ? `${lastBatch.lastBatchQuantity} kg` : null}
                            theme={theme}
                            styles={s}
                        />
                    </View>
                </View>

                {loading ? (
                    <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 32 }} />
                ) : error ? (
                    <Text style={s.emptyText}>Could not load production data.</Text>
                ) : (
                    <>
                        <Text style={s.sectionTitle}>Last Production Run</Text>
                        <View style={s.card}>
                            {lastBatch ? (
                                <View style={s.batchRow}>
                                    <View style={s.batchIcon}>
                                        <Ionicons name="hardware-chip-outline" size={18} color={theme.colors.primary} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={s.batchDate}>
                                            {formatDateTime(lastBatch.lastBatchCreatedAt)}
                                        </Text>
                                        <Text style={s.batchSub}>
                                            {lastBatch.lastBatchQuantity} kg used · {lengthLabel}mm sticks
                                        </Text>
                                    </View>
                                </View>
                            ) : (
                                <Text style={s.emptyText}>No batches recorded yet.</Text>
                            )}
                        </View>

                        <Text style={s.sectionTitle}>Recent Orders</Text>
                        <View style={s.card}>
                            {history?.recentOrders?.length > 0 ? (
                                history.recentOrders.map((order, i) => (
                                    <HistoryRow
                                        key={i}
                                        order={order}
                                        isLast={i === history.recentOrders.length - 1}
                                        styles={s}
                                    />
                                ))
                            ) : (
                                <Text style={s.emptyText}>No orders for this product yet.</Text>
                            )}
                        </View>
                    </>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const makeStyles = (theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
    screenTitle: {
        fontSize: 22, fontWeight: "700",
        color: theme.colors.onSurface, marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16, fontWeight: "700",
        color: theme.colors.onSurface,
        marginBottom: 10, marginTop: 4,
    },
    card: {
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderRadius: 16, padding: 16,
        borderWidth: 1, borderColor: theme.colors.outlineVariant,
        marginBottom: 20,
    },
    identityRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    productIcon: {
        width: 44, height: 44, borderRadius: 12,
        backgroundColor: theme.colors.primaryContainer,
        justifyContent: "center", alignItems: "center",
    },
    productName: { fontSize: 15, fontWeight: "700", color: theme.colors.onSurface },
    productSub: { fontSize: 12, color: theme.colors.outline, marginTop: 2 },
    badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
    badgeText: { fontSize: 10, fontWeight: "700" },
    divider: {
        height: 1, backgroundColor: theme.colors.outlineVariant, marginVertical: 14,
    },
    tilesRow: { flexDirection: "row", alignItems: "center" },
    tile: { flex: 1, alignItems: "center" },
    tileValue: { fontSize: 16, fontWeight: "700", color: theme.colors.onSurface },
    tileLabel: { fontSize: 11, fontWeight: "600", color: theme.colors.outline, marginTop: 3 },
    tileSub: { fontSize: 10, color: theme.colors.outline, marginTop: 1 },
    tileDivider: { width: 1, height: 32, backgroundColor: theme.colors.outlineVariant },
    batchRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    batchIcon: {
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: theme.colors.primaryContainer,
        justifyContent: "center", alignItems: "center",
    },
    batchDate: { fontSize: 14, fontWeight: "700", color: theme.colors.onSurface },
    batchSub: { fontSize: 12, color: theme.colors.outline, marginTop: 2 },
    historyRow: {
        flexDirection: "row", alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1, borderBottomColor: theme.colors.outlineVariant,
    },
    historyCustomer: { fontSize: 14, fontWeight: "600", color: theme.colors.onSurface },
    historyDate: { fontSize: 12, color: theme.colors.outline, marginTop: 2 },
    historyQty: { fontSize: 14, fontWeight: "700", color: theme.colors.primary },
    emptyText: {
        textAlign: "center", color: theme.colors.outline,
        paddingVertical: 20, fontSize: 14,
    },
});