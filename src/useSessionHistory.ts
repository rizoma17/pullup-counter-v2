import { useCallback, useEffect, useState } from 'react';
import type { TrainingSession } from './app';
import { getSessions } from './db';
import { usePullupStore } from './store';

export function useSessionHistory() {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastSavedAt = usePullupStore((s) => s.lastSavedAt);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await getSessions();
      setSessions(rows);
    } catch {
      setError('逐筆記錄暫時無法讀取，仍可查看已儲存的每日總次數。');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh, lastSavedAt]);

  return { sessions, loading, error, refresh };
}
