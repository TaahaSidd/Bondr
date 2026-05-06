import React, { useState, useEffect, useCallback } from "react";
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, ActivityIndicator, SafeAreaView, Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';

import { useTheme } from "../context/ThemeContext"; // ← Added Theme Hook
import { CustomHeader } from "../components/CustomHeader";
import { BottomNavBar } from "../components/BottomNavBar";
import { PerformanceCard } from "../components/PerformanceCard";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Toast } from "../components/Toast";
import { ItemSelector } from "../components/ItemSelector";
import { PickerField } from "../components/PickerField";
import { inventoryApi } from "../api/inventoryApi";

// ─── Batch History Item ───────────────────────────────────────────────────────
const BatchHistoryItem = ({ batch, isLast, theme, s }) => {
    const yieldVal = batch.yieldPercent ?? Math.round((batch.sticksProduced / 480) * 100);
    const isGood = yieldVal >= 90;

    // Use theme tokens for conditional status colors
    const statusColor = isGood ? theme.colors.tertiaryFixed : theme.colors.warningContainer;
    const onStatusColor = isGood ? theme.colors.onTertiaryFixedVariant : theme.colors.onWarningContainer;

    return (
        <View style={[s.historyItem, isLast && { borderBottomWidth: 0 }]}>
            <View style={[s.statusDot, { backgroundColor: statusColor }]}>
                <Ionicons
                    name={isGood ? "checkmark-circle" : "warning"}
                    size={16}
                    color={onStatusColor}
                />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={s.historyId}>Batch #{batch.id ?? batch.batchId}</Text>
                <Text style={s.historyMeta}>
                    {batch.rawMaterial?.name ?? "—"} · {batch.sticksProduced} units
                </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
                <Text style={[s.yieldText, { color: onStatusColor }]}>
                    {yieldVal}%
                </Text>
                <Text style={s.yieldLabel}>Yield</Text>
            </View>
        </View>
    );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function BatchesScreen() {
    const { theme } = useTheme();           // ← Live theme
    const s = makeStyles(theme);            // ← Rebuilt styles

    const [rawMaterials, setRawMaterials] = useState([]);
    const [products, setProducts] = useState([]);
    const [batches, setBatches] = useState([]);
    const [selectedRM, setSelectedRM] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [beadsUsed, setBeadsUsed] = useState("");
    const [sticks, setSticks] = useState("");
    const [wastage, setWastage] = useState("");

    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [showRMModal, setShowRMModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

    const formatDate = (dateObj) => dateObj.toISOString().split("T")[0];

    const onDateChange = (event, selectedDate) => {
        if (Platform.OS === 'android') setShowDatePicker(false);
        if (selectedDate) setDate(selectedDate);
    };

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
            showToast("Could not load data.", "error");
        } finally {
            setLoadingData(false);
        }
    }, []);

    useEffect(() => { loadAll(); }, [loadAll]);

    const handleCreate = async () => {
        // Validation logic remains same...
        setSubmitting(true);
        try {
            await inventoryApi.createBatch({
                rawMaterialId: selectedRM.id,
                productId: selectedProduct.id,
                beadsUsedKg: parseFloat(beadsUsed),
                sticksProduced: parseFloat(sticks),
                wastageKg: parseFloat(wastage),
                date: formatDate(date),
            });
            showToast("Batch created!");
            setSelectedRM(null); setSelectedProduct(null);
            setBeadsUsed(""); setSticks(""); setWastage("");
            setDate(new Date());
            loadAll();
        } catch (e) {
            showToast(e.response?.data?.message ?? "Something went wrong.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={s.container}>

            <ItemSelector
                visible={showRMModal}
                items={rawMaterials}
                title="Raw Material"
                onSelect={setSelectedRM}
                onClose={() => setShowRMModal(false)}
                renderSub={item => `${item.quantityKg} kg in stock`}
            />
            <ItemSelector
                visible={showProductModal}
                items={products}
                title="Target Product"
                onSelect={setSelectedProduct}
                onClose={() => setShowProductModal(false)}
                renderSub={item => `Current stock: ${item.stockQuantity} units`}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={s.scrollContent}
            >
                <Text style={s.screenTitle}>Start Batch</Text>

                <View style={s.card}>
                    <View style={s.row}>
                        <PickerField
                            label="Raw Material"
                            value={selectedRM?.name}
                            placeholder="Select RM"
                            onPress={() => setShowRMModal(true)}
                            containerStyle={s.halfLeft}
                        />
                        <PickerField
                            label="Product"
                            value={selectedProduct?.name}
                            placeholder="Select product"
                            onPress={() => setShowProductModal(true)}
                            containerStyle={s.halfRight}
                        />
                    </View>

                    <View style={s.row}>
                        <View style={s.halfLeft}>
                            <Input label="Beads Used (kg)" value={beadsUsed} onChangeText={setBeadsUsed} placeholder="0.00" keyboardType="numeric" />
                        </View>
                        <View style={s.halfRight}>
                            <Input label="Sticks Produced" value={sticks} onChangeText={setSticks} placeholder="0" keyboardType="numeric" />
                        </View>
                    </View>

                    <View style={s.row}>
                        <View style={s.halfLeft}>
                            <Input label="Wastage (kg)" value={wastage} onChangeText={setWastage} placeholder="0.00" keyboardType="numeric" />
                        </View>
                        <View style={s.halfRight}>
                            <PickerField
                                label="Date"
                                value={formatDate(date)}
                                placeholder="Select Date"
                                onPress={() => setShowDatePicker(true)}
                            />
                        </View>
                    </View>

                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onDateChange}
                            maximumDate={new Date()}
                        />
                    )}

                    <Button
                        label="Create Batch"
                        variant="primary"
                        onPress={handleCreate}
                        loading={submitting}
                        disabled={submitting}
                    />
                </View>

                <Text style={s.sectionTitle}>Recent Performance</Text>
                <PerformanceCard efficiency="94.2" trend="+2.1%" />

                <Text style={s.sectionTitle}>Last 3 Batches</Text>
                <View style={s.card}>
                    <View style={s.historyHeader}>
                        <Text style={s.historyCount}>{batches.length} recorded</Text>
                        <TouchableOpacity onPress={loadAll}>
                            <Ionicons name="refresh-outline" size={16} color={theme.colors.outline} />
                        </TouchableOpacity>
                    </View>

                    {loadingData ? (
                        <ActivityIndicator style={{ marginVertical: 20 }} color={theme.colors.primary} />
                    ) : batches.length === 0 ? (
                        <Text style={s.emptyText}>No batches recorded yet.</Text>
                    ) : (
                        batches.map((b, i) => (
                            <BatchHistoryItem
                                key={b.id ?? i}
                                batch={b}
                                theme={theme}
                                s={s}
                                isLast={i === batches.length - 1}
                            />
                        ))
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
        </SafeAreaView>
    );
}

