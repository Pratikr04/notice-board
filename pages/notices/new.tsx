import Head from "next/head";
import Link from "next/link";
import { ArrowLeft, Megaphone } from "lucide-react";
import Layout from "@/components/Layout";
import NoticeForm from "@/components/NoticeForm";

export default function NewNoticePage() {
  return (
    <Layout>
      <Head>
        <title>Create Notice | Reno Platforms</title>
      </Head>

      <header className="flex items-center gap-4">
        <Link
          href="/"
          aria-label="Back to notices"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.02] text-slate-300 transition hover:bg-white/5"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
            <Megaphone className="h-3.5 w-3.5" />
            Notice Board
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="text-gradient">Publish New Notice</span>
          </h1>
        </div>
      </header>

      <div className="mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 shadow-sm backdrop-blur-sm sm:p-8">
        <NoticeForm />
      </div>
    </Layout>
  );
}
