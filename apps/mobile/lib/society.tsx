import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { apiFetch } from '@/lib/api';
import { getToken } from '@/lib/auth';

export type Society = {
    societyId: string;
    name: string;
    address: string;
    role: string;
    status: 'APPROVED' | 'PENDING';
};

type SocietyContextType = {
    societies: Society[];
    selectedSociety: Society | null;
    loading: boolean;
    refreshSocieties: () => Promise<void>;
};

const SocietyContext = createContext<SocietyContextType | null>(null);

export function SocietyProvider({ children }: { children: React.ReactNode }) {
    const [societies, setSocieties] = useState<Society[]>([]);
    const [selectedSociety, setSelectedSociety] = useState<Society | null>(null);
    const [loading, setLoading] = useState(true);

    async function refreshSocieties() {
        setLoading(true);

        const token = await getToken();
        if (!token) {
            setSocieties([]);
            setSelectedSociety(null);
            setLoading(false);
            return;
        }

        const data: Society[] = await apiFetch('/societies/mine');
        setSocieties(data);

        // Pick first APPROVED if exists, else first society
        const approved = data.find((s) => s.status === 'APPROVED');
        const fallback = data[0] ?? null;

        setSelectedSociety(approved ?? fallback);
        setLoading(false);
    }

    useEffect(() => {
        refreshSocieties();
    }, []);

    return (
        <SocietyContext.Provider
            value={{
                societies,
                selectedSociety,
                loading,
                refreshSocieties,
            }}>
            {children}
        </SocietyContext.Provider>
    );
}

export function useSociety() {
    const ctx = useContext(SocietyContext);
    if (!ctx) throw new Error('useSociety must be used inside SocietyProvider');
    return ctx;
}
