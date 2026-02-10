import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { apiFetch } from '@/lib/api';

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
  setSelectedSociety: (s: Society) => void;
  refreshSocieties: () => Promise<void>;
};

const SocietyContext = createContext<SocietyContextType | null>(null);

const STORAGE_KEY = 'selected_society_id';

export function SocietyProvider({ children }: { children: React.ReactNode }) {
  const [societies, setSocieties] = useState<Society[]>([]);
  const [selectedSociety, setSelectedSocietyState] = useState<Society | null>(null);
  const [ready, setReady] = useState(false);

  async function refreshSocieties() {
    const data: Society[] = await apiFetch('/societies/mine');
    setSocieties(data);

    const approved = data.filter(s => s.status === 'APPROVED');

    const savedId = await SecureStore.getItemAsync(STORAGE_KEY);

    const found =
      approved.find(s => s.societyId === savedId) ??
      approved[0] ??
      null;

    if (found) {
      await SecureStore.setItemAsync(STORAGE_KEY, found.societyId);
    }

    setSelectedSocietyState(found);
  }

  async function setSelectedSociety(society: Society) {
    await SecureStore.setItemAsync(STORAGE_KEY, society.societyId);
    setSelectedSocietyState(society);
  }

  useEffect(() => {
    refreshSocieties().finally(() => setReady(true));
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <SocietyContext.Provider
      value={{
        societies,
        selectedSociety,
        setSelectedSociety,
        refreshSocieties,
      }}
    >
      {children}
    </SocietyContext.Provider>
  );
}

export function useSociety() {
  const ctx = useContext(SocietyContext);
  if (!ctx) {
    throw new Error('useSociety must be used inside SocietyProvider');
  }
  return ctx;
}
