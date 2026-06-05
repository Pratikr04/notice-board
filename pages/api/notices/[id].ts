import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { noticeInputSchema, formatZodErrors } from "@/lib/validation";

// Allow larger request bodies so an updated image (stored inline as a data
// URL) fits within the limit.
export const config = {
  api: {
    bodyParser: { sizeLimit: "6mb" },
  },
};

// /api/notices/[id]
//   GET    -> read a single notice
//   PUT    -> update a notice after server-side validation
//   DELETE -> delete a notice
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid notice id" });
  }

  try {
    if (req.method === "GET") {
      const notice = await prisma.notice.findUnique({ where: { id } });
      if (!notice) {
        return res.status(404).json({ message: "Notice not found" });
      }
      return res.status(200).json(notice);
    }

    if (req.method === "PUT") {
      const parsed = noticeInputSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: formatZodErrors(parsed.error),
        });
      }

      const data = parsed.data;
      const notice = await prisma.notice.update({
        where: { id },
        data: {
          title: data.title,
          body: data.body,
          category: data.category,
          priority: data.priority,
          publishDate: new Date(data.publishDate),
          imageUrl: data.imageUrl,
        },
      });
      return res.status(200).json(notice);
    }

    if (req.method === "DELETE") {
      await prisma.notice.delete({ where: { id } });
      return res.status(204).end();
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  } catch (error) {
    // P2025 = record to update/delete was not found.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({ message: "Notice not found" });
    }
    console.error(`${req.method} /api/notices/${id} failed:`, error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
