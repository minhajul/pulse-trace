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
        res = await fetch(url, {cache: 'no-store'});
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