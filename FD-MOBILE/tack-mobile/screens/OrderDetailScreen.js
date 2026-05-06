import React from "react";
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../context/ThemeContext"; // Added Theme Hook
import { CustomHeader } from "../components/CustomHeader";
import { Button } from "../components/Button";
import { OrderCard } from "../components/OrderCard";

export default function OrderDetailScreen({ route, navigation }) {
    const { theme } = useTheme();           // Live theme
    const s = makeStyles(theme);            // Dynamic styles
    const { order } = route.params;

    // Derived status colors using the live theme
    const getStatusColors = (status) => {
        switch (status?.toUpperCase()) {
            case "COMPLETED":
                return { bg: theme.colors.tertiaryFixed, text: theme.colors.onTertiaryFixedVariant };
            case "CANCELLED":
                return { bg: theme.colors.errorContainer, text: theme.colors.onErrorContainer };
            default:
                return { bg: theme.colors.primaryFixed, text: theme.colors.onPrimaryFixedVariant };
        }
    };

    const { bg, text } = getStatusColors(order.status);

    const totalValue = order.orderItems?.reduce(
        (sum, i) => sum + (parseFloat(i.pricePerUnit ?? i.price ?? 0) * (i.quantity ?? 0)), 0
    ) ?? 0;

    return (
        <View style={s.container}>
            <CustomHeader showBack />

            <ScrollView
                contentContainerStyle={s.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={s.screenTitle}>Order Details</Text>

                {/* ── Customer card ── */}
                <View style={s.card}>
                    <View style={s.customerRow}>
                        <View style={s.avatar}>
                            <Text style={s.avatarText}>
                                {order.customerName?.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={s.customerName}>{order.customerName}</Text>
                            <Text style={s.orderDate}>{order.orderDate}</Text>
                        </View>
                        <View style={[s.badge, { backgroundColor: bg }]}>
                            <Text style={[s.badgeText, { color: text }]}>
                                {(order.status || "PENDING").toUpperCase()}
                            </Text>
                        </View>
                    </View>

                    <View style={s.divider} />

                    <View style={s.metaRow}>
                        <View>
                            <Text style={s.metaLabel}>Order ID</Text>
                            <Text style={s.metaValue}>#{order.id}</Text>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                            <Text style={s.metaLabel}>Total Value</Text>
                            <Text style={s.metaValue}>
                                ₹{totalValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* ── Items card ── */}
                <Text style={s.sectionTitle}>Items Ordered</Text>
                <View style={s.card}>
                    {order.orderItems?.length > 0 ? (
                        order.orderItems.map((item, index) => (
                            <OrderCard
                                key={index}
                                variant="line-item"
                                item={item}
                                isLast={index === order.orderItems.length - 1}
                            />
                        ))
                    ) : (
                        <View style={s.emptyItems}>
                            <Ionicons name="receipt-outline" size={36} color={theme.colors.outlineVariant} />
                            <Text style={s.emptyText}>No item breakdown available</Text>
                        </View>
                    )}
                </View>

                {/* ── Action ── */}
                {/* <Button
                    label="Update Order Status"
                    variant="inverted"
                    icon="create-outline"
                    onPress={() => navigation.navigate("EditOrder", { order })}
                /> */}

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const makeStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 40
    },
    screenTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: theme.colors.onSurface,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: theme.colors.onSurface,
        marginBottom: 10,
        marginTop: 4,
    },
    card: {
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
        marginBottom: 24,
    },
    customerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: theme.colors.primaryContainer,
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: {
        fontSize: 18,
        fontWeight: "700",
        color: theme.colors.primary
    },
    customerName: {
        fontSize: 15,
        fontWeight: "700",
        color: theme.colors.onSurface
    },
    orderDate: {
        fontSize: 12,
        color: theme.colors.outline,
        marginTop: 2
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6
    },
    badgeText: {
        fontSize: 10,
        fontWeight: "700"
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.outlineVariant,
        marginVertical: 14,
    },
    metaRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end"
    },
    metaLabel: {
        fontSize: 11,
        fontWeight: "600",
        color: theme.colors.outline,
        marginBottom: 4
    },
    metaValue: {
        fontSize: 16,
        fontWeight: "700",
        color: theme.colors.onSurface
    },
    emptyItems: {
        alignItems: "center",
        paddingVertical: 32
    },
    emptyText: {
        color: theme.colors.outline,
        marginTop: 10,
        fontSize: 14
    },
});