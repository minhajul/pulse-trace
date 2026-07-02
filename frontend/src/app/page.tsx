import { fetchStories } from './api';

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function Avatar({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-sm font-semibold text-white shadow-sm ring-2 ring-white/60 dark:ring-zinc-900"
    >
      {initialsOf(name) || '?'}
    </span>
  );
}

function Logo() {
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-md">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <path d="M3 12h3l2-7 4 14 2-7h7" />
      </svg>
    </span>
  );
}

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
    <div className="relative flex flex-1 flex-col items-center overflow-hidden bg-background font-sans">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b from-indigo-50 via-white to-transparent dark:from-indigo-950/40 dark:via-zinc-950 dark:to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-72 w-[640px] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-400/30 to-fuchsia-400/30 blur-3xl dark:from-indigo-500/20 dark:to-fuchsia-500/20"
      />

      {/* Header */}
      <header className="w-full max-w-5xl px-6 pt-6 sm:pt-10">
        <nav className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/70 px-4 py-3 shadow-sm backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-2.5">
            <Logo />
            <span className="text-base font-semibold tracking-tight">
              PulseTrace
            </span>
          </div>
          <div className="hidden items-center gap-6 text-sm text-muted sm:flex">
            <a className="hover:text-foreground transition-colors" href="#stories">
              Stories
            </a>
            <a className="hover:text-foreground transition-colors" href="#">
              Authors
            </a>
            <a className="hover:text-foreground transition-colors" href="#">
              About
            </a>
          </div>
          <button
            type="button"
            className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-fg shadow-sm transition hover:opacity-90"
          >
            Get started
          </button>
        </nav>
      </header>

      {/* Hero */}
      <section className="w-full max-w-3xl px-6 pb-6 pt-16 text-center sm:pt-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-muted backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Live • Fetched server-side
        </span>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
          Stories that move at the
          <span className="block bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">
            speed of curiosity.
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted">
          A modern feed of writing from independent authors, served straight
          from the PulseTrace backend.
        </p>
      </section>

      {/* Stories */}
      <main
        id="stories"
        className="w-full max-w-3xl flex-1 px-6 pb-24 pt-10"
      >
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Latest stories</h2>
          <span className="text-xs text-muted">
            {stories ? `${stories.length} ${stories.length === 1 ? 'story' : 'stories'}` : '—'}
          </span>
        </div>

        {response && (
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
            {response.count} {response.count === 1 ? 'story' : 'stories'} • Last
            updated {new Date(response.timestamp).toLocaleString()}
          </p>
        )}

        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 h-5 w-5 shrink-0"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div>
              <p className="font-medium">Failed to load stories</p>
              <p className="mt-0.5 text-red-700/80 dark:text-red-300/80">
                {error}
              </p>
            </div>
          </div>
        )}

        {stories && stories.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
            <p className="text-sm font-medium">No stories yet</p>
            <p className="mt-1 text-sm text-muted">
              Be the first to publish something on PulseTrace.
            </p>
          </div>
        )}

        {stories && stories.length > 0 && (
          <ul className="grid gap-4 sm:grid-cols-2">
            {stories.map((story) => (
              <li
                key={story.id}
                className="group relative flex flex-col rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={story.author} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {story.author}
                    </p>
                    <p className="text-xs text-muted">Author</p>
                  </div>
                </div>
                <h3 className="mt-4 text-base font-semibold leading-snug tracking-tight">
                  {story.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
                  {story.content}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs font-medium text-indigo-600 transition group-hover:text-fuchsia-600 dark:text-indigo-400 dark:group-hover:text-fuchsia-400">
                    Read story →
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-muted">
                    #{story.id}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border/60 bg-card/40">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-muted sm:flex-row">
          <span>© {new Date().getFullYear()} PulseTrace</span>
          <span>Built with Next.js · Tailwind CSS</span>
        </div>
      </footer>
    </div>
  );
}
