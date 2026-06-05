import { useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Upload, Link2, X, AlertCircle } from "lucide-react";
import { CATEGORIES, PRIORITIES } from "@/lib/validation";
import type { SerializedNotice } from "@/lib/types";

type NoticeFormProps = {
  initialNotice?: SerializedNotice;
};

type FormState = {
  title: string;
  body: string;
  category: string;
  priority: string;
  publishDate: string;
  imageUrl: string;
};

const TITLE_MAX = 150;
const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4MB

function toDateInput(value?: string) {
  if (!value) return new Date().toISOString().slice(0, 10);
  return new Date(value).toISOString().slice(0, 10);
}

const label = "block text-sm font-medium text-slate-300";
const required = <span className="text-red-500"> *</span>;
const input =
  "mt-1.5 block w-full rounded-xl border border-white/10 bg-slate-950/40 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

export default function NoticeForm({ initialNotice }: NoticeFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialNotice);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    title: initialNotice?.title ?? "",
    body: initialNotice?.body ?? "",
    category: initialNotice?.category ?? "General",
    priority: initialNotice?.priority ?? "Normal",
    publishDate: toDateInput(initialNotice?.publishDate),
    imageUrl: initialNotice?.imageUrl ?? "",
  });
  const [imageTab, setImageTab] = useState<"upload" | "url">(
    initialNotice?.imageUrl?.startsWith("http") ? "url" : "upload"
  );
  const [dragOver, setDragOver] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleFile(file?: File) {
    setImageError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setImageError("Please choose an image file (PNG, JPG or GIF).");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError("Image must be smaller than 4MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => update("imageUrl", String(reader.result));
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setErrors({});
    setFormError(null);

    const endpoint = isEdit ? `/api/notices/${initialNotice!.id}` : "/api/notices";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/");
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (res.status === 400 && data.errors) {
        setErrors(data.errors);
      } else {
        setFormError(data.message ?? "Something went wrong. Please try again.");
      }
      setSubmitting(false);
    } catch {
      setFormError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {formError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {formError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left column: text content */}
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className={label}>
              Title{required}
            </label>
            <input
              id="title"
              type="text"
              maxLength={TITLE_MAX}
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className={input}
              placeholder="e.g., Mid-Term Examination Schedule"
            />
            <div className="mt-1 flex items-center justify-between">
              <span className="text-sm text-red-400">{errors.title ?? ""}</span>
              <span className="text-xs text-slate-500">
                {form.title.length}/{TITLE_MAX} characters
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="body" className={label}>
              Notice Details{required}
            </label>
            <textarea
              id="body"
              rows={8}
              value={form.body}
              onChange={(e) => update("body", e.target.value)}
              className={`${input} resize-y`}
              placeholder="Provide the complete announcement text..."
            />
            {errors.body && <p className="mt-1 text-sm text-red-400">{errors.body}</p>}
          </div>
        </div>

        {/* Right column: image */}
        <div>
          <span className={label}>
            Notice Image <span className="text-slate-500">(Optional)</span>
          </span>

          <div className="mt-1.5 grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-slate-950/40 p-1">
            <button
              type="button"
              onClick={() => setImageTab("upload")}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                imageTab === "upload"
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Upload className="h-4 w-4" />
              File Upload
            </button>
            <button
              type="button"
              onClick={() => setImageTab("url")}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                imageTab === "url"
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Link2 className="h-4 w-4" />
              Image URL
            </button>
          </div>

          {/* Preview */}
          {form.imageUrl ? (
            <div className="relative mt-3 overflow-hidden rounded-xl border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.imageUrl}
                alt="Notice preview"
                className="h-44 w-full object-cover"
              />
              <button
                type="button"
                onClick={() => update("imageUrl", "")}
                className="absolute right-2 top-2 rounded-lg bg-slate-900/80 p-1.5 text-slate-200 backdrop-blur transition hover:bg-slate-900"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : imageTab === "upload" ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFile(e.dataTransfer.files?.[0]);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`mt-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition ${
                dragOver
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "border-white/15 hover:border-white/25 hover:bg-white/[0.02]"
              }`}
            >
              <Upload className="h-9 w-9 text-slate-500" strokeWidth={1.5} />
              <p className="mt-3 text-sm text-slate-300">
                Drag and drop your image here, or{" "}
                <span className="font-medium text-indigo-400">browse</span>
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Supports PNG, JPG, GIF up to 4MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </div>
          ) : (
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => update("imageUrl", e.target.value)}
              className={`${input} mt-3`}
              placeholder="https://example.com/banner.jpg"
            />
          )}

          {imageError && <p className="mt-2 text-sm text-red-400">{imageError}</p>}
          {errors.imageUrl && (
            <p className="mt-2 text-sm text-red-400">{errors.imageUrl}</p>
          )}
        </div>
      </div>

      {/* Category + Priority */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className={label}>
            Category{required}
          </label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            className={input}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-slate-900">
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className={label}>Priority{required}</span>
          <div className="mt-1.5 grid grid-cols-2 gap-3">
            {PRIORITIES.map((p) => {
              const active = form.priority === p;
              const isUrgent = p === "Urgent";
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => update("priority", p)}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                    active && isUrgent
                      ? "border-red-500 bg-red-500/15 text-red-300"
                      : active
                        ? "border-indigo-500 bg-indigo-500/15 text-indigo-200"
                        : "border-white/10 text-slate-400 hover:bg-white/5"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Publish date */}
      <div className="sm:max-w-xs">
        <label htmlFor="publishDate" className={label}>
          Publish Date{required}
        </label>
        <input
          id="publishDate"
          type="date"
          value={form.publishDate}
          onChange={(e) => update("publishDate", e.target.value)}
          className={input}
        />
        {errors.publishDate && (
          <p className="mt-1 text-sm text-red-400">{errors.publishDate}</p>
        )}
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-end gap-3 border-t border-white/[0.06] pt-6">
        <Link
          href="/"
          className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:from-indigo-400 hover:to-violet-500 disabled:opacity-60"
        >
          {submitting ? "Saving…" : isEdit ? "Save Changes" : "Create Notice"}
        </button>
      </div>
    </form>
  );
}
