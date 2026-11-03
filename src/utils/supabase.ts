const URL_BASE = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, '');
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isRemoteEnabled = (): boolean => !!URL_BASE && !!ANON_KEY;

const headers = (): Record<string, string> => ({
  apikey: ANON_KEY as string,
  Authorization: `Bearer ${ANON_KEY}`,
  'Content-Type': 'application/json',
});

export async function remoteSelect<T>(table: string, query: string): Promise<T> {
  const res = await fetch(`${URL_BASE}/rest/v1/${table}?${query}`, { headers: headers() });
  if (!res.ok) throw new Error(`Supabase ${table}: ${res.status}`);
  return res.json();
}

export async function remoteRpc<T = unknown>(fn: string, args: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${URL_BASE}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(args),
  });
  if (!res.ok) throw new Error(`Supabase rpc ${fn}: ${res.status}`);
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}
