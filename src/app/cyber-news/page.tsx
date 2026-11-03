import type { Metadata } from "next";
import CyberNewsFeed from "@/components/CyberNewsFeed";

export const metadata: Metadata = {
  title: "Cyber News | ISACA Student Group",
  description:
    "Articles, research insights, and technological developments published by ISACA members.",
};

export default function CyberNewsPage() {
  return <CyberNewsFeed />;
}
