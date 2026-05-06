import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../context/ThemeContext"; // Added Theme Hook
import { inventoryApi } from "../api/inventoryApi";

import { InventoryCard } from "../components/InventoryCard";
import { CustomHeader } from "../components/CustomHeader";

export default function MaterialStockScreen() {
    const { theme } = useTheme();           // Live theme
    const s = makeStyles(theme);            // Dynamic styles

    const [materials, setMaterials] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await inventoryApi.getMaterials();
                setMaterials(res.data);
            } catch (e) {
                console.error("Failed to fetch materials:", e);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const filteredMaterials = materials.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={s.container}>
            <CustomHeader title="Warehouse Stock" showBack={true} />

            <View style={s.searchContainer}>
                <Ionicons name="search" size={20} color={theme.colors.outline} />
                <TextInput
                    style={s.searchInput}
                    placeholder="Search materials..."
                    placeholderTextColor={theme.colors.outline}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {loading ? (
                <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={filteredMaterials}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={s.listContent}
                    renderItem={({ item }) => (
                        <InventoryCard
                            name={item.name}
                            sku={item.supplier}
                            quantity={item.quantityKg}
                            unit="kg"
                            unitCost={item.costPerKg}
                            status={item.quantityKg < 15 ? "LOW STOCK" : "STABLE"}
                        // Add an onPress here later to see a history of this specific material
                        />
                    )}
                    ListEmptyComponent={<Text style={s.emptyText}>No matching materials found.</Text>}
                />
            )}
        </View>
    );
}

const makeStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 24,
        marginTop: 16,
        paddingHorizontal: 16,
        height: 50,
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: theme.colors.onSurface
    },
    listContent: {
        padding: 24
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        color: theme.colors.outline
    }
});