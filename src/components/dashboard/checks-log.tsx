import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "./status-badge";
import { formatMs, formatRelativeTime } from "@/lib/utils";

interface Check {
  id: string;
  status: "up" | "down" | "degraded";
  responseTimeMs: number | null;
  statusCode: number | null;
  errorMessage: string | null;
  checkedAt: Date;
}

interface ChecksLogProps {
  checks: Check[];
}

export function ChecksLog({ checks }: ChecksLogProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border-default">
          <TableHead className="text-text-secondary">Status</TableHead>
          <TableHead className="text-text-secondary">Response Time</TableHead>
          <TableHead className="text-text-secondary">Status Code</TableHead>
          <TableHead className="text-text-secondary">Checked</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {checks.map((check) => (
          <TableRow key={check.id} className="border-border-default">
            <TableCell>
              <StatusBadge status={check.status === "up" ? "operational" : check.status === "degraded" ? "degraded" : "down"} />
            </TableCell>
            <TableCell className="text-text-primary font-mono text-sm">
              {check.responseTimeMs ? formatMs(check.responseTimeMs) : "—"}
            </TableCell>
            <TableCell className="text-text-primary font-mono text-sm">
              {check.statusCode ?? "—"}
            </TableCell>
            <TableCell className="text-text-secondary text-sm">
              {formatRelativeTime(check.checkedAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
