"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface Monitor {
  id: string;
  name: string;
  linked: boolean;
}

interface Props {
  pageId: string;
  monitors: Monitor[];
}

export function StatusPageMonitorManager({ pageId, monitors }: Props) {
  const [pending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  async function toggle(monitorId: string, currentlyLinked: boolean) {
    setLoadingId(monitorId);
    await fetch(`/api/status-pages/${pageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: currentlyLinked ? "remove" : "add", monitorId }),
    });
    setLoadingId(null);
    startTransition(() => router.refresh());
  }

  const linked = monitors.filter((m) => m.linked);
  const available = monitors.filter((m) => !m.linked);

  if (monitors.length === 0) {
    return (
      <p className="text-sm text-text-tertiary">No monitors in your organization yet.</p>
    );
  }

  return (
    <div className="space-y-4">
      {linked.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-text-tertiary uppercase tracking-wide">Shown on this page</p>
          {linked.map((m) => (
            <div key={m.id} className="flex items-center justify-between py-2 px-3 rounded border border-border-default bg-bg-surface-2">
              <span className="text-sm text-text-primary">{m.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-text-tertiary hover:text-critical hover:bg-critical/10"
                disabled={loadingId === m.id || pending}
                onClick={() => toggle(m.id, true)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {available.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-text-tertiary uppercase tracking-wide">Add monitor</p>
          {available.map((m) => (
            <div key={m.id} className="flex items-center justify-between py-2 px-3 rounded border border-border-default border-dashed">
              <span className="text-sm text-text-secondary">{m.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-text-tertiary hover:text-accent-primary hover:bg-accent-glow"
                disabled={loadingId === m.id || pending}
                onClick={() => toggle(m.id, false)}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
