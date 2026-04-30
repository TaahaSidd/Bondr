import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    FlatList,
    Pressable,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";

export const ItemSelector = ({
    visible,
    onClose,
    onSelect,
    items,
    title,
    renderSub
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                {/* Pressable View prevents the sheet itself from closing when tapped */}
                <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                        <TouchableOpacity onPress={onClose} hitSlop={15}>
                            <Ionicons name="close-circle" size={24} color={theme.colors.outline} />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={items}
                        // Fallback to name or index if ID is missing to prevent demo crashes
                        keyExtractor={(item, index) => String(item.id || item.name || index)}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.itemRow}
                                activeOpacity={0.6}
                                onPress={() => {
                                    onSelect(item);
                                    onClose();
                                }}
                            >
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                    {renderSub && (
                                        <Text style={styles.itemSub}>{renderSub(item)}</Text>
                                    )}
                                </View>
                                <Ionicons name="chevron-forward" size={16} color={theme.colors.outlineVariant} />
                            </TouchableOpacity>
                        )}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        ListEmptyComponent={() => (
                            <Text style={styles.emptyText}>No items available</Text>
                        )}
                    />
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)", // Darker overlay for better focus
        justifyContent: "flex-end",
    },
    sheet: {
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: "70%", // Slightly taller for easier browsing
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    title: {
        fontSize: 12,
        fontWeight: "900",
        color: theme.colors.primary,
        letterSpacing: 1.2,
    },
    listContent: {
        paddingHorizontal: 24,
        paddingTop: 8,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: "600",
        color: theme.colors.onSurface,
    },
    itemSub: {
        fontSize: 13,
        color: theme.colors.onSurfaceVariant,
        marginTop: 4,
    },
    separator: {
        height: 1,
        backgroundColor: theme.colors.border,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        color: theme.colors.outline,
        fontSize: 14,
    }
});