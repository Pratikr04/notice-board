import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        {children}
      </div>
      <footer className="mx-auto max-w-6xl px-4 pb-10 text-center text-xs text-slate-600 sm:px-6">
        Built with Next.js, Prisma &amp; Tailwind CSS · Reno Platforms
      </footer>
    </div>
  );
}
