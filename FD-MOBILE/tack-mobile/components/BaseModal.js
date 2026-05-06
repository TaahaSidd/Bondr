import React from "react";
import {
    View, Text, StyleSheet, Modal,
    TouchableWithoutFeedback,
    KeyboardAvoidingView, Platform
} from "react-native";
import { useTheme } from "../context/ThemeContext";

export const BaseModal = ({
    visible,
    onClose,
    title,
    subtitle,
    children,
    actions
}) => {
    const { theme } = useTheme();
    const s = makeStyles(theme);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={s.overlay}>
                    <TouchableWithoutFeedback>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            style={s.container}
                        >
                            <View style={s.modalCard}>
                                {/* Header Section */}
                                <View style={s.header}>
                                    <View>
                                        <Text style={s.title}>{title}</Text>
                                        {subtitle && <Text style={s.subtitle}>{subtitle}</Text>}
                                    </View>
                                </View>

                                {/* Dynamic Content Area */}
                                <View style={s.content}>
                                    {children}
                                </View>

                                {/* Action Buttons Area */}
                                {actions && (
                                    <View style={s.footer}>
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

const makeStyles = (theme) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24
    },
    container: {
        width: '100%',
        maxWidth: 400,
    },
    modalCard: {
        backgroundColor: theme.colors.background,
        borderRadius: 24,
        padding: 24,
        elevation: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: theme.dark ? 0.5 : 0.3,
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
    content: {
        marginBottom: 24
    },
    footer: {
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'flex-end'
    }
});