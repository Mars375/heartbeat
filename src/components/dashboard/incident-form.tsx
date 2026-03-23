"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SEVERITY_LEVELS } from "@/lib/constants";

interface Monitor {
  id: string;
  name: string;
}

interface IncidentFormProps {
  monitors: Monitor[];
}

export function IncidentForm({ monitors }: IncidentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedMonitors, setSelectedMonitors] = useState<string[]>([]);
  const [severity, setSeverity] = useState("minor");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/incidents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        message: formData.get("message"),
        severity,
        monitorIds: selectedMonitors,
      }),
    });
    if (res.ok) {
      const { id } = await res.json();
      router.push(`/incidents/${id}`);
    }
    setLoading(false);
  }

  function toggleMonitor(id: string) {
    setSelectedMonitors((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  }

  return (
    <Card className="border-border-default bg-bg-surface-1 max-w-2xl">
      <CardHeader>
        <CardTitle className="text-text-primary">Report New Incident</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-text-secondary">Title</Label>
            <Input id="title" name="title" required placeholder="API latency spike" className="bg-bg-surface-2 border-border-default" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="text-text-secondary">Initial Message</Label>
            <Textarea id="message" name="message" required placeholder="We are investigating elevated API response times..." rows={3} className="bg-bg-surface-2 border-border-default" />
          </div>
          <div className="space-y-2">
            <Label className="text-text-secondary">Severity</Label>
            <Select value={severity} onValueChange={(value) => setSeverity(value ?? "minor")}>
              <SelectTrigger className="bg-bg-surface-2 border-border-default">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SEVERITY_LEVELS.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {monitors.length > 0 && (
            <div className="space-y-2">
              <Label className="text-text-secondary">Affected Monitors</Label>
              <div className="flex flex-wrap gap-2">
                {monitors.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleMonitor(m.id)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      selectedMonitors.includes(m.id)
                        ? "border-accent-primary bg-accent-glow text-accent-primary"
                        : "border-border-default text-text-secondary hover:border-border-strong"
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          <Button type="submit" disabled={loading} className="w-full bg-accent-primary hover:bg-accent-primary-hover text-bg-primary">
            {loading ? "Creating..." : "Create Incident"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
