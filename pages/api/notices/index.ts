import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { noticeInputSchema, formatZodErrors } from "@/lib/validation";

// Allow larger request bodies so an uploaded image (stored inline as a data
// URL) fits within the limit.
export const config = {
  api: {
    bodyParser: { sizeLimit: "6mb" },
  },
};

// /api/notices
//   GET  -> list every notice, Urgent first (ordering done in the DB query)
//   POST -> create a notice after server-side validation
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const notices = await prisma.notice.findMany({
        // Urgent is declared first in the Priority enum, so ascending order
        // places all Urgent notices above Normal ones. Within each group the
        // newest publishDate comes first.
        orderBy: [
          { priority: "asc" },
          { publishDate: "desc" },
          { createdAt: "desc" },
        ],
      });
      return res.status(200).json(notices);
    }

    if (req.method === "POST") {
      const parsed = noticeInputSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: formatZodErrors(parsed.error),
        });
      }

      const data = parsed.data;
      const notice = await prisma.notice.create({
        data: {
          title: data.title,
          body: data.body,
          category: data.category,
          priority: data.priority,
          publishDate: new Date(data.publishDate),
          imageUrl: data.imageUrl,
        },
      });
      return res.status(201).json(notice);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error("POST/GET /api/notices failed:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
