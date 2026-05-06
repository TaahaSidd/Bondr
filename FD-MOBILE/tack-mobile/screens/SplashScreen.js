import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { lightTheme } from "../constants/theme";

// Splash uses lightTheme directly — always shown before ThemeContext loads
const PRIMARY = lightTheme.colors.primary;   // #0F766E

export default function SplashScreen({ onFinish }) {
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Hold for 1.4s then fade out over 0.4s
        const timer = setTimeout(() => {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }).start(() => onFinish?.());
        }, 1400);

        return () => clearTimeout(timer);
    }, []);

    return (
        <Animated.View style={[styles.container, { opacity }]}>
            <Text style={styles.appName}>Tack</Text>
            <Text style={styles.tagline}>PRODUCTION · INVENTORY</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: PRIMARY,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
    },
    appName: {
        fontSize: 48,
        fontWeight: "700",
        color: "white",
        letterSpacing: -1,
    },
    tagline: {
        fontSize: 12,
        fontWeight: "500",
        color: "rgba(255,255,255,0.6)",
        letterSpacing: 3,
        marginTop: 8,
    },
});