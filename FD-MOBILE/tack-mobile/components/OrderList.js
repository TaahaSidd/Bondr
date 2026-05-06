import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";

export const OrderList = ({
    orders = [],
    onItemPress,
    showHeader = true,
    emptyMessage = "No orders found."
}) => {
    const { theme } = useTheme();
    const s = makeStyles(theme);

    if (orders.length === 0) {
        return <Text style={s.emptyText}>{emptyMessage}</Text>;
    }

    return (
        <View style={s.listContainer}>
            {showHeader && (
                <View style={s.headerRow}>
                    <Text style={[s.tableHeader, { flex: 1 }]}>Customer</Text>
                    <Text style={[s.tableHeader, { textAlign: "right" }]}>Status</Text>
                </View>
            )}

            {orders.map((order, index) => {
                const isCompleted = order.status?.toLowerCase() === "completed";
                const isLast = index === orders.length - 1;

                return (
                    <TouchableOpacity
                        key={order.id}
                        style={[s.row, isLast && s.rowLast]}
                        onPress={() => onItemPress && onItemPress(order)}
                        disabled={!onItemPress}
                        activeOpacity={0.6}
                    >
                        <View style={{ flex: 1 }}>
                            <Text style={s.customerName} numberOfLines={1}>
                                {order.customerName}
                            </Text>
                            <Text style={s.dateText}>{order.orderDate}</Text>
                        </View>

                        <View style={[
                            s.statusBadge,
                            {
                                backgroundColor: isCompleted
                                    ? theme.colors.tertiaryFixed
                                    : theme.colors.primaryFixed
                            }
                        ]}>
                            <Text style={[
                                s.statusText,
                                {
                                    color: isCompleted
                                        ? theme.colors.onTertiaryFixedVariant
                                        : theme.colors.onPrimaryFixedVariant
                                }
                            ]}>
                                {(order.status || "Pending").toUpperCase()}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const makeStyles = (theme) => StyleSheet.create({
    listContainer: { width: "100%" },

    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.outlineVariant,
    },
    tableHeader: {
        fontSize: 11,
        fontWeight: "700",
        color: theme.colors.outline,
        letterSpacing: 0.5,
        paddingTop: 12,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.outlineVariant,
    },
    rowLast: {
        borderBottomWidth: 0,
    },

    customerName: {
        fontSize: 14,
        fontWeight: "600",
        color: theme.colors.onSurface,
    },
    dateText: {
        fontSize: 12,
        color: theme.colors.outline,
        marginTop: 2,
    },

    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        alignItems: "center",
        minWidth: 72,
    },
    statusText: {
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 0.3,
    },

    emptyText: {
        textAlign: "center",
        color: theme.colors.outline,
        paddingVertical: 24,
        fontSize: 14,
    },
});