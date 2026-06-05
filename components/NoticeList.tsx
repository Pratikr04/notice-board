import { useMemo, useState } from "react";
import { Layers, Search, Inbox } from "lucide-react";
import type { SerializedNotice } from "@/lib/types";
import { CATEGORIES } from "@/lib/validation";
import NoticeCard from "./NoticeCard";

const FILTERS = ["All", ...CATEGORIES] as const;
type Filter = (typeof FILTERS)[number];

export default function NoticeList({ notices }: { notices: SerializedNotice[] }) {
  const [category, setCategory] = useState<Filter>("All");
  const [query, setQuery] = useState("");

  // Client-side filter/search only. The Urgent-first ordering itself still
  // comes from the database query, so this never re-sorts the list.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notices.filter((n) => {
      const matchesCategory = category === "All" || n.category === category;
      const matchesQuery =
        q === "" ||
        n.title.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [notices, category, query]);

  return (
    <section className="mt-6">
      {/* Filter + search bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="ml-1 hidden items-center gap-1.5 text-sm text-slate-400 sm:flex">
            <Layers className="h-4 w-4" />
            Category:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => {
              const active = category === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setCategory(f)}
                  className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
                    active
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-900/40"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notices..."
            className="w-full rounded-lg border border-white/10 bg-slate-950/40 py-2 pl-9 pr-3 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.01] px-6 py-20 text-center">
          <Inbox className="h-14 w-14 text-slate-600" strokeWidth={1.25} />
          <h3 className="mt-4 text-xl font-semibold text-slate-100">
            No notices found
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {notices.length === 0
              ? "Start by publishing your first campus notice!"
              : "Try a different category or search term."}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </div>
      )}
    </section>
  );
}
