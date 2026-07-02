export interface Story {
  id: number;
  title: string;
  author: string;
  content: string;
}

export interface StoriesListResponse {
  status: 'success';
  count: number;
  data: Story[];
  timestamp: string;
}

/**
 * Normalizes the `/api/stories` payload to the standard envelope shape.
 *
 * The backend currently returns:
 *   { status: 'success', count, data: Story[], timestamp }
 *
 * For resilience this also accepts:
 *   - a bare Story[] (legacy shape, pre-envelope response)
 *   - an envelope whose array lives under a different key
 *     (e.g. `stories`, `items`, `results`)
 *
 * Anything else throws with a descriptive error so the page surfaces a
 * real failure rather than silently rendering the empty state.
 */
function normalizeStoriesResponse(payload: unknown): StoriesListResponse {
  if (Array.isArray(payload)) {
    return {
      status: 'success',
      count: payload.length,
      data: payload as Story[],
      timestamp: new Date().toISOString(),
    };
  }

  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>;

    const candidates: unknown[] = [
      obj.data,
      obj.stories,
      obj.items,
      obj.results,
    ];
    const list = candidates.find((c) => Array.isArray(c));

    if (Array.isArray(list)) {
      const count =
        typeof obj.count === 'number' ? obj.count : (list as unknown[]).length;
      const timestamp =
        typeof obj.timestamp === 'string'
          ? obj.timestamp
          : new Date().toISOString();
      return {
        status: 'success',
        count,
        data: list as Story[],
        timestamp,
      };
    }
  }

  throw new Error(
    `Unexpected /api/stories response shape: ${JSON.stringify(payload).slice(0, 200)}`,
  );
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

export async function fetchStories(): Promise<StoriesListResponse> {
  const url = `${getApiBaseUrl()}/api/stories`;
  let res: Response;
  try {
    res = await fetch(url, { cache: 'no-store' });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Network error fetching ${url}: ${message}`);
  }

  if (!res.ok) {
    throw new Error(
      `Failed to fetch stories: ${res.status} ${res.statusText || ''}`.trim(),
    );
  }

  let payload: unknown;
  try {
    payload = await res.json();
  } catch {
    throw new Error('Failed to parse /api/stories response as JSON');
  }

  return normalizeStoriesResponse(payload);
}