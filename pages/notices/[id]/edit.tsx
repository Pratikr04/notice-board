import type { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { ArrowLeft, Megaphone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Layout from "@/components/Layout";
import NoticeForm from "@/components/NoticeForm";
import type { SerializedNotice } from "@/lib/types";

type EditPageProps = {
  notice: SerializedNotice;
};

export default function EditNoticePage({ notice }: EditPageProps) {
  return (
    <Layout>
      <Head>
        <title>Edit Notice | Reno Platforms</title>
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
            <span className="text-gradient">Edit Notice</span>
          </h1>
        </div>
      </header>

      <div className="mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 shadow-sm backdrop-blur-sm sm:p-8">
        <NoticeForm initialNotice={notice} />
      </div>
    </Layout>
  );
}

// Load the notice's current values on the server so the form is pre-filled.
export const getServerSideProps: GetServerSideProps<EditPageProps> = async (
  context
) => {
  const id = context.params?.id;
  if (typeof id !== "string") {
    return { notFound: true };
  }

  const notice = await prisma.notice.findUnique({ where: { id } });
  if (!notice) {
    return { notFound: true };
  }

  return {
    props: {
      notice: {
        id: notice.id,
        title: notice.title,
        body: notice.body,
        category: notice.category,
        priority: notice.priority,
        publishDate: notice.publishDate.toISOString(),
        imageUrl: notice.imageUrl,
        createdAt: notice.createdAt.toISOString(),
        updatedAt: notice.updatedAt.toISOString(),
      },
    },
  };
};
