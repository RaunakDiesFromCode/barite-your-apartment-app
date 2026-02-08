import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client";
import { SocietyMembership } from "../types/api";

type SocietyContextType = {
    societies: SocietyMembership[];
    current: SocietyMembership | null;
    setCurrentById: (id: string) => void;
    loading: boolean;
};

const SocietyContext = createContext<SocietyContextType | null>(null);

export function SocietyProvider({ children }: { children: React.ReactNode }) {
    const [societies, setSocieties] = useState<SocietyMembership[]>([]);
    const [current, setCurrent] = useState<SocietyMembership | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api<SocietyMembership[]>("/societies")
            .then((data) => {
                setSocieties(data);
                setCurrent(data[0] ?? null); // default = first society
            })
            .finally(() => setLoading(false));
    }, []);

    function setCurrentById(id: string) {
        const found = societies.find((s) => s.society.id === id);
        if (found) setCurrent(found);
    }

    return (
        <SocietyContext.Provider
            value={{ societies, current, setCurrentById, loading }}
        >
            {children}
        </SocietyContext.Provider>
    );
}

export function useSociety() {
    const ctx = useContext(SocietyContext);
    if (!ctx) {
        throw new Error("useSociety must be used inside SocietyProvider");
    }
    return ctx;
}
