import { useEffect, useState } from 'react';
import type { TrainingSession } from './app';
import { getRecentSessions } from './db';

export function useSessionHistory(limit = 20) {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const rows = await getRecentSessions(limit);
      setSessions(rows);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, [limit]);

  return { sessions, loading, refresh };
}
