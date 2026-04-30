// src/screens/CreateOrderScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export function CreateOrderScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Order</Text>
            <Text style={styles.description}>
                This screen will allow you to add products and quantities.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
    },
    description: {
        fontSize: 16,
        color: "#666",
        marginTop: 12,
    },
});