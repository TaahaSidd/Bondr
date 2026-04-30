import React, { useState, useEffect, useCallback } from "react";
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { CustomHeader } from "../components/CustomHeader";
import { BottomNavBar } from "../components/BottomNavBar";
import { PerformanceCard } from "../components/PerformanceCard";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Toast } from "../components/Toast";
import { ItemSelector } from "../components/ItemSelector";
import { PickerField } from "../components/PickerField";

import { theme } from "../constants/theme";
import { inventoryApi } from "../api/inventoryApi";

// ─── Batch History Item ───────────────────────────────────────────────────────
const BatchHistoryItem = ({ batch }) => {
    const yieldVal = batch.yieldPercent ?? Math.round((batch.sticksProduced / 480) * 100);
    const isGood = yieldVal >= 90;

    return (
        <View style={styles.historyItem}>
            <View style={[styles.statusDot, { backgroundColor: isGood ? "#dcfce7" : "#fef9c3" }]}>
                <Ionicons
                    name={isGood ? "checkmark-circle" : "warning"}
                    size={18}
                    color={isGood ? "#16a34a" : "#ca8a04"}
                />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.historyId}>Batch #{batch.id ?? batch.batchId}</Text>
                <Text style={styles.historyMeta}>
                    {batch.rawMaterial?.name ?? "—"} · {batch.sticksProduced} units
                </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
                <Text style={[styles.yieldText, { color: isGood ? "#16a34a" : "#ca8a04" }]}>
                    {yieldVal}%
                </Text>
                <Text style={styles.yieldLabel}>Yield</Text>
            </View>
        </View>
    );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function BatchesScreen() {
    const [rawMaterials, setRawMaterials] = useState([]);
    const [products, setProducts] = useState([]);
    const [batches, setBatches] = useState([]);
    const [selectedRM, setSelectedRM] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [beadsUsed, setBeadsUsed] = useState("");
    const [sticks, setSticks] = useState("");
    const [wastage, setWastage] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    const [showRMModal, setShowRMModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

    const showToast = (message, type = "success") =>
        setToast({ visible: true, message, type });

    const loadAll = useCallback(async () => {
        setLoadingData(true);
        try {
            const [rmRes, prodRes, batchRes] = await Promise.all([
                inventoryApi.getMaterials(),
                inventoryApi.getProducts(),
                inventoryApi.getBatches(),
            ]);
            setRawMaterials(rmRes.data);
            setProducts(prodRes.data);
            setBatches([...batchRes.data].reverse().slice(0, 3));
        } catch {
            showToast("Could not load data. Check connection.", "error");
        } finally {
            setLoadingData(false);
        }
    }, []);

    useEffect(() => { loadAll(); }, [loadAll]);

    const validate = () => {
        if (!selectedRM) { showToast("Select a raw material.", "warning"); return false; }
        if (!selectedProduct) { showToast("Select a product.", "warning"); return false; }
        if (!beadsUsed || parseFloat(beadsUsed) < 5) { showToast("Min. beads required: 5.0 kg", "warning"); return false; }
        if (parseFloat(beadsUsed) > (selectedRM.quantityKg ?? Infinity)) { showToast(`Only ${selectedRM.quantityKg} kg available.`, "error"); return false; }
        if (!sticks || parseFloat(sticks) <= 0) { showToast("Enter sticks produced.", "warning"); return false; }
        if (wastage === "" || parseFloat(wastage) < 0) { showToast("Enter a valid wastage amount.", "warning"); return false; }
        return true;
    };

    const handleCreate = async () => {
        if (!validate()) return;
        setSubmitting(true);
        try {
            await inventoryApi.createBatch({
                rawMaterialId: selectedRM.id,
                productId: selectedProduct.id,
                beadsUsedKg: parseFloat(beadsUsed),
                sticksProduced: parseFloat(sticks),
                wastageKg: parseFloat(wastage),
                date: `${date}T00:00:00`,
                });
            showToast("Batch created! Stock updated.", "success");
            setSelectedRM(null); setSelectedProduct(null);
            setBeadsUsed(""); setSticks(""); setWastage("");
            setDate(new Date().toISOString().split("T")[0]);
            loadAll();
        } catch (e) {
            const msg = e.response?.data?.message ?? e.message ?? "Something went wrong.";
            showToast(msg, "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <CustomHeader title="Batches" />

            {/* External Item Selector for Raw Materials */}
            <ItemSelector
                visible={showRMModal}
                items={rawMaterials}
                title="Raw Material"
                onSelect={setSelectedRM}
                onClose={() => setShowRMModal(false)}
                renderSub={(item) => `${item.quantityKg} kg in stock`}
            />

            {/* External Item Selector for Products */}
            <ItemSelector
                visible={showProductModal}
                items={products}
                title="Target Product"
                onSelect={setSelectedProduct}
                onClose={() => setShowProductModal(false)}
                renderSub={(item) => `Current Stock: ${item.stockQuantity} units`}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.titleRow}>
                    <Text style={styles.screenTitle}>Start Batch</Text>
                </View>

                {/* ── Form Card ── */}
                <View style={styles.formCard}>

                    {/* Row 1: Pickers using the dynamic containerStyle */}
                    <View style={styles.row}>
                        <PickerField
                            label="Raw Material"
                            value={selectedRM?.name}
                            placeholder="Select RM"
                            onPress={() => setShowRMModal(true)}
                            //helperText={selectedRM ? `${selectedRM.quantityKg} kg left` : null}
                            containerStyle={{ flex: 1, marginRight: 8 }}
                        />
                        <PickerField
                            label="Product"
                            value={selectedProduct?.name}
                            placeholder="Select Product"
                            onPress={() => setShowProductModal(true)}
                            //helperText={selectedProduct ? `${selectedProduct.stockQuantity} in stock` : null}
                            containerStyle={{ flex: 1, marginLeft: 8 }}
                        />
                    </View>

                    {/* Row 2: Beads + Sticks */}
                    <View style={styles.row}>
                        <View style={styles.halfLeft}>
                            <Input
                                label="Beads Used (kg)"
                                value={beadsUsed}
                                onChangeText={setBeadsUsed}
                                placeholder="0.00"
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.halfRight}>
                            <Input
                                label="Sticks Produced"
                                value={sticks}
                                onChangeText={setSticks}
                                placeholder="0"
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    {/* Row 3: Wastage + Date */}
                    <View style={styles.row}>
                        <View style={styles.halfLeft}>
                            <Input
                                label="Wastage (kg)"
                                value={wastage}
                                onChangeText={setWastage}
                                placeholder="0.00"
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.halfRight}>
                            <Input
                                label="Date"
                                value={date}
                                onChangeText={setDate}
                                placeholder="YYYY-MM-DD"
                                maxLength={10}
                            />
                        </View>
                    </View>

                    <Button
                        label="Create Batch"
                        variant="primary"
                        onPress={handleCreate}
                        loading={submitting}
                        disabled={submitting}
                    />
                </View>

                {/* Performance */}
                <Text style={styles.sectionTitle}>Recent Performance</Text>
                <PerformanceCard efficiency="94.2" trend="+2.1%" />

                {/* Batch History */}
                <View style={styles.historyContainer}>
                    <View style={styles.historyHeader}>
                        <Text style={styles.historyTitle}>LAST 3 BATCHES</Text>
                        <TouchableOpacity onPress={loadAll} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                            <Ionicons name="refresh-outline" size={16} color={theme.colors.outline} />
                        </TouchableOpacity>
                    </View>

                    {loadingData ? (
                        <ActivityIndicator style={{ marginVertical: 20 }} color={theme.colors.primary} />
                    ) : batches.length === 0 ? (
                        <Text style={styles.emptyText}>No batches recorded yet.</Text>
                    ) : (
                        batches.map((b, i) => <BatchHistoryItem key={b.id ?? i} batch={b} />)
                    )}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {toast.visible && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onHide={() => setToast({ ...toast, visible: false })}
                />
            )}

            <BottomNavBar activeRoute="Batches" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollContent: { paddingHorizontal: 24, paddingTop: 10 },

    titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
    screenTitle: { fontSize: 28, fontWeight: "700", color: theme.colors.onSurface },

    formCard: {
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderRadius: 16, padding: 20,
        borderWidth: 1, borderColor: theme.colors.outlineVariant,
        marginBottom: 24,
    },

    row: { flexDirection: "row" },
    halfLeft: { flex: 1, marginRight: 8 },
    halfRight: { flex: 1, marginLeft: 8 },

    sectionTitle: { fontSize: 18, fontWeight: "700", color: theme.colors.onSurface, marginBottom: 16 },

    historyContainer: {
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderRadius: 16, padding: 16,
        borderWidth: 1, borderColor: theme.colors.outlineVariant,
    },
    historyHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
    historyTitle: { fontSize: 11, fontWeight: "800", color: theme.colors.outline, letterSpacing: 1 },
    historyItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.outlineVariant },
    statusDot: { width: 34, height: 34, borderRadius: 10, justifyContent: "center", alignItems: "center" },
    historyId: { fontSize: 14, fontWeight: "700", color: theme.colors.onSurface },
    historyMeta: { fontSize: 12, color: theme.colors.outline, marginTop: 2 },
    yieldText: { fontSize: 16, fontWeight: "700" },
    yieldLabel: { fontSize: 10, fontWeight: "800", color: theme.colors.outline, letterSpacing: 0.5 },
    emptyText: { textAlign: "center", color: theme.colors.outline, paddingVertical: 20, fontSize: 14 },
});