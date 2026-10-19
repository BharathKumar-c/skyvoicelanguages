import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Aira mascot demo",
  robots: { index: false, follow: false },
};

/** Development reference only: production visitors get the 404 page. */
export default function MascotDemoLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "production") notFound();
  return children;
}
