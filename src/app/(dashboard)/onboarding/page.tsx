"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await fetch("/api/organizations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        slug: formData.get("slug"),
      }),
    });
    router.push("/monitors");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary p-4">
      <Card className="w-full max-w-md border-border-default bg-bg-surface-1">
        <CardHeader className="text-center">
          <Heart className="mx-auto h-10 w-10 text-accent-primary mb-2" fill="currentColor" />
          <CardTitle className="text-2xl text-text-primary">Welcome to Heartbeat</CardTitle>
          <p className="text-text-secondary">Create your organization to get started.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-text-secondary">Organization Name</Label>
              <Input id="name" name="name" required placeholder="Acme Inc." className="bg-bg-surface-2 border-border-default" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-text-secondary">URL Slug</Label>
              <Input id="slug" name="slug" required placeholder="acme" pattern="^[a-z0-9-]+$" className="bg-bg-surface-2 border-border-default" />
              <p className="text-xs text-text-tertiary">Used for your status page URL: /s/acme</p>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-accent-primary hover:bg-accent-primary-hover text-bg-primary">
              {loading ? "Creating..." : "Create Organization"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
