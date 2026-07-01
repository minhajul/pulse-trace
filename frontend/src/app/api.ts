export interface Story {
  id: number;
  title: string;
  author: string;
  content: string;
}

/**
 * Returns the base URL for backend API calls.
 *
 * - On Vercel, `BACKEND_URL` is injected at request time via the service
 *   binding declared in vercel.json (see `services.frontend.bindings`).
 *   It is the internal URL of the backend service, with the path stripped.
 * - Locally, it falls back to the NestJS dev server on port 5001.
 *
 * We always call `/api/stories` because:
 *   - In production, the Vercel top-level rewrite forwards the request
 *     path unchanged, and the Nest controller is mounted at `/api/stories`.
 *   - In local dev, the backend listens on its own port and is reached
 *     directly with the same path.
 */
export function getApiBaseUrl(): string {
  const fromBinding = process.env.BACKEND_URL;
  if (fromBinding) {
    return fromBinding;
  }
  return process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:5001';
}

export async function fetchStories(): Promise<Story[]> {
  const res = await fetch(`${getApiBaseUrl()}/api/stories`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch stories: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as Story[];
}