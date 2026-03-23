import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getStatusPageWithMonitors, getMonitors } from "@/lib/db/queries";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { StatusPageMonitorManager } from "./monitor-manager";

export default async function StatusPageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { orgId } = await requireAuth();

  const [result, allMonitors] = await Promise.all([
    getStatusPageWithMonitors(id, orgId),
    getMonitors(orgId),
  ]);

  if (!result) notFound();

  const { page, monitors } = result;
  const linkedIds = new Set(monitors.map((m) => m.id));
  const availableMonitors = allMonitors.map((m) => ({ id: m.id, name: m.name, linked: linkedIds.has(m.id) }));

  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL}/s/${page.slug}`;

  return (
    <div>
      <Topbar title={page.name} />
      <div className="p-6 space-y-6">

        <Card className="border-border-default bg-bg-surface-1">
          <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-text-primary font-medium">{page.name}</h2>
                {page.isPublic ? (
                  <Badge variant="outline" className="bg-positive/15 text-positive border-positive/30">Public</Badge>
                ) : (
                  <Badge variant="outline" className="text-text-secondary">Private</Badge>
                )}
              </div>
              <p className="text-xs text-text-secondary font-mono">/s/{page.slug}</p>
            </div>
            <Link
              href={publicUrl}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-sm text-accent-primary hover:underline"
            >
              View public page <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border-default bg-bg-surface-1">
          <CardHeader>
            <CardTitle className="text-text-primary">Monitors</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusPageMonitorManager pageId={page.id} monitors={availableMonitors} />
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
