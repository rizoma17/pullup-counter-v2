import type { VercelRequest, VercelResponse } from '@vercel/node';
export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  res.setHeader('Cache-Control', 'no-store');
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  if (!publicKey) return res.status(503).json({ error: 'Push is not configured' });
  return res.status(200).json({ publicKey });
}
