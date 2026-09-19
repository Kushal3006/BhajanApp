import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-6 py-16 text-center">
      <div className="max-w-md rounded-3xl border border-stone-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">Bhakti</p>
        <h1 className="mt-4 text-4xl font-bold text-stone-900">Bhajan not found</h1>
        <p className="mt-3 text-stone-600">
          The devotional content you are looking for is not available right now.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
