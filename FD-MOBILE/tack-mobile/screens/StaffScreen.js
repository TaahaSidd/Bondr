import React, { useState, useEffect, useCallback } from "react";
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    Modal, ActivityIndicator, ScrollView, Platform
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../context/ThemeContext"; // Added Theme Hook
import { CustomHeader } from "../components/CustomHeader";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Toast } from "../components/Toast";
import { PickerField } from "../components/PickerField";
import { SegmentedControl } from "../components/SegmentedControl";
import { PillSelector } from "../components/PillSelector";
import { staffApi } from "../api/staffApi";

const PAYMENT_TYPES = ["ADVANCE", "SALARY"];
const STAFF_STATUSES = ["PRESENT", "ABSENT"];
const fmt = (d) => new Date(d).toISOString().split("T")[0];

// ── Avatar ────────────────────────────────────────────────────────────────────
const Avatar = ({ name, size = 44, theme, styles }) => (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
        <Text style={[styles.avatarText, { fontSize: size * 0.38 }]}>
            {name?.charAt(0).toUpperCase()}
        </Text>
    </View>
);

// ── Staff picker bottom sheet ─────────────────────────────────────────────────
const StaffPickerModal = ({ visible, staff, loading, onSelect, onClose, theme, styles }) => (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
            <View style={styles.sheet}>
                <View style={styles.sheetHeader}>
                    <Text style={styles.sheetTitle}>Select staff member</Text>
                    <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Ionicons name="close" size={22} color={theme.colors.outline} />
                    </TouchableOpacity>
                </View>
                {loading
                    ? <ActivityIndicator color={theme.colors.primary} style={{ marginVertical: 24 }} />
                    : staff.map((m, i) => (
                        <TouchableOpacity
                            key={m.id}
                            style={[styles.sheetItem, i < staff.length - 1 && styles.sheetSeparator]}
                            onPress={() => { onSelect(m); onClose(); }}
                        >
                            <Avatar name={m.name} size={36} theme={theme} styles={styles} />
                            <View style={{ marginLeft: 12 }}>
                                <Text style={styles.sheetItemName}>{m.name}</Text>
                                <Text style={styles.sheetItemSub}>ID #{m.id}</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                }
            </View>
        </TouchableOpacity>
    </Modal>
);

// ── Staff picker row ──────────────────────────────────────────────────────────
const StaffPickerRow = ({ selected, onPress, theme, styles }) => (
    <TouchableOpacity style={styles.staffPickerRow} onPress={onPress} activeOpacity={0.7}>
        {selected ? (
            <>
                <Avatar name={selected.name} size={32} theme={theme} styles={styles} />
                <Text style={styles.staffPickerName}>{selected.name}</Text>
            </>
        ) : (
            <>
                <View style={styles.staffPickerEmpty}>
                    <Ionicons name="person-outline" size={16} color={theme.colors.outline} />
                </View>
                <Text style={styles.staffPickerPlaceholder}>Select staff member</Text>
            </>
        )}
        <Ionicons name="chevron-down" size={16} color={theme.colors.outline} style={{ marginLeft: "auto" }} />
    </TouchableOpacity>
);

// ── Staff Tab ─────────────────────────────────────────────────────────────────
const StaffTab = ({ showToast, theme, styles }) => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addModal, setAddModal] = useState(false);
    const [name, setName] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try { const r = await staffApi.getAllStaff(); setStaff(r.data); }
        catch { showToast("Failed to load staff.", "error"); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleAdd = async () => {
        if (!name.trim()) { showToast("Enter a name.", "warning"); return; }
        setSubmitting(true);
        try {
            await staffApi.addStaff({ name: name.trim() });
            showToast("Staff member added!");
            setName(""); setAddModal(false); load();
        } catch (e) {
            showToast(e.response?.data?.message ?? "Failed to add staff.", "error");
        } finally { setSubmitting(false); }
    };

    return (
        <>
            <View style={styles.tabTop}>
                <Text style={styles.tabCount}>{staff.length} members</Text>
                <Button
                    label="Add"
                    variant="primary"
                    icon="person-add-outline"
                    onPress={() => setAddModal(true)}
                    style={styles.smallBtn}
                />
            </View>

            {loading ? (
                <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 20 }} />
            ) : staff.length === 0 ? (
                <Text style={styles.emptyText}>No staff added yet.</Text>
            ) : (
                <View>
                    {[...staff].reverse().map((item, index) => (
                        <View key={item.id} style={[styles.staffCard, index > 0 && { marginTop: 8 }]}>
                            <Avatar name={item.name} theme={theme} styles={styles} />
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={styles.staffName}>{item.name}</Text>
                                <Text style={styles.staffSub}>ID #{item.id}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color={theme.colors.outline} />
                        </View>
                    ))}
                </View>
            )}

            <Modal visible={addModal} transparent animationType="slide" onRequestClose={() => setAddModal(false)}>
                <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setAddModal(false)}>
                    <View style={styles.sheet}>
                        <View style={styles.sheetHeader}>
                            <Text style={styles.sheetTitle}>New staff member</Text>
                            <TouchableOpacity onPress={() => setAddModal(false)}>
                                <Ionicons name="close" size={22} color={theme.colors.outline} />
                            </TouchableOpacity>
                        </View>
                        <Input label="Full Name" value={name} onChangeText={setName} placeholder="e.g. Rajesh Kumar" />
                        <Button label="Add Member" variant="primary" loading={submitting} disabled={submitting} onPress={handleAdd} />
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
};

