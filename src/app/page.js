import HomeContent from "@/components/HomeContent";
import { getPublishedBhajans } from "@/lib/bhajanRepository";

export default async function Home() {
  const bhajans = await getPublishedBhajans();

  return <HomeContent bhajans={bhajans} />;
}
