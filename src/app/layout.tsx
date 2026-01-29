import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IMAGO - 让线上的连接走向真实的行动",
  description: "IMAGO 以线下聚合为核心，顺应互联网时代，重塑社区级周辺生活",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
