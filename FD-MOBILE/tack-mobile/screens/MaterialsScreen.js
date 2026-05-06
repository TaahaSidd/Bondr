import React, { useState, useEffect } from "react";
import {
    View, Text, StyleSheet, ScrollView,
    RefreshControl, ActivityIndicator, TouchableOpacity
} from "react-native";

import { useTheme } from "../context/ThemeContext";
import { inventoryApi } from "../api/inventoryApi";
import { CustomHeader } from "../components/CustomHeader";
import { BottomNavBar } from "../components/BottomNavBar";
import { InventoryCard } from "../components/InventoryCard";
import { Button } from "../components/Button";
import { Toast } from "../components/Toast";
import { Input } from "../components/Input";

export default function MaterialsScreen({ navigation }) {
    const { theme } = useTheme();
    const s = makeStyles(theme);

    const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [viewAll, setViewAll] = useState(false);

    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [cost, setCost] = useState("");
    const [supplier, setSupplier] = useState("");
    const [materials, setMaterials] = useState([]);

    const showToast = (message, type = "success") =>
        setToast({ visible: true, message, type });

    const formatINR = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency", currency: "INR", maximumFractionDigits: 0,
        }).format(amount);

    const fetchMaterials = async () => {
        try {
            const res = await inventoryApi.getMaterials();
            setMaterials(res.data);
        } catch {
            showToast("Server unreachable. Check Wi-Fi.", "error");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchMaterials(); }, []);

    const handleRegisterMaterial = async () => {
        if (!name.trim() || !quantity || !cost || !supplier.trim()) {
            showToast("Please fill all fields.", "warning"); return;
        }
        setSubmitting(true);
        try {
            await inventoryApi.addMaterials({
                name: name.trim(),
                quantityKg: parseFloat(quantity),
                costPerKg: parseFloat(cost),
                supplier: supplier.trim(),
                createdAt: new Date().toISOString().split("T")[0],
            });
            showToast(`${name} added!`);
            setName(""); setQuantity(""); setCost(""); setSupplier("");
            fetchMaterials();
        } catch (e) {
            showToast(e.response?.data?.message ?? "Failed to save material.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const processedMaterials = [...materials].reverse();
    const displayedMaterials = viewAll ? processedMaterials : processedMaterials.slice(0, 3);
    const totalValue = materials.reduce((a, m) => a + m.quantityKg * m.costPerKg, 0);

    return (
        <View style={s.container}>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={s.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => { setRefreshing(true); fetchMaterials(); }}
                        colors={[theme.colors.primary]}
                        tintColor={theme.colors.primary}
                    />
                }
            >
                <Text style={s.screenTitle}>Raw Materials</Text>

                {/* Add stock card */}
                <View style={s.card}>
                    <Text style={s.cardTitle}>Add New Stock</Text>
                    <View style={s.row}>
                        <View style={s.halfLeft}>
                            <Input label="Material Name" value={name} onChangeText={setName} placeholder="Resin Pellets" />
                        </View>
                        <View style={s.halfRight}>
                            <Input label="Supplier" value={supplier} onChangeText={setSupplier} placeholder="GlueChem" />
                        </View>
                    </View>
                    <View style={s.row}>
                        <View style={s.halfLeft}>
                            <Input label="Qty (kg)" value={quantity} onChangeText={setQuantity} placeholder="0.00" keyboardType="numeric" />
                        </View>
                        <View style={s.halfRight}>
                            <Input label="Cost / kg (₹)" value={cost} onChangeText={setCost} placeholder="0.00" keyboardType="numeric" />
                        </View>
                    </View>
                    <Button
                        label="Register Material"
                        variant="primary"
                        onPress={handleRegisterMaterial}
                        loading={submitting}
                        disabled={submitting}
                    />
                </View>

                {/* Stat strip */}
                <View style={s.statRow}>
                    <View style={s.statItem}>
                        <Text style={s.statLabel}>Total Inventory Value</Text>
                        <Text style={s.statValue}>{formatINR(totalValue)}</Text>
                    </View>
                    <View style={s.statDivider} />
                    <View style={s.statItem}>
                        <Text style={s.statLabel}>Materials</Text>
                        <Text style={s.statValue}>{materials.length}</Text>
                    </View>
                </View>

                {/* Stock list */}
                <View style={s.listHeader}>
                    <Text style={s.sectionTitle}>Recent Stock</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("MaterialStock")}>
                        <Text style={s.viewAllText}>View all</Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 20 }} />
                ) : displayedMaterials.length === 0 ? (
                    <Text style={s.emptyText}>No materials added yet.</Text>
                ) : (
                    displayedMaterials.map(item => (
                        <InventoryCard
                            key={item.id}
                            name={item.name || "Unnamed"}
                            sku={item.supplier || "—"}
                            quantity={item.quantityKg.toLocaleString("en-IN")}
                            unit="kg"
                            unitCost={item.costPerKg.toFixed(2)}
                            status={
                                item.quantityKg <= 0 ? "OUT OF STOCK" :
                                    item.quantityKg < 15 ? "LOW STOCK" : "STABLE"
                            }
                            progress={Math.min((item.quantityKg / 100) * 100, 100)}
                        />
                    ))
                )}

                <View style={{ height: 100 }} />
            </ScrollView>

            {toast.visible && (
                <Toast message={toast.message} type={toast.type}
                    onHide={() => setToast({ ...toast, visible: false })} />
            )}

            <BottomNavBar activeRoute="Materials" />
        </View>
    );
}

const makeStyles = (theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, marginTop: 24 },
    scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },

    screenTitle: { fontSize: 22, fontWeight: "700", color: theme.colors.onSurface, marginBottom: 16 },

    card: {
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderRadius: 16, padding: 20,
        borderWidth: 1, borderColor: theme.colors.outlineVariant,
        marginBottom: 16,
    },
    cardTitle: { fontSize: 15, fontWeight: "700", color: theme.colors.onSurface, marginBottom: 16 },

    row: { flexDirection: "row" },
    halfLeft: { flex: 1, marginRight: 8 },
    halfRight: { flex: 1, marginLeft: 8 },

    statRow: {
        flexDirection: "row",
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderRadius: 16, borderWidth: 1, borderColor: theme.colors.outlineVariant,
        padding: 16, marginBottom: 24, alignItems: "center",
    },
    statItem: { flex: 1, alignItems: "center" },
    statDivider: { width: 1, height: 32, backgroundColor: theme.colors.outlineVariant },
    statLabel: { fontSize: 11, color: theme.colors.outline, fontWeight: "600", marginBottom: 4 },
    statValue: { fontSize: 18, fontWeight: "700", color: theme.colors.onSurface },

    listHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
    sectionTitle: { fontSize: 16, fontWeight: "700", color: theme.colors.onSurface },
    viewAllText: { fontSize: 13, fontWeight: "600", color: theme.colors.primary },
    emptyText: { textAlign: "center", color: theme.colors.outline, paddingVertical: 24, fontSize: 14 },
});