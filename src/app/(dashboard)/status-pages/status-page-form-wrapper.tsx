"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface Props {
  orgId: string;
  monitors: { id: string; name: string }[];
}

export function StatusPageFormWrapper({ orgId, monitors }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedMonitors, setSelectedMonitors] = useState<string[]>([]);
  const router = useRouter();

  function toggleMonitor(id: string) {
    setSelectedMonitors((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await fetch("/api/status-pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orgId,
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
        brandingColor: formData.get("brandingColor") as string || undefined,
        monitorIds: selectedMonitors,
      }),
    });
    setLoading(false);
    setOpen(false);
    setSelectedMonitors([]);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)} className="bg-accent-primary hover:bg-accent-primary-hover text-bg-primary">
        <Plus className="mr-2 h-4 w-4" /> New Status Page
      </Button>
      <DialogContent className="bg-bg-surface-1 border-border-default">
        <DialogHeader>
          <DialogTitle className="text-text-primary">New Status Page</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-text-secondary">Name</Label>
            <Input id="name" name="name" required placeholder="My Status Page" className="bg-bg-surface-2 border-border-default" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug" className="text-text-secondary">Slug</Label>
            <div className="flex items-center gap-1">
              <span className="text-text-tertiary text-sm">/s/</span>
              <Input
                id="slug"
                name="slug"
                required
                placeholder="my-service"
                pattern="[a-z0-9-]+"
                title="Lowercase letters, numbers and hyphens only"
                className="bg-bg-surface-2 border-border-default"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="brandingColor" className="text-text-secondary">Branding Color</Label>
            <div className="flex items-center gap-2">
              <Input id="brandingColor" name="brandingColor" type="color" defaultValue="#10B981" className="w-12 h-9 p-1 bg-bg-surface-2 border-border-default cursor-pointer" />
              <span className="text-xs text-text-tertiary">Accent color on public page</span>
            </div>
          </div>
          {monitors.length > 0 && (
            <div className="space-y-2">
              <Label className="text-text-secondary">Monitors</Label>
              <div className="space-y-1 max-h-40 overflow-y-auto rounded border border-border-default p-2">
                {monitors.map((m) => (
                  <label key={m.id} className="flex items-center gap-2 cursor-pointer py-1 px-2 rounded hover:bg-bg-surface-2">
                    <input
                      type="checkbox"
                      checked={selectedMonitors.includes(m.id)}
                      onChange={() => toggleMonitor(m.id)}
                      className="accent-accent-primary"
                    />
                    <span className="text-sm text-text-primary">{m.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          <Button type="submit" disabled={loading} className="w-full bg-accent-primary hover:bg-accent-primary-hover text-bg-primary">
            {loading ? "Creating..." : "Create Status Page"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
