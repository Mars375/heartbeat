"use client";

import { MonitorForm } from "@/components/dashboard/monitor-form";
import { useRouter } from "next/navigation";
import type { PlanType } from "@/lib/constants";

interface Props {
  orgId: string;
  plan: PlanType;
  monitorCount: number;
}

export function MonitorFormWrapper({ orgId, plan, monitorCount }: Props) {
  const router = useRouter();

  async function handleCreate(data: {
    name: string;
    url: string;
    method: string;
    intervalSeconds: number;
    expectedStatus: number;
  }) {
    await fetch("/api/monitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, orgId }),
    });
    router.refresh();
  }

  return <MonitorForm plan={plan} monitorCount={monitorCount} onSubmit={handleCreate} />;
}
