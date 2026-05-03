import React, { useState, useEffect, useCallback } from "react";
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    Modal, ActivityIndicator, ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";
import { CustomHeader } from "../components/CustomHeader";
import { BottomNavBar } from "../components/BottomNavBar";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Toast } from "../components/Toast";
import { staffApi } from "../api/staffApi"; // 🔧 see note at bottom

// ─── Enums (mirror your backend) ─────────────────────────────────────────────
const PAYMENT_TYPES = ["ADVANCE", "SALARY"];
const STAFF_STATUSES = ["P", "A"];

// ─── Tiny helpers ─────────────────────────────────────────────────────────────
const today = () => new Date().toISOString().split("T")[0];

const Avatar = ({ name, size = 44 }) => (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
        <Text style={styles.avatarText}>{name?.charAt(0).toUpperCase()}</Text>
    </View>
);

// ─── Tab Bar ──────────────────────────────────────────────────────────────────
const TABS = ["Staff", "Attendance", "Payments"];
const TabBar = ({ active, onChange }) => (
    <View style={styles.tabBar}>
        {TABS.map(t => (
            <TouchableOpacity
                key={t}
                style={[styles.tab, active === t && styles.tabActive]}
                onPress={() => onChange(t)}
            >
                <Text style={[styles.tabText, active === t && styles.tabTextActive]}>{t}</Text>
            </TouchableOpacity>
        ))}
    </View>
);

// ─── Pill selector (for enums) ────────────────────────────────────────────────
const PillSelector = ({ options, selected, onSelect, colors }) => (
    <View style={styles.pillRow}>
        {options.map(opt => {
            const isSelected = selected === opt;
            const color = colors?.[opt] ?? theme.colors.primary;
            return (
                <TouchableOpacity
                    key={opt}
                    style={[styles.pill, isSelected && { backgroundColor: color, borderColor: color }]}
                    onPress={() => onSelect(opt)}
                >
                    <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
                        {opt}
                    </Text>
                </TouchableOpacity>
            );
        })}
    </View>
);

// ─── Staff Tab ────────────────────────────────────────────────────────────────
const StaffTab = ({ showToast }) => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModal] = useState(false);
    const [name, setName] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await staffApi.getAllStaff();
            setStaff(res.data);
        } catch {
            showToast("Failed to load staff.", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleAdd = async () => {
        if (!name.trim()) { showToast("Enter a name.", "warning"); return; }
        setSubmitting(true);
        try {
            await staffApi.addStaff({ name: name.trim() });
            showToast("Staff member added!", "success");
            setName(""); setModal(false);
            load();
        } catch (e) {
            showToast(e.response?.data?.message ?? "Failed to add staff.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.tabActionRow}>
                <Text style={styles.countLabel}>{staff.length} members</Text>
                <Button
                    label="Add Staff"
                    variant="primary"
                    icon="person-add-outline"
                    onPress={() => setModal(true)}
                    style={styles.smallBtn}
                />
            </View>

            {loading ? (
                <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 32 }} />
            ) : staff.length === 0 ? (
                <Text style={styles.emptyText}>No staff added yet.</Text>
            ) : (
                <FlatList
                    data={[...staff].reverse()}
                    keyExtractor={item => String(item.id)}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                        <View style={styles.staffCard}>
                            <Avatar name={item.name} />
                            <View style={{ flex: 1, marginLeft: 14 }}>
                                <Text style={styles.staffName}>{item.name}</Text>
                                <Text style={styles.staffSub}>ID #{item.id}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color={theme.colors.outline} />
                        </View>
                    )}
                    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                />
            )}

            {/* Add Staff Modal */}
            <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModal(false)}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModal(false)}>
                    <View style={styles.modalSheet}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>New Staff Member</Text>
                            <TouchableOpacity onPress={() => setModal(false)}>
                                <Ionicons name="close" size={22} color={theme.colors.outline} />
                            </TouchableOpacity>
                        </View>
                        <Input
                            label="Full Name"
                            value={name}
                            onChangeText={setName}
                            placeholder="e.g. Rajesh Kumar"
                        />
                        <Button
                            label="Add Member"
                            variant="primary"
                            loading={submitting}
                            disabled={submitting}
                            onPress={handleAdd}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