// ── Attendance Tab ────────────────────────────────────────────────────────────
const AttendanceTab = ({ showToast, theme, styles }) => {
    const [staff, setStaff] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [status, setStatus] = useState("PRESENT");
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [history, setHistory] = useState([]);
    const [loadingStaff, setLoadingStaff] = useState(true);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        staffApi.getAllStaff()
            .then(r => setStaff(r.data))
            .catch(() => showToast("Could not load staff.", "error"))
            .finally(() => setLoadingStaff(false));
    }, []);

    const loadHistory = async (id) => {
        setLoadingHistory(true);
        try {
            const r = await staffApi.getAttendanceByStaff(id);
            setHistory([...r.data].reverse().slice(0, 7));
        } catch { showToast("Could not load history.", "error"); }
        finally { setLoadingHistory(false); }
    };

    const handleMark = async () => {
        if (!selectedStaff) { showToast("Select a staff member.", "warning"); return; }
        setSubmitting(true);
        try {
            await staffApi.markAttendance({ staffId: selectedStaff.id, date: fmt(date), status });
            showToast("Attendance marked!");
            loadHistory(selectedStaff.id);
        } catch (e) {
            showToast(e.response?.data?.message ?? "Failed to mark attendance.", "error");
        } finally { setSubmitting(false); }
    };

    return (
        <>
            <StaffPickerRow selected={selectedStaff} onPress={() => setShowModal(true)} theme={theme} styles={styles} />

            <View style={styles.twoCol}>
                <View style={styles.halfLeft}>
                    <PickerField
                        label="Date"
                        value={fmt(date)}
                        onPress={() => setShowDatePicker(true)}
                    />
                </View>
                <View style={styles.halfRight}>
                    <PillSelector
                        label="Status"
                        options={STAFF_STATUSES}
                        selected={status}
                        onSelect={setStatus}
                        colorMap={{ PRESENT: "#16a34a", ABSENT: theme.colors.error }}
                    />
                </View>
            </View>

            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(e, d) => { if (Platform.OS === "android") setShowDatePicker(false); if (d) setDate(d); }}
                    maximumDate={new Date()}
                />
            )}

            <Button label="Mark Attendance" variant="primary"
                onPress={handleMark} loading={submitting} disabled={submitting} />

            {selectedStaff && (
                <View style={styles.historyCard}>
                    <Text style={styles.historyCardTitle}>Recent — {selectedStaff.name}</Text>
                    {loadingHistory
                        ? <ActivityIndicator color={theme.colors.primary} style={{ marginVertical: 12 }} />
                        : history.length === 0
                            ? <Text style={styles.emptyText}>No records yet.</Text>
                            : history.map((r, i) => (
                                <View key={r.id} style={[styles.historyRow, i === history.length - 1 && { borderBottomWidth: 0 }]}>
                                    <Text style={styles.historyDate}>{r.date}</Text>
                                    <View style={[styles.badge, {
                                        backgroundColor: r.status === "PRESENT"
                                            ? theme.colors.tertiaryFixed : theme.colors.errorContainer
                                    }]}>
                                        <Text style={[styles.badgeText, {
                                            color: r.status === "PRESENT"
                                                ? theme.colors.onTertiaryFixedVariant : theme.colors.onErrorContainer
                                        }]}>
                                            {r.status === "PRESENT" ? "Present" : "Absent"}
                                        </Text>
                                    </View>
                                </View>
                            ))
                    }
                </View>
            )}

            <StaffPickerModal
                visible={showModal} staff={staff} loading={loadingStaff}
                theme={theme} styles={styles}
                onSelect={s => { setSelectedStaff(s); loadHistory(s.id); }}
                onClose={() => setShowModal(false)}
            />
        </>
    );
};

