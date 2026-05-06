import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightTheme, darkTheme } from "../constants/theme";

const STORAGE_KEY = "@tack_dark_mode";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false);
    const [loaded, setLoaded] = useState(false);   // prevents flash of wrong theme

    // ── Load saved preference on mount ───────────────────────────────────────
    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY)
            .then(val => {
                if (val === "true") setIsDark(true);
            })
            .catch(() => { })   // silently fall back to light if storage fails
            .finally(() => setLoaded(true));
    }, []);

    // ── Persist on every toggle ───────────────────────────────────────────────
    const toggleTheme = () => {
        setIsDark(prev => {
            const next = !prev;
            AsyncStorage.setItem(STORAGE_KEY, String(next)).catch(() => { });
            return next;
        });
    };

    const theme = isDark ? darkTheme : lightTheme;

    // Don't render children until preference is loaded — avoids white flash
    if (!loaded) return null;

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);