import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";
import { CustomHeader } from "../components/CustomHeader";

const DUMMY_STAFF = [
    { id: '1', name: 'Taha Khalid Siddiqui', role: 'Lead Developer', status: 'Active', phone: '+91 98765 43210' },
    { id: '2', name: 'Rajesh Kumar', role: 'Production Manager', status: 'Active', phone: '+91 99887 76655' },
    { id: '3', name: 'Amit Singh', role: 'Machine Operator', status: 'On Leave', phone: '+91 88776 65544' },
    { id: '4', name: 'Suresh Chen', role: 'Inventory Clerk', status: 'Active', phone: '+91 77665 54433' },
];

const StaffCard = ({ item }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
        <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.role}>{item.role}</Text>
            <View style={styles.contactRow}>
                <Ionicons name="call-outline" size={12} color={theme.colors.outline} />
                <Text style={styles.phone}>{item.phone}</Text>
            </View>
        </View>
        <View style={[
            styles.statusBadge,
            { backgroundColor: item.status === 'Active' ? '#dcfce7' : '#fee2e2' }
        ]}>
            <Text style={[
                styles.statusText,
                { color: item.status === 'Active' ? '#16a34a' : '#ef4444' }
            ]}>
                {item.status}
            </Text>
        </View>
    </TouchableOpacity>
);

export default function StaffScreen() {
    return (
        <View style={styles.container}>
            <CustomHeader title="Staff Members" />

            <FlatList
                data={DUMMY_STAFF}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                ListHeaderComponent={() => (
                    <View style={styles.headerSection}>
                        <Text style={styles.screenTitle}>Factory Personnel</Text>
                        <TouchableOpacity style={styles.addBtn}>
                            <Ionicons name="person-add-outline" size={20} color="white" />
                            <Text style={styles.addBtnText}>Add Staff</Text>
                        </TouchableOpacity>
                    </View>
                )}
                renderItem={({ item }) => <StaffCard item={item} />}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    list: { padding: 24, paddingBottom: 100 },
    headerSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24
    },
    screenTitle: { fontSize: 24, fontWeight: '700', color: theme.colors.onSurface },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 8
    },
    addBtnText: { color: 'white', fontWeight: '600', fontSize: 14 },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        borderWidth: 1,
        borderColor: theme.colors.border
    },
    avatarText: { fontSize: 18, fontWeight: '700', color: theme.colors.primary },
    info: { flex: 1 },
    name: { fontSize: 16, fontWeight: '700', color: theme.colors.onSurface },
    role: { fontSize: 13, color: theme.colors.onSurfaceVariant, marginBottom: 4 },
    contactRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    phone: { fontSize: 12, color: theme.colors.outline },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8
    },
    statusText: { fontSize: 11, fontWeight: '700' }
});