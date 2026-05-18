"use client";

import { createContext, useContext, useState } from "react";
import type { User } from "@supabase/supabase-js";

type UserContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({initialUser, children}: {initialUser: User | null, children: React.ReactNode}) => {
    const [user, setUser] = useState(initialUser);
    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};