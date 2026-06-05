import type { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { Megaphone, Sparkles, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Layout from "@/components/Layout";
import StatCards, { type Stats } from "@/components/StatCards";
import NoticeList from "@/components/NoticeList";
import type { SerializedNotice } from "@/lib/types";

type HomeProps = {
  notices: SerializedNotice[];
  stats: Stats;
};

export default function Home({ notices, stats }: HomeProps) {
  return (
    <Layout>
      <Head>
        <title>Notice Board | Reno Platforms</title>
      </Head>

      {/* Hero */}
      <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
            <Sparkles className="h-4 w-4" />
            Reno Platforms
          </p>
          <h1 className="mt-2 flex items-center gap-3 text-4xl font-bold tracking-tight sm:text-5xl">
            <Megaphone className="h-9 w-9 shrink-0 text-indigo-500 sm:h-10 sm:w-10" />
            <span className="text-gradient">Campus Notice Board</span>
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-400">
            Stay updated with the latest institutional notices, exam timetables,
            event details, and general bulletins.
          </p>
        </div>

        <Link
          href="/notices/new"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:from-indigo-400 hover:to-violet-500"
        >
          <Plus className="h-5 w-5" />
          Add Notice
        </Link>
      </header>

      <div className="mt-10">
        <StatCards stats={stats} />
      </div>

      <NoticeList notices={notices} />
    </Layout>
  );
}

// Read happens on the server so the Urgent-first ordering is produced by the
// database query (Prisma orderBy), never by sorting in the browser.
export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const notices = await prisma.notice.findMany({
    orderBy: [
      { priority: "asc" },
      { publishDate: "desc" },
      { createdAt: "desc" },
    ],
  });

  const serialized: SerializedNotice[] = notices.map((n) => ({
    id: n.id,
    title: n.title,
    body: n.body,
    category: n.category,
    priority: n.priority,
    publishDate: n.publishDate.toISOString(),
    imageUrl: n.imageUrl,
    createdAt: n.createdAt.toISOString(),
    updatedAt: n.updatedAt.toISOString(),
  }));

  const stats: Stats = {
    total: serialized.length,
    urgent: serialized.filter((n) => n.priority === "Urgent").length,
    exams: serialized.filter((n) => n.category === "Exam").length,
    events: serialized.filter((n) => n.category === "Event").length,
  };

  return { props: { notices: serialized, stats } };
};
