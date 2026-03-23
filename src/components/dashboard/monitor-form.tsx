"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { MONITOR_METHODS, PLAN_LIMITS, type PlanType } from "@/lib/constants";

interface MonitorFormProps {
  plan: PlanType;
  monitorCount: number;
  onSubmit: (data: {
    name: string;
    url: string;
    method: string;
    intervalSeconds: number;
    expectedStatus: number;
  }) => Promise<void>;
}

export function MonitorForm({ plan, monitorCount, onSubmit }: MonitorFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const limit = PLAN_LIMITS[plan].monitors;
  const atLimit = monitorCount >= limit;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await onSubmit({
      name: formData.get("name") as string,
      url: formData.get("url") as string,
      method: formData.get("method") as string,
      intervalSeconds: Number(formData.get("interval")),
      expectedStatus: Number(formData.get("expectedStatus")),
    });
    setLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button disabled={atLimit} onClick={() => setOpen(true)} className="bg-accent-primary hover:bg-accent-primary-hover text-bg-primary">
        <Plus className="mr-2 h-4 w-4" /> Add Monitor
      </Button>
      <DialogContent className="bg-bg-surface-1 border-border-default">
        <DialogHeader>
          <DialogTitle className="text-text-primary">New Monitor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-text-secondary">Name</Label>
            <Input id="name" name="name" required placeholder="My API" className="bg-bg-surface-2 border-border-default" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url" className="text-text-secondary">URL</Label>
            <Input id="url" name="url" type="url" required placeholder="https://api.example.com/health" className="bg-bg-surface-2 border-border-default" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-text-secondary">Method</Label>
              <Select name="method" defaultValue="GET">
                <SelectTrigger className="bg-bg-surface-2 border-border-default">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONITOR_METHODS.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="interval" className="text-text-secondary">Interval (s)</Label>
              <Input id="interval" name="interval" type="number" defaultValue={PLAN_LIMITS[plan].checks_interval} min={PLAN_LIMITS[plan].checks_interval} className="bg-bg-surface-2 border-border-default" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="expectedStatus" className="text-text-secondary">Expected Status</Label>
            <Input id="expectedStatus" name="expectedStatus" type="number" defaultValue={200} className="bg-bg-surface-2 border-border-default" />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-accent-primary hover:bg-accent-primary-hover text-bg-primary">
            {loading ? "Creating..." : "Create Monitor"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
