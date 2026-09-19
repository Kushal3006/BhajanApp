import BrowseContent from "@/components/BrowseContent";
import { getCategories, getPublishedBhajans } from "@/lib/bhajanRepository";

export default async function BrowsePage() {
  const [bhajans, categoryRecords] = await Promise.all([
    getPublishedBhajans(),
    getCategories(),
  ]);
  const categories = ["All", ...categoryRecords.map((category) => category.name)];

  return <BrowseContent bhajans={bhajans} categories={categories} />;
}
