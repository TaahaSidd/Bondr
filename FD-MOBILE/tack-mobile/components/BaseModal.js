import React from "react";
import {
    View, Text, StyleSheet, Modal,
    TouchableOpacity, TouchableWithoutFeedback,
    KeyboardAvoidingView, Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";

export const BaseModal = ({
    visible,
    onClose,
    title,
    subtitle,
    children,
    actions
}) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            style={styles.container}
                        >
                            <View style={styles.modalCard}>
                                {/* Header Section - No Close Icon */}
                                <View style={styles.header}>
                                    <View>
                                        <Text style={styles.title}>{title}</Text>
                                        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                                    </View>
                                </View>

                                {/* Dynamic Content Area */}
                                <View style={styles.content}>
                                    {children}
                                </View>

                                {/* Action Buttons Area */}
                                {actions && (
                                    <View style={styles.footer}>
                                        {actions}
                                    </View>
                                )}
                            </View>
                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Slightly darker for focus
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24
    },
    container: {
        width: '100%',
        maxWidth: 400,
    },
    modalCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: 24,
        padding: 24,
        elevation: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: theme.colors.onSurface,
        letterSpacing: -0.5
    },
    subtitle: {
        fontSize: 13,
        color: theme.colors.onSurfaceVariant,
        marginTop: 2
    },
    closeBtn: {
        backgroundColor: theme.colors.surfaceContainerHigh,
        padding: 4,
        borderRadius: 12
    },
    content: {
        marginBottom: 24
    },
    footer: {
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'flex-end'
    }
});