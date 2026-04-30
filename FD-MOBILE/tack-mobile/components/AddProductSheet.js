import React from "react";
import {
    View, Text, StyleSheet, Modal, TextInput,
    TouchableOpacity, KeyboardAvoidingView, Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";
import { Button } from "./Button";

export const AddProductSheet = ({ visible, onClose, onSave, name, setName, desc, setDesc }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            {/* The Backdrop: Tapping outside closes the sheet */}
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.sheetContainer}
                >
                    {/* The actual Sheet content */}
                    <TouchableOpacity activeOpacity={1} style={styles.sheetContent}>
                        {/* Visual Handle for "Dragging" vibe */}
                        <View style={styles.handle} />

                        <View style={styles.header}>
                            <Text style={styles.title}>New Product Type</Text>
                            <TouchableOpacity onPress={onClose}>
                                <Ionicons name="close-circle" size={24} color={theme.colors.outline} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.inputLabel}>PRODUCT NAME (SIZE)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. 11mm Industrial"
                            value={name}
                            onChangeText={setName}
                            placeholderTextColor={theme.colors.outline}
                        />

                        <Text style={styles.inputLabel}>DESCRIPTION</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="e.g. High-temperature grade sticks"
                            value={desc}
                            onChangeText={setDesc}
                            multiline
                            numberOfLines={3}
                            placeholderTextColor={theme.colors.outline}
                        />

                        <Button
                            label="Create Product"
                            variant="primary"
                            onPress={onSave}
                            style={styles.submitBtn}
                        />
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)', // Dim the background
        justifyContent: 'flex-end',
    },
    sheetContainer: {
        width: '100%',
    },
    sheetContent: {
        backgroundColor: theme.colors.surface,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: theme.colors.outlineVariant,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: theme.colors.onSurface,
        letterSpacing: -0.5,
    },
    inputLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: theme.colors.outline,
        marginBottom: 8,
        letterSpacing: 1,
    },
    input: {
        backgroundColor: theme.colors.surfaceContainerLow,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: theme.colors.onSurface,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: theme.colors.outlineVariant,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    submitBtn: {
        marginTop: 10,
        height: 56,
    }
});