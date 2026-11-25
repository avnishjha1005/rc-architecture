import { notFound } from "next/navigation";
import { HostedChisel } from "@/components/chisel/ReviewClient";
import project from "@/.chisel.json";

export const dynamic = "force-dynamic";
export const metadata = { title: "Review — RC Architecture", robots: { index: false, follow: false } };

export default function ChiselPage() {
  if (process.env.CHISEL_ENABLED !== "1") notFound();
  return <HostedChisel projectId={project.projectId} />;
}