// ─── Attendance Tab ───────────────────────────────────────────────────────────
const AttendanceTab = ({ showToast }) => {
    const [staff, setStaff] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [status, setStatus] = useState("PRESENT");
    const [date, setDate] = useState(today());
    const [history, setHistory] = useState([]);
    const [loadingStaff, setLoadingStaff] = useState(true);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showStaffModal, setShowStaffModal] = useState(false);

    useEffect(() => {
        staffApi.getAllStaff()
            .then(r => setStaff(r.data))
            .catch(() => showToast("Could not load staff.", "error"))
            .finally(() => setLoadingStaff(false));
    }, []);

    const loadHistory = async (staffId) => {
        setLoadingHistory(true);
        try {
            const res = await staffApi.getAttendanceByStaff(staffId);
            setHistory([...res.data].reverse().slice(0, 7)); // last 7 records
        } catch {
            showToast("Could not load attendance history.", "error");
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleSelectStaff = (member) => {
        setSelectedStaff(member);
        setShowStaffModal(false);
        loadHistory(member.id);
    };

    const handleMark = async () => {
        if (!selectedStaff) { showToast("Select a staff member.", "warning"); return; }
        setSubmitting(true);
        try {
            await staffApi.markAttendance({
                staffId: selectedStaff.id,
                date,
                status,
            });
            showToast(`Attendance marked: ${status}`, "success");
            loadHistory(selectedStaff.id);
        } catch (e) {
            showToast(e.response?.data?.message ?? "Failed to mark attendance.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View>
            {/* Staff picker */}
            <Text style={styles.fieldLabel}>Staff Member</Text>
            <TouchableOpacity style={styles.pickerBox} onPress={() => setShowStaffModal(true)}>
                {selectedStaff
                    ? <View style={styles.pickerSelected}>
                        <Avatar name={selectedStaff.name} size={30} />
                        <Text style={styles.pickerSelectedText}>{selectedStaff.name}</Text>
                    </View>
                    : <Text style={styles.pickerPlaceholder}>Tap to select…</Text>
                }
                <Ionicons name="chevron-down" size={18} color={theme.colors.outline} />
            </TouchableOpacity>

            {/* Date + Status row */}
            <View style={styles.twoCol}>
                <View style={styles.halfLeft}>
                    <Input
                        label="Date"
                        value={date}
                        onChangeText={setDate}
                        placeholder="YYYY-MM-DD"
                        maxLength={10}
                    />
                </View>
                <View style={styles.halfRight}>
                    <Text style={styles.fieldLabel}>Status</Text>
                    <PillSelector
                        options={STAFF_STATUSES}
                        selected={status}
                        onSelect={setStatus}
                        colors={{ P: "#16a34a", A: "#ef4444" }}
                    />
                </View>
            </View>

            <Button
                label="Mark Attendance"
                variant="primary"
                icon="checkmark-circle-outline"
                onPress={handleMark}
                loading={submitting}
                disabled={submitting}
            />

            {/* History */}
            {selectedStaff && (
                <View style={styles.historyBox}>
                    <Text style={styles.historyTitle}>RECENT — {selectedStaff.name.toUpperCase()}</Text>
                    {loadingHistory
                        ? <ActivityIndicator color={theme.colors.primary} style={{ marginVertical: 12 }} />
                        : history.length === 0
                            ? <Text style={styles.emptyText}>No records yet.</Text>
                            : history.map(r => (
                                <View key={r.id} style={styles.historyRow}>
                                    <Text style={styles.historyDate}>{r.date}</Text>
                                    <View style={[
                                        styles.statusBadge,
                                        { backgroundColor: r.status === "PRESENT" ? "#dcfce7" : "#fee2e2" }
                                    ]}>
                                        <Text style={[
                                            styles.statusBadgeText,
                                            { color: r.status === "PRESENT" ? "#16a34a" : "#ef4444" }
                                        ]}>
                                            {r.status}
                                        </Text>
                                    </View>
                                </View>
                            ))
                    }
                </View>
            )}

            {/* Staff picker modal */}
            <Modal visible={showStaffModal} transparent animationType="slide" onRequestClose={() => setShowStaffModal(false)}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowStaffModal(false)}>
                    <View style={styles.modalSheet}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Staff</Text>
                            <TouchableOpacity onPress={() => setShowStaffModal(false)}>
                                <Ionicons name="close" size={22} color={theme.colors.outline} />
                            </TouchableOpacity>
                        </View>
                        {loadingStaff
                            ? <ActivityIndicator color={theme.colors.primary} />
                            : staff.map((m, i) => (
                                <TouchableOpacity
                                    key={m.id}
                                    style={[styles.modalItem, i < staff.length - 1 && styles.modalSeparator]}
                                    onPress={() => handleSelectStaff(m)}
                                >
                                    <Avatar name={m.name} size={34} />
                                    <Text style={[styles.modalItemText, { marginLeft: 12 }]}>{m.name}</Text>
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

// ─── Payments Tab ─────────────────────────────────────────────────────────────
const PaymentsTab = ({ showToast }) => {
    const [staff, setStaff] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [amount, setAmount] = useState("");
    const [type, setType] = useState("SALARY");
    const [date, setDate] = useState(today());
    const [history, setHistory] = useState([]);
    const [loadingStaff, setLoadingStaff] = useState(true);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showStaffModal, setShowStaffModal] = useState(false);

    useEffect(() => {
        staffApi.getAllStaff()
            .then(r => setStaff(r.data))
            .catch(() => showToast("Could not load staff.", "error"))
            .finally(() => setLoadingStaff(false));
    }, []);

    const loadHistory = async (staffId) => {
        setLoadingHistory(true);
        try {
            const res = await staffApi.getPaymentsByStaff(staffId);
            setHistory([...res.data].reverse().slice(0, 7));
        } catch {
            showToast("Could not load payment history.", "error");
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleSelectStaff = (member) => {
        setSelectedStaff(member);
        setShowStaffModal(false);
        loadHistory(member.id);
    };

    const handlePay = async () => {
        if (!selectedStaff) { showToast("Select a staff member.", "warning"); return; }
        if (!amount || parseFloat(amount) <= 0) { showToast("Enter a valid amount.", "warning"); return; }
        setSubmitting(true);
        try {
            await staffApi.makePayment({
                staffId: selectedStaff.id,
                amount: parseFloat(amount),
                type,
                date,
            });
            showToast("Payment recorded!", "success");
            setAmount("");
            loadHistory(selectedStaff.id);
        } catch (e) {
            showToast(e.response?.data?.message ?? "Failed to record payment.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const totalPaid = history.reduce((sum, p) => sum + parseFloat(p.amount ?? 0), 0);

    return (
        <View>
            {/* Staff picker */}
            <Text style={styles.fieldLabel}>STAFF MEMBER</Text>
            <TouchableOpacity style={styles.pickerBox} onPress={() => setShowStaffModal(true)}>
                {selectedStaff
                    ? <View style={styles.pickerSelected}>
                        <Avatar name={selectedStaff.name} size={30} />
                        <Text style={styles.pickerSelectedText}>{selectedStaff.name}</Text>
                    </View>
                    : <Text style={styles.pickerPlaceholder}>Tap to select…</Text>
                }
                <Ionicons name="chevron-down" size={18} color={theme.colors.outline} />
            </TouchableOpacity>

            {/* Amount + Date row */}
            <View style={styles.twoCol}>
                <View style={styles.halfLeft}>
                    <Input
                        label="Amount (₹)"
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="0.00"
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.halfRight}>
                    <Input
                        label="Date"
                        value={date}
                        onChangeText={setDate}
                        placeholder="YYYY-MM-DD"
                        maxLength={10}
                    />
                </View>
            </View>

            {/* Payment type pills */}
            <Text style={styles.fieldLabel}>PAYMENT TYPE</Text>
            <PillSelector
                options={PAYMENT_TYPES}
                selected={type}
                onSelect={setType}
                colors={{ SALARY: theme.colors.primary, ADVANCE: "#f59e0b" }}
            />

            <Button
                label="Record Payment"
                variant="primary"
                icon="cash-outline"
                onPress={handlePay}
                loading={submitting}
                disabled={submitting}
            />

            {/* Payment history */}
            {selectedStaff && (
                <View style={styles.historyBox}>
                    <View style={styles.historyHeaderRow}>
                        <Text style={styles.historyTitle}>RECENT — {selectedStaff.name.toUpperCase()}</Text>
                        {history.length > 0 && (
                            <Text style={styles.totalPaid}>
                                ₹{totalPaid.toLocaleString("en-IN")} total
                            </Text>
                        )}
                    </View>
                    {loadingHistory
                        ? <ActivityIndicator color={theme.colors.primary} style={{ marginVertical: 12 }} />
                        : history.length === 0
                            ? <Text style={styles.emptyText}>No payments yet.</Text>
                            : history.map(p => (
                                <View key={p.id} style={styles.historyRow}>
                                    <View>
                                        <Text style={styles.historyDate}>{p.date}</Text>
                                        <View style={[
                                            styles.statusBadge,
                                            { backgroundColor: p.type === "SALARY" ? "#dbeafe" : "#fef9c3", marginTop: 4 }
                                        ]}>
                                            <Text style={[
                                                styles.statusBadgeText,
                                                { color: p.type === "SALARY" ? "#1e40af" : "#92400e" }
                                            ]}>
                                                {p.type}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={styles.paymentAmount}>
                                        ₹{parseFloat(p.amount).toLocaleString("en-IN")}
                                    </Text>
                                </View>
                            ))
                    }
                </View>
            )}

            {/* Staff picker modal */}
            <Modal visible={showStaffModal} transparent animationType="slide" onRequestClose={() => setShowStaffModal(false)}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowStaffModal(false)}>
                    <View style={styles.modalSheet}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Staff</Text>
                            <TouchableOpacity onPress={() => setShowStaffModal(false)}>
                                <Ionicons name="close" size={22} color={theme.colors.outline} />
                            </TouchableOpacity>
                        </View>
                        {loadingStaff
                            ? <ActivityIndicator color={theme.colors.primary} />
                            : staff.map((m, i) => (
                                <TouchableOpacity
                                    key={m.id}
                                    style={[styles.modalItem, i < staff.length - 1 && styles.modalSeparator]}
                                    onPress={() => handleSelectStaff(m)}
                                >
                                    <Avatar name={m.name} size={34} />
                                    <Text style={[styles.modalItemText, { marginLeft: 12 }]}>{m.name}</Text>
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function StaffScreen() {
    const [activeTab, setActiveTab] = useState("Staff");
    const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

    const showToast = useCallback((message, type = "success") =>
        setToast({ visible: true, message, type }), []);

    return (
        <View style={styles.container}>
            <CustomHeader
                title="Staff Management"
                showBack={true}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Title
                <View style={styles.titleRow}>
                    <View>
                        <Text style={styles.labelSub}>FACTORY</Text>
                        <Text style={styles.screenTitle}>Staff</Text>
                    </View>
                </View> */}

                <TabBar active={activeTab} onChange={setActiveTab} />

                <View style={styles.tabContent}>
                    {activeTab === "Staff" && <StaffTab showToast={showToast} />}
                    {activeTab === "Attendance" && <AttendanceTab showToast={showToast} />}
                    {activeTab === "Payments" && <PaymentsTab showToast={showToast} />}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {toast.visible && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onHide={() => setToast({ ...toast, visible: false })}
                />
            )}
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollContent: { paddingHorizontal: 24, paddingTop: 10 },

    titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
    labelSub: { fontSize: 11, fontWeight: "800", color: theme.colors.primary, letterSpacing: 1.2, marginBottom: 2 },
    screenTitle: { fontSize: 28, fontWeight: "700", color: theme.colors.onSurface },

    // Tab bar
    tabBar: { flexDirection: "row", backgroundColor: theme.colors.surfaceContainerLow, borderRadius: 12, padding: 4, marginBottom: 24 },
    tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
    tabActive: { backgroundColor: theme.colors.background, elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4 },
    tabText: { fontSize: 14, fontWeight: "600", color: theme.colors.outline },
    tabTextActive: { color: theme.colors.primary, fontWeight: "700" },

    tabContent: {
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderRadius: 16, padding: 20,
        borderWidth: 1, borderColor: theme.colors.outlineVariant,
    },

    // Staff tab
    tabActionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
    countLabel: { fontSize: 13, fontWeight: "600", color: theme.colors.outline },
    smallBtn: { height: 44, paddingHorizontal: 16, marginVertical: 0 },
    staffCard: { flexDirection: "row", alignItems: "center", backgroundColor: theme.colors.background, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.outlineVariant },
    avatar: { backgroundColor: theme.colors.primaryContainer ?? "#dbeafe", justifyContent: "center", alignItems: "center" },
    avatarText: { fontSize: 16, fontWeight: "700", color: theme.colors.primary },
    staffName: { fontSize: 15, fontWeight: "700", color: theme.colors.onSurface },
    staffSub: { fontSize: 12, color: theme.colors.outline, marginTop: 2 },

    // Shared field label
    fieldLabel: { fontSize: 11, fontWeight: "800", color: theme.colors.outline, letterSpacing: 1, marginBottom: 8 },

    // Picker
    pickerBox: {
        height: 52, backgroundColor: theme.colors.surfaceContainerLow,
        borderWidth: 1, borderColor: theme.colors.outlineVariant,
        borderRadius: 8, paddingHorizontal: 12,
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        marginBottom: 16,
    },
    pickerSelected: { flexDirection: "row", alignItems: "center", flex: 1 },
    pickerSelectedText: { fontSize: 15, fontWeight: "600", color: theme.colors.onSurface, marginLeft: 10 },
    pickerPlaceholder: { fontSize: 15, color: theme.colors.outline, flex: 1 },

    // Two-col layout
    twoCol: { flexDirection: "row" },
    halfLeft: { flex: 1, marginRight: 8 },
    halfRight: { flex: 1, marginLeft: 8 },

    // Pills
    pillRow: { flexDirection: "row", gap: 8, marginBottom: 16, marginTop: 4 },
    pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: theme.colors.outlineVariant },
    pillText: { fontSize: 13, fontWeight: "700", color: theme.colors.outline },
    pillTextActive: { color: "white" },

    // History
    historyBox: { marginTop: 20, backgroundColor: theme.colors.background, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: theme.colors.outlineVariant },
    historyHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
    historyTitle: { fontSize: 11, fontWeight: "800", color: theme.colors.outline, letterSpacing: 1 },
    historyRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.colors.outlineVariant },
    historyDate: { fontSize: 14, fontWeight: "600", color: theme.colors.onSurface },
    statusBadge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
    statusBadgeText: { fontSize: 11, fontWeight: "700" },
    totalPaid: { fontSize: 13, fontWeight: "700", color: theme.colors.primary },
    paymentAmount: { fontSize: 16, fontWeight: "700", color: theme.colors.onSurface },
    emptyText: { textAlign: "center", color: theme.colors.outline, paddingVertical: 20, fontSize: 14 },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
    modalSheet: { backgroundColor: theme.colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 36 },
    modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
    modalTitle: { fontSize: 16, fontWeight: "700", color: theme.colors.onSurface },
    modalItem: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
    modalItemText: { fontSize: 15, fontWeight: "600", color: theme.colors.onSurface },
    modalSeparator: { borderBottomWidth: 1, borderBottomColor: theme.colors.outlineVariant },
});