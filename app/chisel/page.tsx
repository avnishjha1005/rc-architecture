import { notFound } from "next/navigation";
import { HostedChisel } from "use-chisel/hosted";

export default function ChiselPage() {
  const enabled = process.env.CHISEL_ENABLED === undefined ? process.env.NODE_ENV !== "production" : process.env.CHISEL_ENABLED === "1";
  if (!enabled) notFound();
  return <HostedChisel projectId="edfaba4e-b1e2-4da4-8a39-79b307806fe2" />;
}
