import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, RefreshControl, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { inventoryApi } from "../api/inventoryApi";
import { CustomHeader } from "../components/CustomHeader";
import { BottomNavBar } from "../components/BottomNavBar";
import { Button } from "../components/Button";
import { Toast } from "../components/Toast";
import { theme } from "../constants/theme";

export default function ProductsScreen() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

    const fetchProducts = async () => {
        try {
            const response = await inventoryApi.getProducts();
            setProducts(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleAddProduct = async () => {
        if (!name.trim()) {
            setToast({ visible: true, message: "Product name required", type: "warning" });
            return;
        }

        try {
            const response = await inventoryApi.addProduct({ name, description, stockQuantity: 0 });
            if (response.status === 200 || response.status === 201) {
                setToast({ visible: true, message: "Product Created!", type: "success" });
                setName(""); setDescription("");
                fetchProducts();
            }
        } catch (error) {
            setToast({ visible: true, message: "Save failed", type: "error" });
        }
    };

    return (
        <View style={styles.container}>
            <CustomHeader />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.titleSection}>
                    <Text style={styles.screenTitle}>Finished Goods</Text>
                    <Text style={styles.subtitle}>Define the product catalog for your factory.</Text>
                </View>

                {/* Create Product Form */}
                <View style={styles.formCard}>
                    <Text style={styles.inputLabel}>PRODUCT SIZE / NAME</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="e.g. 7mm Clear Stick"
                        placeholderTextColor={theme.colors.outline}
                    />
                    <Text style={styles.inputLabel}>DESCRIPTION</Text>
                    <TextInput
                        style={styles.input}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="e.g. Standard hobby grade"
                        placeholderTextColor={theme.colors.outline}
                    />
                    <Button label="Create Product" variant="primary" onPress={handleAddProduct} />
                </View>

                {/* Product List */}
                <Text style={styles.sectionTitle}>Catalog & Stock</Text>
                {loading ? <ActivityIndicator color={theme.colors.primary} /> : (
                    products.map(item => (
                        <View key={item.id} style={styles.productCard}>
                            <View>
                                <Text style={styles.prodName}>{item.name}</Text>
                                <Text style={styles.prodDesc}>{item.description}</Text>
                            </View>
                            <View style={styles.stockBadge}>
                                <Text style={styles.stockQty}>{item.stockQuantity}</Text>
                                <Text style={styles.stockUnit}>STICKS</Text>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            {toast.visible && <Toast message={toast.message} type={toast.type} onHide={() => setToast({ ...toast, visible: false })} />}
            <BottomNavBar activeRoute="Products" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollContent: { padding: 24 },
    titleSection: { marginBottom: 24 },
    screenTitle: { fontSize: 28, fontWeight: '700', color: theme.colors.onSurface },
    subtitle: { fontSize: 14, color: theme.colors.onSurfaceVariant, marginTop: 4 },
    formCard: { backgroundColor: theme.colors.surfaceContainerLowest, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: theme.colors.outlineVariant, marginBottom: 32 },
    inputLabel: { fontSize: 11, fontWeight: '800', color: theme.colors.outline, marginBottom: 8, letterSpacing: 1 },
    input: { backgroundColor: theme.colors.surfaceContainerLow, borderRadius: 8, padding: 12, marginBottom: 16, color: theme.colors.onSurface },
    sectionTitle: { fontSize: 20, fontWeight: '700', color: theme.colors.onSurface, marginBottom: 16 },
    productCard: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: theme.colors.surfaceContainerLowest, padding: 16, borderRadius: 12,
        marginBottom: 12, borderWidth: 1, borderColor: theme.colors.outlineVariant
    },
    prodName: { fontSize: 18, fontWeight: '700', color: theme.colors.onSurface },
    prodDesc: { fontSize: 13, color: theme.colors.onSurfaceVariant },
    stockBadge: { alignItems: 'center', backgroundColor: theme.colors.primaryContainer, padding: 8, borderRadius: 8, minWidth: 60 },
    stockQty: { fontSize: 18, fontWeight: '800', color: theme.colors.onPrimaryContainer },
    stockUnit: { fontSize: 10, fontWeight: '700', color: theme.colors.onPrimaryContainer }
});