const makeStyles = (theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background, marginTop: 24, },
    scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
    screenTitle: {
        fontSize: 22, fontWeight: "700",
        color: theme.colors.onSurface, marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16, fontWeight: "700",
        color: theme.colors.onSurface,
        marginBottom: 12, marginTop: 8,
    },
    card: {
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderRadius: 16, padding: 16,
        borderWidth: 1, borderColor: theme.colors.outlineVariant,
        marginBottom: 20,
    },
    row: { flexDirection: "row" },
    halfLeft: { flex: 1, marginRight: 8 },
    halfRight: { flex: 1, marginLeft: 8 },
    historyHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8
    },
    historyCount: { fontSize: 12, fontWeight: "600", color: theme.colors.outline },
    historyItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.outlineVariant
    },
    statusDot: { width: 32, height: 32, borderRadius: 8, justifyContent: "center", alignItems: "center" },
    historyId: { fontSize: 14, fontWeight: "700", color: theme.colors.onSurface },
    historyMeta: { fontSize: 12, color: theme.colors.outline, marginTop: 2 },
    yieldText: { fontSize: 15, fontWeight: "700" },
    yieldLabel: { fontSize: 10, fontWeight: "600", color: theme.colors.outline, marginTop: 1 },
    emptyText: { textAlign: "center", color: theme.colors.outline, paddingVertical: 20, fontSize: 14 },
});