import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getIncidentById, getIncidentUpdates } from "@/lib/db/queries";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IncidentTimeline } from "@/components/dashboard/incident-timeline";
import { Badge } from "@/components/ui/badge";

export default async function IncidentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { orgId } = await requireAuth();
  const incident = await getIncidentById(id, orgId);
  if (!incident) notFound();

  const updates = await getIncidentUpdates(id);

  return (
    <div>
      <Topbar title={incident.title} />
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="capitalize">{incident.severity}</Badge>
          <Badge variant="outline" className="capitalize">{incident.status}</Badge>
        </div>

        <Card className="border-border-default bg-bg-surface-1">
          <CardHeader><CardTitle className="text-text-primary">Timeline</CardTitle></CardHeader>
          <CardContent>
            <IncidentTimeline updates={updates} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
