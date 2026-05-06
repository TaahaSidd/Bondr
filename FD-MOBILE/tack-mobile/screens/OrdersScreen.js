import React, { useState, useEffect, useCallback } from "react";
import {
    View, Text, StyleSheet, ScrollView, TextInput,
    TouchableOpacity, ActivityIndicator, SafeAreaView, Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { useTheme } from "../context/ThemeContext"; // ← Added Theme Hook
import { inventoryApi } from "../api/inventoryApi";

import { BottomNavBar } from "../components/BottomNavBar";
import { Button } from "../components/Button";
import { LineItem } from "../components/LineItem";
import { ItemSelector } from "../components/ItemSelector";
import { PickerField } from "../components/PickerField";
import { Toast } from "../components/Toast";
import { OrderList } from "../components/OrderList";

export default function OrdersScreen({ navigation }) {
    const { theme } = useTheme();           // ← Live theme
    const s = makeStyles(theme);            // ← Dynamic styles

    const [customerName, setCustomerName] = useState("");
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [orderItems, setOrderItems] = useState([
        { id: Date.now(), selectedProduct: null, quantity: "1", price: "" }
    ]);

    const [products, setProducts] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [loadingRecent, setLoadingRecent] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [activeItemIndex, setActiveItemIndex] = useState(null);
    const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

    const showToast = (msg, type = "success") => setToast({ visible: true, message: msg, type });
    const formatDate = (d) => d.toISOString().split("T")[0];

    const onDateChange = (event, selected) => {
        if (Platform.OS === "android") setShowDatePicker(false);
        if (selected) setDate(selected);
    };

    const loadProducts = useCallback(async () => {
        try {
            const r = await inventoryApi.getProducts();
            setProducts(r.data);
        } catch {
            showToast("Could not load products.", "error");
        }
    }, []);

    const fetchRecentOrders = useCallback(async () => {
        setLoadingRecent(true);
        try {
            const r = await inventoryApi.getOrders();
            setRecentOrders([...r.data].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)).slice(0, 3));
        } catch {
            showToast("Could not load recent orders.", "error");
        } finally {
            setLoadingRecent(false);
        }
    }, []);

    useEffect(() => { loadProducts(); }, [loadProducts]);
    useFocusEffect(useCallback(() => { fetchRecentOrders(); }, [fetchRecentOrders]));

    const addRow = () => setOrderItems(p => [...p, { id: Date.now(), selectedProduct: null, quantity: "1", price: "" }]);
    const removeItem = (id) => {
        if (orderItems.length > 1) setOrderItems(p => p.filter(i => i.id !== id));
        else showToast("Order needs at least one item.", "warning");
    };
    const updateItem = (index, field, value) =>
        setOrderItems(p => { const n = [...p]; n[index] = { ...n[index], [field]: value }; return n; });

    const handleCreateOrder = async () => {
        if (!customerName.trim()) { showToast("Enter a customer name.", "warning"); return; }
        const valid = orderItems.filter(i => i.selectedProduct);
        if (!valid.length) { showToast("Add at least one product.", "warning"); return; }
        setSubmitting(true);
        try {
            await inventoryApi.createOrder({
                customerName: customerName.trim(),
                orderDate: formatDate(date),
                orderItems: valid.map(i => ({
                    productId: i.selectedProduct.id,
                    quantity: parseInt(i.quantity) || 0,
                    price: parseFloat(i.price) || 0,
                })),
            });
            showToast("Order created!");
            setCustomerName(""); setDate(new Date());
            setOrderItems([{ id: Date.now(), selectedProduct: null, quantity: "1", price: "" }]);
            fetchRecentOrders();
        } catch (e) {
            showToast(e.response?.data?.message ?? "Failed to create order.", "error");
        } finally { setSubmitting(false); }
    };

    const totalUnits = orderItems.reduce((s, i) => s + (parseInt(i.quantity) || 0), 0);
    const totalValue = orderItems.reduce((s, i) => s + (parseFloat(i.price) || 0) * (parseInt(i.quantity) || 0), 0);

    return (
        <SafeAreaView style={s.container}>
            {/* CustomHeader removed as requested */}

            <ItemSelector
                visible={showProductModal}
                title="Select Product"
                items={products}
                onClose={() => setShowProductModal(false)}
                onSelect={(prod) => {
                    updateItem(activeItemIndex, "selectedProduct", prod);
                    if (prod.price) updateItem(activeItemIndex, "price", String(prod.price));
                }}
                renderSub={item => `In Stock: ${item.stockQuantity}`}
            />

            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={onDateChange}
                    maximumDate={new Date()}
                />
            )}

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={s.scrollContent}
            >
                <Text style={s.screenTitle}>New Order</Text>

                <Text style={s.sectionTitle}>Customer</Text>
                <View style={s.card}>
                    <View style={s.row}>
                        <View style={s.halfLeft}>
                            <Text style={s.fieldLabel}>Name</Text>
                            <TextInput
                                style={s.input}
                                value={customerName}
                                onChangeText={setCustomerName}
                                placeholder="Foxglue Dist."
                                placeholderTextColor={theme.colors.outline}
                            />
                        </View>
                        <View style={s.halfRight}>
                            <PickerField
                                label="Date"
                                value={formatDate(date)}
                                placeholder="Select date"
                                onPress={() => setShowDatePicker(true)}
                            />
                        </View>
                    </View>
                </View>

                <Text style={s.sectionTitle}>Order Items</Text>
                <View style={s.card}>
                    <View style={s.itemsInner}>
                        {orderItems.map((item, index) => (
                            <LineItem
                                key={item.id}
                                selectedProduct={item.selectedProduct}
                                qty={item.quantity}
                                price={item.price}
                                onQtyChange={val => updateItem(index, "quantity", val)}
                                onPriceChange={val => updateItem(index, "price", val)}
                                onPickProduct={() => { setActiveItemIndex(index); setShowProductModal(true); }}
                                onRemove={() => removeItem(item.id)}
                            />
                        ))}

                        <TouchableOpacity style={s.addItemRow} onPress={addRow}>
                            <Ionicons name="add-circle-outline" size={18} color={theme.colors.primary} />
                            <Text style={s.addItemText}>Add another item</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={s.divider} />
                    <View style={s.summaryRow}>
                        <View style={s.summaryItem}>
                            <Text style={s.summaryLabel}>Units</Text>
                            <Text style={s.summaryValue}>{totalUnits.toLocaleString()}</Text>
                        </View>
                        <View style={s.summaryDivider} />
                        <View style={s.summaryItem}>
                            <Text style={s.summaryLabel}>Value</Text>
                            <Text style={s.summaryValue}>
                                ₹{totalValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                            </Text>
                        </View>
                    </View>

                    <View style={s.submitRow}>
                        <Button
                            label="Create Order"
                            variant="primary"
                            loading={submitting}
                            disabled={submitting}
                            onPress={handleCreateOrder}
                            style={{ marginVertical: 0 }}
                        />
                    </View>
                </View>

                <Text style={s.sectionTitle}>Recent Orders</Text>
                <View style={s.card}>
                    {loadingRecent ? (
                        <ActivityIndicator color={theme.colors.primary} style={{ marginVertical: 20 }} />
                    ) : (
                        <OrderList
                            orders={recentOrders}
                            onItemPress={order => navigation.navigate("OrderDetails", { order })}
                        />
                    )}
                    <TouchableOpacity
                        style={s.viewAllRow}
                        onPress={() => navigation.navigate("AllOrders")}
                    >
                        <Text style={s.viewAllText}>View all orders</Text>
                        <Ionicons name="arrow-forward" size={14} color={theme.colors.primary} />
                    </TouchableOpacity>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {toast.visible && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onHide={() => setToast({ ...toast, visible: false })}
                />
            )}

            <BottomNavBar activeRoute="Orders" />
        </SafeAreaView>
    );
}

const makeStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        marginTop: 24 // ← Consistent with StockScreen
    },
    scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },

    screenTitle: {
        fontSize: 22, fontWeight: "700",
        color: theme.colors.onSurface, marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16, fontWeight: "700",
        color: theme.colors.onSurface, marginBottom: 10,
    },

    card: {
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
        marginBottom: 24,
    },

    row: { flexDirection: "row", padding: 16, paddingBottom: 0 },
    halfLeft: { flex: 1, marginRight: 8 },
    halfRight: { flex: 1, marginLeft: 8 },

    fieldLabel: {
        fontSize: 12, fontWeight: "600",
        color: theme.colors.outline, marginBottom: 6,
    },
    input: {
        height: 52,
        backgroundColor: theme.colors.surfaceContainerLow,
        borderRadius: 8, borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
        paddingHorizontal: 12,
        fontSize: 15, color: theme.colors.onSurface,
        marginBottom: 16,
    },

    itemsInner: { padding: 16, paddingBottom: 0 },

    addItemRow: {
        flexDirection: "row", alignItems: "center",
        justifyContent: "center", gap: 8,
        paddingVertical: 12,
        borderRadius: 8, borderWidth: 1.5,
        borderStyle: "solid",
        borderColor: theme.colors.outlineVariant,
        marginBottom: 4,
    },
    addItemText: {
        fontSize: 13, fontWeight: "600", color: theme.colors.primary,
    },

    divider: {
        height: 1,
        backgroundColor: theme.colors.outlineVariant,
        marginTop: 16,
    },

    summaryRow: {
        flexDirection: "row",
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    summaryItem: { alignItems: "center", paddingHorizontal: 12 },
    summaryLabel: { fontSize: 11, fontWeight: "600", color: theme.colors.outline },
    summaryValue: { fontSize: 17, fontWeight: "700", color: theme.colors.onSurface, marginTop: 2 },
    summaryDivider: { width: 1, height: 28, backgroundColor: theme.colors.outlineVariant, alignSelf: "center" },

    submitRow: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },

    viewAllRow: {
        flexDirection: "row", alignItems: "center",
        justifyContent: "center", gap: 6,
        paddingVertical: 14,
        borderTopWidth: 1, borderTopColor: theme.colors.outlineVariant,
    },
    viewAllText: { fontSize: 13, fontWeight: "600", color: theme.colors.primary },
});