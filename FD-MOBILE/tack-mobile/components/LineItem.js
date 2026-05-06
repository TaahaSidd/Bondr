import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export const LineItem = ({
    selectedProduct,
    qty,
    price,
    onPickProduct,
    onQtyChange,
    onPriceChange,
    onRemove,
}) => {
    const { theme } = useTheme();
    const s = makeStyles(theme);

    return (
        <View style={s.container}>
            {/* Product picker + delete */}
            <View style={s.row}>
                <TouchableOpacity style={s.pickerBox} onPress={onPickProduct}>
                    <Text
                        style={[s.pickerText, !selectedProduct && s.placeholder]}
                        numberOfLines={1}
                    >
                        {selectedProduct ? selectedProduct.name : "Tap to select product…"}
                    </Text>
                    <Ionicons name="chevron-down" size={15} color={theme.colors.outline} />
                </TouchableOpacity>

                <TouchableOpacity onPress={onRemove} style={s.deleteBtn}>
                    <Ionicons name="trash-outline" size={18} color={theme.colors.error} />
                </TouchableOpacity>
            </View>

            {selectedProduct && (
                <Text style={s.stockHint}>{selectedProduct.stockQuantity} units in stock</Text>
            )}

            {/* Qty + Price */}
            <View style={[s.row, { marginTop: 10 }]}>
                <View style={s.halfLeft}>
                    <Text style={s.fieldLabel}>Qty</Text>
                    <TextInput
                        style={s.input}
                        value={qty}
                        onChangeText={onQtyChange}
                        placeholder="0"
                        placeholderTextColor={theme.colors.outline}
                        keyboardType="numeric"
                    />
                </View>
                <View style={s.halfRight}>
                    <Text style={s.fieldLabel}>Price / unit (₹)</Text>
                    <TextInput
                        style={s.input}
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

const makeStyles = (theme) => StyleSheet.create({
    container: {
        backgroundColor: theme.colors.surfaceContainerLow,
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
    },
    row: { flexDirection: "row", alignItems: "center" },
    halfLeft: { flex: 1, marginRight: 8 },
    halfRight: { flex: 1, marginLeft: 8 },

    pickerBox: {
        flex: 1,
        height: 46,
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    pickerText: {
        fontSize: 14,
        color: theme.colors.onSurface,
        flex: 1
    },
    placeholder: {
        color: theme.colors.outline
    },
    stockHint: {
        fontSize: 11,
        color: theme.colors.outline,
        marginTop: 5,
        marginLeft: 2
    },

    deleteBtn: {
        marginLeft: 10,
        width: 36,
        height: 46,
        justifyContent: "center",
        alignItems: "center",
    },

    fieldLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: theme.colors.outline,
        marginBottom: 6,
    },
    input: {
        height: 46,
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
        paddingHorizontal: 12,
        fontSize: 14,
        color: theme.colors.onSurface,
    },
});