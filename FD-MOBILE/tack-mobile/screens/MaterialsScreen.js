import React, { useState, useEffect } from "react";
import {
    View, Text, StyleSheet, ScrollView, TextInput,
    RefreshControl, ActivityIndicator, Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { inventoryApi } from "../api/inventoryApi";

import { CustomHeader } from "../components/CustomHeader";
import { BottomNavBar } from "../components/BottomNavBar";
import { InventoryCard } from "../components/InventoryCard";
import { Button } from "../components/Button";
import { Toast } from "../components/Toast";
import { Input } from "../components/Input";

import { theme } from "../constants/theme";

export default function MaterialsScreen() {
    // UI State
    const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
    const [viewAll, setViewAll] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [cost, setCost] = useState("");
    const [supplier, setSupplier] = useState("");

    // Data State
    const [materials, setMaterials] = useState([]);

    const showToast = (message, type = 'success') => {
        setToast({ visible: true, message, type });
    };

    const formatINR = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const fetchMaterials = async () => {
        try {
            const response = await inventoryApi.getMaterials();
            setMaterials(response.data);
        } catch (error) {
            console.error("Fetch Error:", error);
            showToast("Server unreachable. Check Wi-Fi.", "error");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, []);

    const handleRegisterMaterial = async () => {
        if (!name.trim() || !quantity || !cost || !supplier.trim()) {
            showToast("Please fill all fields", "warning");
            return;
        }

        const payload = {
            name: name.trim(),
            quantityKg: parseFloat(quantity),
            costPerKg: parseFloat(cost),
            supplier: supplier.trim(),
            //createdAt: new Date().toISOString().split("T")[0] to be fixed in backend.
            createdAt: new Date().toISOString()
        };

        try {
            const response = await inventoryApi.addMaterials(payload);

            if (response.status === 200 || response.status === 201) {
                showToast(`${name} added!`, "success");
                setName(""); setQuantity(""); setCost(""); setSupplier("");
                fetchMaterials(); // List will now show newest at top
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Failed to save material";
            showToast(errorMsg, "error");
        }
    };

    // LOGIC: Newest first, then slice for preview
    const processedMaterials = [...materials].reverse();
    const displayedMaterials = viewAll ? processedMaterials : processedMaterials.slice(0, 3);
    const totalValue = materials.reduce((acc, curr) => acc + (curr.quantityKg * curr.costPerKg), 0);

    return (
        <View style={styles.container}>
            <CustomHeader
                title="Raw Materials"
                subtitle="Manage stock for the adhesive production line."
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => { setRefreshing(true); fetchMaterials(); }}
                        colors={[theme.colors.primary]}
                    />
                }
            >
                {/* Registration Form */}
                <View style={styles.formCard}>
                    <View style={styles.formHeader}>
                        <Ionicons name="add-circle" size={22} color={theme.colors.primary} />
                        <Text style={styles.formTitle}>Add New Stock</Text>
                    </View>

                    <Input
                        label="Material Name"
                        value={name}
                        onChangeText={setName}
                        placeholder="e.g. Resin Pellets"
                    />

                    <Input
                        label="Supplier"
                        value={supplier}
                        onChangeText={setSupplier}
                        placeholder="e.g. GlueChem Industries"
                    />

                    <View style={styles.inputRow}>
                        <View style={{ flex: 1, marginRight: 12 }}>
                            <Input
                                label="Qty (KG)"
                                value={quantity}
                                onChangeText={setQuantity}
                                placeholder="0.00"
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Input
                                label="Cost/KG (₹)"
                                value={cost}
                                onChangeText={setCost}
                                placeholder="₹ 0.00"
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <Button label="Register Material" variant="primary" onPress={handleRegisterMaterial} />
                </View>

                {/* Stats Summary */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Total Inventory Value</Text>
                    <Text style={styles.summaryValue}>{formatINR(totalValue)}</Text>
                    <View style={styles.trendBadge}>
                        <Ionicons name="stats-chart" size={14} color="white" />
                        <Text style={styles.trendText}>Live Factory Stats</Text>
                    </View>
                </View>

                {/* Stock List with Toggle */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Stock</Text>
                    {materials.length > 3 && (
                        <Text
                            style={styles.viewAllText}
                            onPress={() => setViewAll(!viewAll)}
                        >
                            {viewAll ? "Show Less" : "View All"}
                        </Text>
                    )}
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
                ) : (
                    displayedMaterials.map((item) => (
                        <InventoryCard
                            key={item.id}
                            name={item.name || "Unnamed Material"}
                            sku={item.supplier || "Local Vendor"}
                            quantity={item.quantityKg.toLocaleString('en-IN')}
                            unit="kg"
                            unitCost={item.costPerKg.toFixed(2)}
                            status={item.quantityKg <= 0 ? "OUT OF STOCK" : item.quantityKg < 15 ? "LOW STOCK" : "STABLE"}
                            progress={Math.min((item.quantityKg / 100) * 100, 100)}
                        />
                    ))
                )}

                {!viewAll && materials.length > 3 && (
                    <Text style={styles.moreIndicator}>+ {materials.length - 3} more items hidden</Text>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>

            {toast.visible && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onHide={() => setToast({ ...toast, visible: false })}
                />
            )}

            <BottomNavBar activeRoute="Materials" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
    titleSection: { marginBottom: 24 },
    screenTitle: { fontSize: 28, fontWeight: '700', color: theme.colors.onSurface, letterSpacing: -0.5 },
    subtitle: { fontSize: 14, color: theme.colors.onSurfaceVariant, marginTop: 4 },
    formCard: {
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderRadius: 16, padding: 20,
        borderWidth: 1, borderColor: theme.colors.outlineVariant,
        marginBottom: 24
    },
    formHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    formTitle: { fontSize: 16, fontWeight: '700', marginLeft: 10, color: theme.colors.onSurface },
    inputLabel: { fontSize: 11, fontWeight: '800', color: theme.colors.outline, marginBottom: 8, letterSpacing: 1 },
    input: {
        backgroundColor: theme.colors.surfaceContainerLow,
        borderWidth: 1, borderColor: theme.colors.outlineVariant,
        borderRadius: 8, padding: 12, marginBottom: 16,
        fontSize: 16, color: theme.colors.onSurface
    },
    inputRow: { flexDirection: 'row', marginBottom: 10 },
    summaryCard: { backgroundColor: theme.colors.primary, borderRadius: 16, padding: 24, marginBottom: 32 },
    summaryLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
    summaryValue: { color: 'white', fontSize: 30, fontWeight: '700', marginVertical: 8 },
    trendBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    trendText: { color: 'white', fontSize: 12, fontWeight: '600', marginLeft: 6 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { fontSize: 20, fontWeight: '700', color: theme.colors.onSurface },
    viewAllText: { color: theme.colors.primary, fontWeight: '700', fontSize: 14 },
    moreIndicator: { textAlign: 'center', color: theme.colors.outline, fontSize: 12, marginTop: 10, fontStyle: 'italic' }
});