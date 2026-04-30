import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

export const Toast = ({ message, type = 'success', onHide }) => {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Fade In
        Animated.sequence([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
            // Wait 2.5 seconds
            Animated.delay(2500),
            // Fade Out
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => onHide());
    }, []);

    const getIcon = () => {
        switch (type) {
            case 'error': return 'alert-circle';
            case 'warning': return 'warning';
            default: return 'checkmark-circle';
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'error': return '#F44336';
            case 'warning': return '#FF9800';
            default: return theme.colors.primary;
        }
    };

    return (
        <Animated.View style={[styles.container, { opacity, backgroundColor: getBackgroundColor() }]}>
            <Ionicons name={getIcon()} size={20} color="white" />
            <Text style={styles.text}>{message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60, // Adjust based on your header height
        left: 20,
        right: 20,
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 9999,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    text: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 10,
    },
});