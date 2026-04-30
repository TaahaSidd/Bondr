import React, { useState, useEffect } from "react";
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { inventoryApi } from "../api/inventoryApi";
import { theme } from "../constants/theme";

import { CustomHeader } from "../components/CustomHeader";
import { BottomNavBar } from "../components/BottomNavBar";
import { Button } from "../components/Button";
import { StatCard } from "../components/StatCard";
import { FinishedGoodCard } from "../components/FinishedGoodCard";
import { Toast } from "../components/Toast";
import { BaseModal } from "../components/BaseModal";
import { Input } from "../components/Input";
import { PickerField } from "../components/PickerField";
import { ItemSelector } from "../components/ItemSelector";

export default function StockScreen() {
    // Data & UI State
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

    // New State for Selectors
    const [showLengthModal, setShowLengthModal] = useState(false);
    const lengths = [
        { id: 1, name: "5.5", value: "L5_5" },
        { id: 2, name: "6.0", value: "L6" },
        { id: 3, name: "7.0", value: "L7" },
        { id: 4, name: "7.5", value: "L7_5" },
        { id: 5, name: "8.5", value: "L8_5" },
        { id: 6, name: "9.0", value: "L9" },
        { id: 7, name: "9.5", value: "L9_5" },
    ];

    const LENGTH_LABELS = {
      "L5_5": "5.5",
      "L6": "6.0",
      "L7": "7.0",
      "L7_5": "7.5",
      "L8_5": "8.5",
      "L9": "9.0",
      "L9_5": "9.5",
    };

    // Form State
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedLength, setSelectedLength] = useState(null); // Selected length state

    const fetchProducts = async () => {
        try {
            const response = await inventoryApi.getProducts();
            setProducts(response.data);
        } catch (error) {
            console.error("Fetch Error:", error);
            setToast({ visible: true, message: "Connection Error", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCreateProduct = async () => {
        if (!name.trim()) {
            setToast({ visible: true, message: "Enter product name", type: "warning" });
            return;
        }
        if (!selectedLength) {
            setToast({ visible: true, message: "Select a length", type: "warning" });
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await inventoryApi.createProduct({
                name: name.trim(),
                description: description.trim(),
                length: selectedLength.value, // Passing the chosen length to backend
            });

            if (response.status === 200 || response.status === 201) {
                setToast({ visible: true, message: "Product Type Added", type: "success" });
                setName("");
                setDescription("");
                setSelectedLength(null);
                setModalVisible(false);
                fetchProducts();
            }
        } catch (error) {
            console.error("Create Error:", error);
            setToast({ visible: true, message: "Failed to create product", type: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Derived Metrics
    const totalUnits = products.reduce((acc, curr) => acc + (curr.stockQuantity || 0), 0);
    const lowStockCount = products.filter(p => (p.stockQuantity || 0) < 500).length;

    return (
        <View style={styles.container}>
            <CustomHeader title="Stock" />

            {/* ITEM SELECTOR MODAL */}
            <ItemSelector
                visible={showLengthModal}
                items={lengths}
                title="Select Length"
                onSelect={setSelectedLength}
                onClose={() => setShowLengthModal(false)}
                renderSub={(item) => "Standard factory size"}
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.titleSection}>
                    <Text style={styles.screenTitle}>Finished Goods</Text>
                </View>

                {/* Action Row */}
                <View style={styles.actionRow}>
                    <Button
                        label="Add Product"
                        variant="primary"
                        style={styles.longBtn}
                        onPress={() => setModalVisible(true)}
                    />
                    <TouchableOpacity style={styles.filterBtn}>
                        <Ionicons name="filter-outline" size={22} color={theme.colors.onSurfaceVariant} />
                    </TouchableOpacity>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <StatCard
                        label="Total Stock"
                        value={`${totalUnits.toLocaleString()} Units`}
                        subtext={`Across ${products.length} categories`}
                        icon="cube"
                        type="primary"
                        style={styles.fullWidthCard}
                    />

                    <View style={styles.subStatsRow}>
                        <StatCard
                            label="Critical Low"
                            value={`${lowStockCount} Items`}
                            subtext="Needs Production"
                            icon="alert-circle"
                            type="error"
                            style={styles.halfWidthCard}
                        />
                        <StatCard
                            label="Factory Capacity"
                            value="94%"
                            subtext="Efficiency"
                            type="tertiary"
                            style={styles.halfWidthCard}
                        />
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Product Catalog</Text>

                {loading ? (
                    <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
                ) : (
                    products.map((item) => (
                        <FinishedGoodCard
                            key={item.id}
                            name={`${item.name} (${LENGTH_LABELS[item.length] || item.length}mm)`}
                            sku={`Tack-${item.name.replace(/\s+/g, '-')}`}
                            qty={(item.stockQuantity || 0).toLocaleString()}
                            unit="sticks"
                            status={item.stockQuantity === 0 ? "Out of Stock" : item.stockQuantity < 500 ? "Low Stock" : "Stable"}
                            image={require("../assets/images/GlueStick.jpg")}
                            lastUpdate="Live from DB"
                        />
                    ))
                )}

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* CREATE PRODUCT MODAL */}
            <BaseModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                title="New Product Type"
                subtitle="Add a new glue stick variant to your master catalog."
                actions={
                    <>
                        <Button label="Cancel" variant="text" onPress={() => setModalVisible(false)} />
                        <View style={{ flex: 1 }}>
                            <Button label="Create" variant="primary" loading={isSubmitting} onPress={handleCreateProduct} />
                        </View>
                    </>
                }
            >
                <Input
                    label="Product Name / Size"
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. 7mm Clear Sticks"
                />

                {/* Added PickerField here */}
                <PickerField
                    label="Stick Length"
                    value={selectedLength?.name}
                    placeholder="Select Length"
                    onPress={() => setShowLengthModal(true)}
                    //helperText={selectedLength ? `Selected: ${selectedLength.name}` : "Used for packaging specs"}
                />

                <Input
                    label="Description"
                    value={description}
                    onChangeText={setDescription}
                    placeholder="e.g. Industrial grade adhesive"
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollContent: { paddingHorizontal: 24, paddingTop: 10 },
    titleSection: { marginBottom: 24 },
    screenTitle: { fontSize: 32, fontWeight: '700', color: theme.colors.onSurface },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.onSurface, marginBottom: 16 },

    actionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
    longBtn: { flex: 1, height: 56 },
    filterBtn: {
        width: 56, height: 56, backgroundColor: theme.colors.surfaceContainerHigh,
        borderRadius: 12, justifyContent: 'center', alignItems: 'center',
        borderWidth: 1, borderColor: theme.colors.outlineVariant
    },

    statsGrid: { marginBottom: 32, gap: 16 },
    fullWidthCard: { width: '100%' },
    subStatsRow: { flexDirection: 'row', gap: 16 },
    halfWidthCard: { flex: 1, minHeight: 140 }
});