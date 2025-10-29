'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabaseClient' // Import the client

const SourceContext = createContext()
export const useSourceContext = () => useContext(SourceContext)

export const SourceContextProvider = ({ children }) => {
    const [source, setSource] = useState(null)
    return (
        <SourceContext.Provider value={{ source, setSource }}>
            {children}
        </SourceContext.Provider>
    )
}

const DestinationContext = createContext()

export const useDestinationContext = () => useContext(DestinationContext)


export const DestinationContextProvider = ({ children }) => {
    const [destination, setDestination] = useState(null)
    return (
        <DestinationContext.Provider value={{ destination, setDestination }}>
            {children}
        </DestinationContext.Provider>
    )
}
// --- NEW CONTEXT FOR SELECTED CAR ---
const CarSelectionContext = createContext();
export const useCarSelectionContext = () => useContext(CarSelectionContext);

export const CarSelectionContextProvider = ({ children }) => {
    const [car, setCar] = useState(null);
    return (
        <CarSelectionContext.Provider value={{ car, setCar }}>
            {children}
        </CarSelectionContext.Provider>
    )
}
// --- END OF NEW CONTEXT ---

// --- NEW AUTH CONTEXT ---
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
    const supabase = getSupabaseBrowserClient();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get the initial session
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setLoading(false);
        };
        getSession();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
            }
        );

        // Cleanup subscription on unmount
        return () => {
            subscription?.unsubscribe();
        };
    }, [supabase]);

    const value = {
        session,
        loading,
        signOut: () => supabase.auth.signOut(),
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
// --- END OF NEW AUTH CONTEXT ---

