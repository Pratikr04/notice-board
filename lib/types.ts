import type { CATEGORIES, PRIORITIES } from "./validation";

export type Category = (typeof CATEGORIES)[number];
export type Priority = (typeof PRIORITIES)[number];

// Notice shape as sent to the browser. Dates are serialized to ISO strings
// because Next.js cannot pass Date objects through getServerSideProps / JSON.
export type SerializedNotice = {
  id: string;
  title: string;
  body: string;
  category: Category;
  priority: Priority;
  publishDate: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};
