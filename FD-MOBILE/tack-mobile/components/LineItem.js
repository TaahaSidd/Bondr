import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";

// Props:
//   selectedProduct  — product object { id, name, stockQuantity } or null
//   qty              — string (controlled)
//   price            — string (controlled)
//   onPickProduct    — () => void  → opens the picker modal in parent
//   onQtyChange      — (text) => void
//   onPriceChange    — (text) => void
//   onRemove         — () => void

export const LineItem = ({
    selectedProduct,
    qty,
    price,
    onPickProduct,
    onQtyChange,
    onPriceChange,
    onRemove,
}) => {
    return (
        <View style={styles.container}>
            {/* Product picker row */}
            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>Product</Text>
                    <TouchableOpacity style={styles.pickerBox} onPress={onPickProduct}>
                        <Text
                            style={[styles.pickerText, !selectedProduct && styles.placeholder]}
                            numberOfLines={1}
                        >
                            {selectedProduct ? selectedProduct.name : "Tap to select…"}
                        </Text>
                        <Ionicons name="chevron-down" size={16} color={theme.colors.outline} />
                    </TouchableOpacity>
                    {selectedProduct && (
                        <Text style={styles.stockHint}>
                            {selectedProduct.stockQuantity} units in stock
                        </Text>
                    )}
                </View>

                <TouchableOpacity onPress={onRemove} style={styles.deleteBtn}>
                    <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
                </TouchableOpacity>
            </View>

            {/* Qty + Price row */}
            <View style={[styles.row, { marginTop: 10 }]}>
                <View style={styles.halfLeft}>
                    <Text style={styles.inputLabel}>Qty</Text>
                    <TextInput
                        style={styles.input}
                        value={qty}
                        onChangeText={onQtyChange}
                        placeholder="0"
                        placeholderTextColor={theme.colors.outline}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.halfRight}>
                    <Text style={styles.inputLabel}>Price / Unit (₹)</Text>
                    <TextInput
                        style={styles.input}
                        value={price}
                        onChangeText={onPriceChange}
                        placeholder="0.00"
                        placeholderTextColor={theme.colors.outline}
                        keyboardType="numeric"
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.surfaceContainerLow,
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
    },
    row: { flexDirection: "row", alignItems: "flex-start" },
    halfLeft: { flex: 1, marginRight: 8 },
    halfRight: { flex: 1, marginLeft: 8 },

    inputLabel: {
        fontSize: 11, fontWeight: "800",
        color: theme.colors.outline,
        letterSpacing: 1, marginBottom: 6,
    },
    pickerBox: {
        height: 48,
        backgroundColor: "white",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    pickerText: { fontSize: 15, color: theme.colors.onSurface, flex: 1 },
    placeholder: { color: theme.colors.outline },
    stockHint: { fontSize: 11, color: theme.colors.outline, marginTop: 4 },

    input: {
        height: 48,
        backgroundColor: "white",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
        paddingHorizontal: 12,
        fontSize: 15,
        color: theme.colors.onSurface,
    },
    deleteBtn: {
        marginLeft: 10,
        marginTop: 22,   // aligns with picker box vertically
        height: 48,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 4,
    },
});