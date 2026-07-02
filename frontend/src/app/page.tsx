import { fetchStories } from './api';

export default async function Home() {
  let response;
  let error: string | undefined;

  try {
    response = await fetchStories();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error';
  }

  const stories = response?.data ?? [];

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-start py-16 px-8 sm:px-16 bg-white dark:bg-black">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          PulseTrace — Stories
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Fetched server-side from the NestJS backend via a Vercel service
          binding.
        </p>

        {response && (
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
            {response.count} {response.count === 1 ? 'story' : 'stories'} • Last
            updated {new Date(response.timestamp).toLocaleString()}
          </p>
        )}

        {error && (
          <div className="mt-6 w-full rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            Failed to load stories: {error}
          </div>
        )}

        {stories.length > 0 && (
          <ul className="mt-6 w-full space-y-4">
            {stories.map((story) => (
              <li
                key={story.id}
                className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
              >
                <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
                  {story.title}
                </h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  by {story.author}
                </p>
                <p className="mt-2 text-base leading-7 text-zinc-700 dark:text-zinc-300">
                  {story.content}
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}