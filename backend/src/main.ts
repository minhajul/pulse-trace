import { getApp } from './app.factory';

// Two runtime modes:
//   1. Vercel production/preview deployment (VERCEL_ENV is "production"
//      or "preview") — export a serverless request handler so Vercel's
//      Express builder can invoke it per request.
//   2. Anything else (local dev, `vercel dev`, `npm run start`) — listen
//      on a TCP port (defaults to 5001; Vercel dev assigns one via PORT)
//      so the process behaves like a normal server.
//
// Note: `vercel dev` sets `VERCEL=1` and `VERCEL_ENV=development` in the
// backend subprocess, so we cannot rely on `VERCEL` or `VERCEL_ENV`
// being unset — we must check for production/preview specifically.
const isVercelDeployment =
  process.env.VERCEL_ENV === 'production' ||
  process.env.VERCEL_ENV === 'preview';

if (isVercelDeployment) {
  const appPromise = getApp();
  module.exports = async (req: any, res: any) => {
    const app = await appPromise;
    const expressInstance = app.getHttpAdapter().getInstance();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-argument
    return expressInstance(req, res);
  };
} else {
  await (async () => {
    const app = await getApp();
    const port = Number(process.env.PORT ?? 5001);
    await app.listen(port);
    console.log(`Backend listening on http://localhost:${port}`);
  })();
}
