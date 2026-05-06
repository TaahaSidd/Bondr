import React, { useState, useEffect, useCallback } from "react";
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, ActivityIndicator, SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../context/ThemeContext"; // ← Added Theme Hook
import { inventoryApi } from "../api/inventoryApi";

import { BottomNavBar } from "../components/BottomNavBar";
import { Button } from "../components/Button";
import { StatCard } from "../components/StatCard";
import { FinishedGoodCard } from "../components/FinishedGoodCard";
import { Toast } from "../components/Toast";
import { BaseModal } from "../components/BaseModal";
import { Input } from "../components/Input";
import { PickerField } from "../components/PickerField";
import { ItemSelector } from "../components/ItemSelector";

const LENGTHS = [
    { id: 1, name: "5.5 mm", value: "L5_5" },
    { id: 2, name: "6.0 mm", value: "L6" },
    { id: 3, name: "7.0 mm", value: "L7" },
    { id: 4, name: "7.5 mm", value: "L7_5" },
    { id: 5, name: "8.5 mm", value: "L8_5" },
    { id: 6, name: "9.0 mm", value: "L9" },
    { id: 7, name: "9.5 mm", value: "L9_5" },
];

const LENGTH_LABELS = {
    L5_5: "5.5", L6: "6.0", L7: "7.0",
    L7_5: "7.5", L8_5: "8.5", L9: "9.0", L9_5: "9.5",
};

export default function StockScreen({ navigation }) {
    const { theme } = useTheme();           // ← Live theme
    const s = makeStyles(theme);            // ← Dynamic styles

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setSubmitting] = useState(false);
    const [modalVisible, setModal] = useState(false);
    const [showLengthModal, setLengthModal] = useState(false);
    const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedLength, setSelectedLength] = useState(null);

    const showToast = (message, type = "success") =>
        setToast({ visible: true, message, type });

    const fetchProducts = useCallback(async () => {
        try {
            const res = await inventoryApi.getProducts();
            setProducts(res.data);
        } catch {
            showToast("Connection error.", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const handleCreateProduct = async () => {
        if (!name.trim()) { showToast("Enter a product name.", "warning"); return; }
        if (!selectedLength) { showToast("Select a stick length.", "warning"); return; }

        setSubmitting(true);
        try {
            await inventoryApi.createProduct({
                name: name.trim(),
                description: description.trim(),
                length: selectedLength.value,
            });
            showToast("Product added!");
            setName(""); setDescription(""); setSelectedLength(null);
            setModal(false);
            fetchProducts();
        } catch (e) {
            showToast(e.response?.data?.message ?? "Failed to create product.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const totalUnits = products.reduce((a, p) => a + (p.stockQuantity || 0), 0);
    const lowStockCount = products.filter(p => (p.stockQuantity || 0) < 500).length;

    return (
        <SafeAreaView style={s.container}>
            <ItemSelector
                visible={showLengthModal}
                items={LENGTHS}
                title="Select Length"
                onSelect={setSelectedLength}
                onClose={() => setLengthModal(false)}
                renderSub={() => "Standard factory size"}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={s.scrollContent}
            >
                <Text style={s.screenTitle}>Finished Goods</Text>

                <View style={s.actionRow}>
                    <Button
                        label="Add Product"
                        variant="primary"
                        icon="add-outline"
                        onPress={() => setModal(true)}
                        style={s.addBtn}
                    />
                    <TouchableOpacity style={s.filterBtn}>
                        <Ionicons name="filter-outline" size={20} color={theme.colors.onSurfaceVariant} />
                    </TouchableOpacity>
                </View>

                <View style={s.statsRow}>
                    <StatCard
                        label="Total Stock"
                        value={totalUnits.toLocaleString()}
                        subtext={`${products.length} categories`}
                        type="primary"
                        style={{ flex: 1 }}
                    />
                    <StatCard
                        label="Low / Out"
                        value={lowStockCount.toString()}
                        subtext="Restock soon"
                        type={lowStockCount > 0 ? "error" : "primary"}
                        style={{ flex: 1 }}
                    />
                </View>

                <Text style={s.sectionTitle}>Product Catalog</Text>

                {loading ? (
                    <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 20 }} />
                ) : products.length === 0 ? (
                    <Text style={s.emptyText}>No products added yet.</Text>
                ) : (
                    products.map(item => (
                        <FinishedGoodCard
                            key={item.id}
                            name={`${item.name} (${LENGTH_LABELS[item.length] || item.length}mm)`}
                            sku={`Tack-${item.name.replace(/\s+/g, "-")}`}
                            qty={(item.stockQuantity || 0).toLocaleString()}
                            unit="sticks"
                            status={
                                item.stockQuantity === 0 ? "Out of Stock" :
                                    item.stockQuantity < 500 ? "Low Stock" : "Stable"
                            }
                            onPress={() => navigation.navigate("ProductDetails", { product: item })}
                        />
                    ))
                )}
                <View style={{ height: 120 }} />
            </ScrollView>

            <BaseModal
                visible={modalVisible}
                onClose={() => setModal(false)}
                title="New Product"
                subtitle="Add a glue stick variant to the catalog."
                actions={
                    <>
                        <Button label="Cancel" variant="text" onPress={() => setModal(false)} />
                        <View style={{ flex: 1 }}>
                            <Button
                                label="Create"
                                variant="primary"
                                loading={isSubmitting}
                                onPress={handleCreateProduct}
                            />
                        </View>
                    </>
                }
            >
                <Input
                    label="Product Name"
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. Clear Sticks"
                />
                <PickerField
                    label="Stick Length"
                    value={selectedLength?.name}
                    placeholder="Select length"
                    onPress={() => setLengthModal(true)}
                />
                <Input
                    label="Description"
                    value={description}
                    onChangeText={setDescription}
                    placeholder="e.g. Industrial grade"
                    multiline
                />
            </BaseModal>

            {toast.visible && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onHide={() => setToast({ ...toast, visible: false })}
                />
            )}

            <BottomNavBar activeRoute="Stock" />
        </SafeAreaView>
    );
}

const makeStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        marginTop: 24 // ← Added margin as requested
    },
    scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },

    screenTitle: {
        fontSize: 22, fontWeight: "700",
        color: theme.colors.onSurface, marginBottom: 16,
    },
    actionRow: {
        flexDirection: "row", alignItems: "center",
        gap: 12, marginBottom: 16,
    },
    addBtn: { flex: 1, marginVertical: 0 },
    filterBtn: {
        width: 52, height: 52,
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderRadius: 12, justifyContent: "center", alignItems: "center",
        borderWidth: 1, borderColor: theme.colors.outlineVariant,
    },
    statsRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
    sectionTitle: {
        fontSize: 16, fontWeight: "700",
        color: theme.colors.onSurface, marginBottom: 12,
    },
    emptyText: {
        textAlign: "center", color: theme.colors.outline,
        paddingVertical: 24, fontSize: 14,
    },
});