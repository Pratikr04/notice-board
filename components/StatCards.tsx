import { FileText, AlertTriangle, GraduationCap, CalendarDays } from "lucide-react";

export type Stats = {
  total: number;
  urgent: number;
  exams: number;
  events: number;
};

const cards = [
  { key: "total", label: "Total Notices", icon: FileText, accent: "text-slate-100", ring: "text-slate-400" },
  { key: "urgent", label: "Urgent Bulletins", icon: AlertTriangle, accent: "text-red-500", ring: "text-red-400" },
  { key: "exams", label: "Exams & Tests", icon: GraduationCap, accent: "text-slate-100", ring: "text-indigo-400" },
  { key: "events", label: "Events Schedule", icon: CalendarDays, accent: "text-emerald-400", ring: "text-emerald-400" },
] as const;

export default function StatCards({ stats }: { stats: Stats }) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ key, label, icon: Icon, accent, ring }) => (
        <div
          key={key}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-sm backdrop-blur-sm transition hover:border-white/10"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {label}
            </p>
            <Icon className={`h-4 w-4 ${ring}`} strokeWidth={2} />
          </div>
          <p className={`mt-3 text-4xl font-bold tracking-tight ${accent}`}>
            {stats[key]}
          </p>
        </div>
      ))}
    </section>
  );
}
