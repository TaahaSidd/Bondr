import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { CustomHeader } from "../components/CustomHeader";
import { BottomNavBar } from "../components/BottomNavBar";
import { Button } from "../components/Button";
import { LineItem } from "../components/LineItem";
import { ItemSelector } from "../components/ItemSelector";
import { Toast } from "../components/Toast"; // Import your Toast component
import { inventoryApi } from "../api/inventoryApi";
import { theme } from "../constants/theme";

export default function OrdersScreen() {
    const [customerName, setCustomerName] = useState("");
    const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
    const [orderItems, setOrderItems] = useState([
        { id: Date.now(), selectedProduct: null, quantity: "1", price: "" }
    ]);

    // Toast State
    const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

    const [products, setProducts] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [activeItemIndex, setActiveItemIndex] = useState(null);

    // Helper to show toast
    const showToast = (message, type = "success") => {
        setToast({ visible: true, message, type });
    };

    const loadProducts = useCallback(async () => {
        try {
            const res = await inventoryApi.getProducts();
            setProducts(res.data);
        } catch (err) {
            console.error("Failed to load products", err);
        }
    }, []);

    useEffect(() => { loadProducts(); }, [loadProducts]);

    const handleCreateOrder = async () => {
        if (!customerName.trim()) {
            showToast("Please enter a customer name", "warning");
            return;
        }

        const validItems = orderItems.filter(item => item.selectedProduct !== null);
        if (validItems.length === 0) {
            showToast("Please add at least one product", "warning");
            return;
        }

        const payload = {
            customerName: customerName,
            orderDate: orderDate,
            orderItems: validItems.map(item => ({
                productId: item.selectedProduct.id,
                quantity: parseInt(item.quantity) || 0
            }))
        };

        setSubmitting(true);
        try {
            await inventoryApi.createOrder(payload);
            showToast("Order created successfully!");

            // Reset Form
            setCustomerName("");
            setOrderItems([{ id: Date.now(), selectedProduct: null, quantity: "1", price: "" }]);
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to create order";
            showToast(msg, "error");
        } finally {
            setSubmitting(false);
        }
    };

    const addRow = () => {
        setOrderItems([...orderItems, { id: Date.now(), selectedProduct: null, quantity: "1", price: "" }]);
    };

    const removeItem = (id) => {
        if (orderItems.length > 1) {
            setOrderItems(orderItems.filter(item => item.id !== id));
        }
    };

    const updateQty = (index, val) => {
        const newItems = [...orderItems];
        newItems[index].quantity = val;
        setOrderItems(newItems);
    };

    const updatePrice = (index, val) => {
        const newItems = [...orderItems];
        newItems[index].price = val;
        setOrderItems(newItems);
    };

    return (
        <View style={styles.container}>
            {/* Render Toast at the root of the screen */}
            {toast.visible && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onHide={() => setToast({ ...toast, visible: false })}
                />
            )}

            <CustomHeader title="Orders" subtitle="Sales & Dispatch" />

            <ItemSelector
                visible={showProductModal}
                title="Select Product"
                items={products}
                onClose={() => setShowProductModal(false)}
                onSelect={(prod) => {
                    const newItems = [...orderItems];
                    newItems[activeItemIndex].selectedProduct = prod;
                    if (prod.price) newItems[activeItemIndex].price = String(prod.price);
                    setOrderItems(newItems);
                }}
                renderSub={(item) => `In Stock: ${item.stockQuantity}`}
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.formSection}>
                    <Text style={styles.label}>Customer Name</Text>
                    <TextInput
                        style={styles.textInput}
                        value={customerName}
                        onChangeText={setCustomerName}
                        placeholder="e.g. Acme Industrial"
                        placeholderTextColor={theme.colors.outline}
                    />

                    <View style={{ marginTop: 20 }}>
                        <Text style={styles.label}>Order Date</Text>
                        <TouchableOpacity style={styles.datePicker}>
                            <Text style={styles.dateText}>{orderDate}</Text>
                            <Ionicons name="calendar-outline" size={18} color={theme.colors.outline} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.itemsHeader}>
                    <Text style={styles.sectionTitle}>Order Items</Text>
                    <TouchableOpacity style={styles.scanBtn}>
                        <Ionicons name="barcode-outline" size={18} color={theme.colors.primary} />
                        <Text style={styles.scanText}>Scan</Text>
                    </TouchableOpacity>
                </View>

                {orderItems.map((item, index) => (
                    <LineItem
                        key={item.id}
                        selectedProduct={item.selectedProduct}
                        qty={item.quantity}
                        price={item.price}
                        onQtyChange={(val) => updateQty(index, val)}
                        onPriceChange={(val) => updatePrice(index, val)}
                        onPickProduct={() => {
                            setActiveItemIndex(index);
                            setShowProductModal(true);
                        }}
                        onRemove={() => removeItem(item.id)}
                    />
                ))}

                <Button
                    label="Add Item"
                    variant="text"
                    icon="add-circle-outline"
                    onPress={addRow}
                    style={{ marginTop: 12, alignSelf: 'flex-start' }}
                />

                <View style={styles.summaryRow}>
                    <View>
                        <Text style={styles.summaryLabel}>Total Items</Text>
                        <Text style={styles.summaryValue}>{orderItems.length}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Button
                            label="Create Order"
                            variant="primary"
                            icon="send-outline"
                            loading={submitting}
                            disabled={submitting}
                            onPress={handleCreateOrder}
                        />
                    </View>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            <BottomNavBar activeRoute="Orders" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollContent: { paddingHorizontal: 24, paddingTop: 12 },
    formSection: {
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
        marginBottom: 24
    },
    itemsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.onSurface },
    label: { fontSize: 11, fontWeight: '900', color: theme.colors.outline, marginBottom: 8, letterSpacing: 1 },
    textInput: { height: 52, backgroundColor: theme.colors.surfaceContainerLow, borderRadius: 8, paddingHorizontal: 16, fontSize: 15, color: theme.colors.onSurface, borderWidth: 1, borderColor: theme.colors.outlineVariant },
    datePicker: { height: 52, backgroundColor: theme.colors.surfaceContainerLow, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, borderWidth: 1, borderColor: theme.colors.outlineVariant },
    dateText: { color: theme.colors.onSurface, fontSize: 15, fontWeight: '500' },
    scanBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    scanText: { color: theme.colors.primary, fontWeight: '700', fontSize: 13 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 20, borderTopWidth: 1, borderTopColor: theme.colors.outlineVariant },
    summaryLabel: { fontSize: 11, color: theme.colors.outline, fontWeight: '700' },
    summaryValue: { fontSize: 22, fontWeight: '800', color: theme.colors.onSurface },
});