"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy, Key, Plus, Trash2 } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  lastUsedAt: Date | null;
  createdAt: Date;
}

interface ApiKeyManagerProps {
  keys: ApiKey[];
}

export function ApiKeyManager({ keys: initialKeys }: ApiKeyManagerProps) {
  const [keys, setKeys] = useState(initialKeys);
  const [newKeyName, setNewKeyName] = useState("");
  const [revealedKey, setRevealedKey] = useState<string | null>(null);

  async function handleCreate() {
    if (!newKeyName.trim()) return;
    const res = await fetch("/api/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newKeyName }),
    });
    const data = await res.json();
    setRevealedKey(data.rawKey);
    setKeys((prev) => [data.key, ...prev]);
    setNewKeyName("");
  }

  return (
    <Card className="border-border-default bg-bg-surface-1">
      <CardHeader>
        <CardTitle className="text-text-primary flex items-center gap-2">
          <Key className="h-5 w-5" /> API Keys
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {revealedKey && (
          <div className="rounded-lg border border-accent-primary/30 bg-accent-glow p-4 space-y-2">
            <p className="text-sm text-accent-primary font-medium">Copy your API key now — it won't be shown again.</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded bg-bg-surface-2 px-3 py-2 text-sm font-mono text-text-primary">{revealedKey}</code>
              <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(revealedKey)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Input
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Key name (e.g. CI/CD)"
            className="bg-bg-surface-2 border-border-default"
          />
          <Button onClick={handleCreate} className="bg-accent-primary hover:bg-accent-primary-hover text-bg-primary shrink-0">
            <Plus className="mr-2 h-4 w-4" /> Create
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-border-default">
              <TableHead className="text-text-secondary">Name</TableHead>
              <TableHead className="text-text-secondary">Key</TableHead>
              <TableHead className="text-text-secondary">Last Used</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {keys.map((key) => (
              <TableRow key={key.id} className="border-border-default">
                <TableCell className="text-text-primary">{key.name}</TableCell>
                <TableCell className="text-text-secondary font-mono text-sm">{key.keyPrefix}</TableCell>
                <TableCell className="text-text-secondary text-sm">
                  {key.lastUsedAt ? formatRelativeTime(key.lastUsedAt) : "Never"}
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="ghost" className="text-negative hover:text-negative">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
