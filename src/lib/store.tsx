import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createSeed } from "./seed";
import type { CollectionKey, SingletonKey, StoreData } from "./types";
import { uid } from "./format";

const STORAGE_KEY = "aryans-store-v1";

type Item<K extends CollectionKey> = StoreData[K][number];

interface StoreContextValue {
  data: StoreData;
  hydrated: boolean;
  addItem: <K extends CollectionKey>(key: K, item: Item<K>, activity?: string) => void;
  updateItem: <K extends CollectionKey>(key: K, id: string, patch: Partial<Item<K>>, activity?: string) => void;
  removeItem: <K extends CollectionKey>(key: K, id: string, activity?: string) => void;
  setSingleton: <K extends SingletonKey>(key: K, value: StoreData[K], activity?: string) => void;
  logActivity: (message: string) => void;
  resetAll: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function mergeWithSeed(saved: Partial<StoreData>): StoreData {
  const seed = createSeed();
  return {
    ...seed,
    ...saved,
    homepage: { ...seed.homepage, ...(saved.homepage ?? {}) },
    about: { ...seed.about, ...(saved.about ?? {}) },
    settings: { ...seed.settings, ...(saved.settings ?? {}) },
    profile: { ...seed.profile, ...(saved.profile ?? {}) },
  };
}

function withActivity(data: StoreData, message?: string): StoreData {
  if (!message) return data;
  return {
    ...data,
    activity: [{ id: uid("act"), message, at: new Date().toISOString() }, ...data.activity].slice(0, 60),
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoreData>(() => createSeed());
  const [hydrated, setHydrated] = useState(false);
  const skipSave = useRef(true);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setData(mergeWithSeed(JSON.parse(raw) as Partial<StoreData>));
    } catch (err) {
      console.warn("Could not read saved data, using defaults.", err);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.warn("Could not save data (storage may be full).", err);
      window.dispatchEvent(new CustomEvent("aryans-storage-error"));
    }
  }, [data, hydrated]);

  // Keep multiple tabs (public site + admin) in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        skipSave.current = true;
        setData(mergeWithSeed(JSON.parse(e.newValue) as Partial<StoreData>));
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addItem = useCallback<StoreContextValue["addItem"]>((key, item, activity) => {
    setData((d) => withActivity({ ...d, [key]: [item, ...(d[key] as Item<typeof key>[])] }, activity));
  }, []);

  const updateItem = useCallback<StoreContextValue["updateItem"]>((key, id, patch, activity) => {
    setData((d) =>
      withActivity(
        { ...d, [key]: (d[key] as Item<typeof key>[]).map((x) => (x.id === id ? { ...x, ...patch } : x)) },
        activity,
      ),
    );
  }, []);

  const removeItem = useCallback<StoreContextValue["removeItem"]>((key, id, activity) => {
    setData((d) => withActivity({ ...d, [key]: (d[key] as Item<typeof key>[]).filter((x) => x.id !== id) }, activity));
  }, []);

  const setSingleton = useCallback<StoreContextValue["setSingleton"]>((key, value, activity) => {
    setData((d) => withActivity({ ...d, [key]: value }, activity));
  }, []);

  const logActivity = useCallback((message: string) => setData((d) => withActivity(d, message)), []);

  const resetAll = useCallback(() => {
    setData(withActivity(createSeed(), "Demo data reset to defaults"));
  }, []);

  const value = useMemo(
    () => ({ data, hydrated, addItem, updateItem, removeItem, setSingleton, logActivity, resetAll }),
    [data, hydrated, addItem, updateItem, removeItem, setSingleton, logActivity, resetAll],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
