import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Pencil, Trash2, CalendarDays, AlertTriangle } from "lucide-react";
import type { SerializedNotice } from "@/lib/types";
import ConfirmDialog from "./ConfirmDialog";

const categoryStyles: Record<string, string> = {
  Exam: "bg-amber-500/15 text-amber-300 ring-1 ring-inset ring-amber-500/25",
  Event: "bg-sky-500/15 text-sky-300 ring-1 ring-inset ring-sky-500/25",
  General: "bg-slate-500/15 text-slate-300 ring-1 ring-inset ring-slate-500/25",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function NoticeCard({ notice }: { notice: SerializedNotice }) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/notices/${notice.id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        throw new Error("Failed to delete notice");
      }
      setConfirmOpen(false);
      router.replace(router.asPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete notice");
      setDeleting(false);
    }
  }

  const isUrgent = notice.priority === "Urgent";

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl border bg-white/[0.02] backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/[0.04] ${
        isUrgent
          ? "border-red-500/40 shadow-lg shadow-red-950/20"
          : "border-white/[0.07] hover:border-white/15"
      }`}
    >
      {notice.imageUrl && (
        <div className="relative h-40 w-full bg-slate-800/50">
          <Image
            src={notice.imageUrl}
            alt={notice.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {isUrgent && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
              <AlertTriangle className="h-3 w-3" />
              Urgent
            </span>
          )}
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              categoryStyles[notice.category] ?? categoryStyles.General
            }`}
          >
            {notice.category}
          </span>
          <span className="ml-auto inline-flex items-center gap-1 text-xs text-slate-500">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(notice.publishDate)}
          </span>
        </div>

        <h2 className="text-lg font-semibold leading-snug text-slate-100">
          {notice.title}
        </h2>
        <p className="mt-2 flex-1 whitespace-pre-line text-sm leading-relaxed text-slate-400">
          {notice.body}
        </p>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <div className="mt-5 flex items-center gap-2 border-t border-white/[0.06] pt-4">
          <Link
            href={`/notices/${notice.id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm font-medium text-slate-200 transition hover:bg-white/5"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Link>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete notice?"
        message={`"${notice.title}" will be permanently removed. This cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </article>
  );
}