// ── Payments Tab ──────────────────────────────────────────────────────────────
const PaymentsTab = ({ showToast, theme, styles }) => {
    const [staff, setStaff] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [amount, setAmount] = useState("");
    const [type, setType] = useState("SALARY");
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [history, setHistory] = useState([]);
    const [loadingStaff, setLoadingStaff] = useState(true);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        staffApi.getAllStaff()
            .then(r => setStaff(r.data))
            .catch(() => showToast("Could not load staff.", "error"))
            .finally(() => setLoadingStaff(false));
    }, []);

    const loadHistory = async (id) => {
        setLoadingHistory(true);
        try {
            const r = await staffApi.getPaymentsByStaff(id);
            setHistory([...r.data].reverse().slice(0, 7));
        } catch { showToast("Could not load history.", "error"); }
        finally { setLoadingHistory(false); }
    };

    const handlePay = async () => {
        if (!selectedStaff) { showToast("Select a staff member.", "warning"); return; }
        if (!amount || parseFloat(amount) <= 0) { showToast("Enter a valid amount.", "warning"); return; }
        setSubmitting(true);
        try {
            await staffApi.makePayment({ staffId: selectedStaff.id, amount: parseFloat(amount), type, date: fmt(date) });
            showToast("Payment recorded!");
            setAmount("");
            loadHistory(selectedStaff.id);
        } catch (e) {
            showToast(e.response?.data?.message ?? "Failed to record payment.", "error");
        } finally { setSubmitting(false); }
    };

    const totalPaid = history.reduce((s, p) => s + parseFloat(p.amount ?? 0), 0);

    return (
        <>
            <StaffPickerRow selected={selectedStaff} onPress={() => setShowModal(true)} theme={theme} styles={styles} />

            <View style={styles.twoCol}>
                <View style={styles.halfLeft}>
                    <Input label="Amount (₹)" value={amount} onChangeText={setAmount}
                        placeholder="0.00" keyboardType="numeric" />
                </View>
                <View style={styles.halfRight}>
                    <PickerField
                        label="Date"
                        value={fmt(date)}
                        onPress={() => setShowDatePicker(true)}
                    />
                </View>
            </View>

            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(e, d) => { if (Platform.OS === "android") setShowDatePicker(false); if (d) setDate(d); }}
                    maximumDate={new Date()}
                />
            )}

            <PillSelector
                label="Payment type"
                options={PAYMENT_TYPES}
                selected={type}
                onSelect={setType}
                colorMap={{ SALARY: theme.colors.primary, ADVANCE: "#f59e0b" }}
            />

            <Button label="Record Payment" variant="primary"
                onPress={handlePay} loading={submitting} disabled={submitting} />

            {selectedStaff && (
                <View style={styles.historyCard}>
                    <View style={styles.historyCardHeader}>
                        <Text style={styles.historyCardTitle}>Recent — {selectedStaff.name}</Text>
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
                            : history.map((p, i) => (
                                <View key={p.id} style={[styles.historyRow, i === history.length - 1 && { borderBottomWidth: 0 }]}>
                                    <View>
                                        <Text style={styles.historyDate}>{p.date}</Text>
                                        <View style={[styles.badge, {
                                            backgroundColor: p.type === "SALARY"
                                                ? theme.colors.primaryFixed : theme.colors.warningContainer,
                                            marginTop: 4,
                                        }]}>
                                            <Text style={[styles.badgeText, {
                                                color: p.type === "SALARY"
                                                    ? theme.colors.onPrimaryFixedVariant : theme.colors.onWarningContainer
                                            }]}>
                                                {p.type === "SALARY" ? "Salary" : "Advance"}
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

            <StaffPickerModal
                visible={showModal} staff={staff} loading={loadingStaff}
                theme={theme} styles={styles}
                onSelect={s => { setSelectedStaff(s); loadHistory(s.id); }}
                onClose={() => setShowModal(false)}
            />
        </>
    );
};

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function StaffScreen() {
    const { theme } = useTheme();
    const s = makeStyles(theme);
    const [activeTab, setActiveTab] = useState("Staff");
    const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
    const showToast = useCallback((msg, type = "success") => setToast({ visible: true, message: msg, type }), []);

    return (
        <View style={s.container}>
            <CustomHeader showBack />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
                <Text style={s.screenTitle}>Staff</Text>

                <SegmentedControl
                    options={["Staff", "Attendance", "Payments"]}
                    selected={activeTab}
                    onChange={setActiveTab}
                />

                <View style={s.tabCard}>
                    {activeTab === "Staff" && <StaffTab showToast={showToast} theme={theme} styles={s} />}
                    {activeTab === "Attendance" && <AttendanceTab showToast={showToast} theme={theme} styles={s} />}
                    {activeTab === "Payments" && <PaymentsTab showToast={showToast} theme={theme} styles={s} />}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {toast.visible && (
                <Toast message={toast.message} type={toast.type}
                    onHide={() => setToast({ ...toast, visible: false })} />
            )}
        </View>
    );
}

const makeStyles = (theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollContent: { paddingHorizontal: 24, paddingTop: 16 },
    screenTitle: { fontSize: 22, fontWeight: "700", color: theme.colors.onSurface, marginBottom: 16 },
    tabCard: {
        backgroundColor: theme.colors.surfaceContainerLowest,
        borderRadius: 16, padding: 16, marginTop: 16,
        borderWidth: 1, borderColor: theme.colors.outlineVariant,
    },
    tabTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
    tabCount: { fontSize: 13, fontWeight: "600", color: theme.colors.outline },
    smallBtn: { height: 40, marginVertical: 0, paddingHorizontal: 12 },
    staffCard: {
        flexDirection: "row", alignItems: "center",
        backgroundColor: theme.colors.surfaceContainerLow, padding: 12,
        borderRadius: 12, borderWidth: 1, borderColor: theme.colors.outlineVariant,
    },
    avatar: { backgroundColor: theme.colors.primaryContainer, justifyContent: "center", alignItems: "center" },
    avatarText: { fontWeight: "700", color: theme.colors.primary },
    staffName: { fontSize: 14, fontWeight: "700", color: theme.colors.onSurface },
    staffSub: { fontSize: 12, color: theme.colors.outline, marginTop: 2 },
    staffPickerRow: {
        flexDirection: "row", alignItems: "center", gap: 10,
        backgroundColor: theme.colors.surfaceContainerLow,
        borderRadius: 12, padding: 12, marginBottom: 16,
        borderWidth: 1, borderColor: theme.colors.outlineVariant,
    },
    staffPickerEmpty: {
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: theme.colors.surfaceContainer,
        justifyContent: "center", alignItems: "center",
    },
    staffPickerName: { fontSize: 14, fontWeight: "600", color: theme.colors.onSurface, flex: 1 },
    staffPickerPlaceholder: { fontSize: 14, color: theme.colors.outline, flex: 1 },
    twoCol: { flexDirection: "row" },
    halfLeft: { flex: 1, marginRight: 8 },
    halfRight: { flex: 1, marginLeft: 8 },
    historyCard: {
        marginTop: 16,
        backgroundColor: theme.colors.surfaceContainerLow,
        borderRadius: 12, padding: 14,
        borderWidth: 1, borderColor: theme.colors.outlineVariant,
    },
    historyCardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
    historyCardTitle: { fontSize: 13, fontWeight: "700", color: theme.colors.onSurface },
    historyRow: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.colors.outlineVariant,
    },
    historyDate: { fontSize: 13, fontWeight: "600", color: theme.colors.onSurface },
    badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
    badgeText: { fontSize: 10, fontWeight: "700" },
    totalPaid: { fontSize: 13, fontWeight: "700", color: theme.colors.primary },
    paymentAmount: { fontSize: 15, fontWeight: "700", color: theme.colors.onSurface },
    emptyText: { textAlign: "center", color: theme.colors.outline, paddingVertical: 20, fontSize: 14 },
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
    sheet: { backgroundColor: theme.colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 36 },
    sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
    sheetTitle: { fontSize: 16, fontWeight: "700", color: theme.colors.onSurface },
    sheetItem: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
    sheetSeparator: { borderBottomWidth: 1, borderBottomColor: theme.colors.outlineVariant },
    sheetItemName: { fontSize: 15, fontWeight: "600", color: theme.colors.onSurface },
    sheetItemSub: { fontSize: 12, color: theme.colors.outline, marginTop: 2 },
});