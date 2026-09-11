import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import type { HistoryEntry } from "@/data/types";

const KEY = "@glass/history";

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) {
          const arr = JSON.parse(raw) as HistoryEntry[];
          setEntries(arr.slice(0, 100));
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const persist = useCallback((next: HistoryEntry[]) => {
    setEntries(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next.slice(0, 100))).catch(() => {});
  }, []);

  const add = useCallback(
    (entry: HistoryEntry) => persist([entry, ...entries]),
    [entries, persist]
  );

  const clear = useCallback(() => persist([]), [persist]);

  return { entries, loaded, add, clear };
}