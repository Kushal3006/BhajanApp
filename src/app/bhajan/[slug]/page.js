import { notFound } from "next/navigation";
import BhajanDetail from "@/components/BhajanDetail";
import {
  getPublishedBhajanBySlug,
  getPublishedBhajans,
} from "@/lib/bhajanRepository";

export async function generateStaticParams() {
  const bhajans = await getPublishedBhajans();
  return bhajans.map((bhajan) => ({ slug: bhajan.slug }));
}

export default async function BhajanDetailPage({ params }) {
  const { slug } = await params;
  const bhajan = await getPublishedBhajanBySlug(slug);

  if (!bhajan) {
    notFound();
  }

  return <BhajanDetail bhajan={bhajan} />;
}
