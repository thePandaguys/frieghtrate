import { useCallback, useEffect, useRef, useState } from 'react';

/** Generic async data hook with loading/error state and manual re-run. */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[], enabled = true) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(enabled);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fnRef.current();
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, run, ...deps]);

  return { data, error, loading, reload: run, setData };
}

export const fmtUSD = (n: number | null | undefined, digits = 2) =>
  n === null || n === undefined ? '—' : `$${n.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
export const fmtPct = (n: number | null | undefined, digits = 1) =>
  n === null || n === undefined ? '—' : `${n > 0 ? '+' : ''}${n.toFixed(digits)}%`;
export const fmtInrCr = (n: number | null | undefined) => (n === null || n === undefined ? '—' : `₹${n.toLocaleString()} Cr`);
