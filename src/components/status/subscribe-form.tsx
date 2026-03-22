"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface SubscribeFormProps {
  slug: string;
}

export function SubscribeForm({ slug }: SubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch(`/s/${slug}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setStatus(res.ok ? "success" : "error");
  }

  if (status === "success") {
    return <p className="text-sm text-positive text-center">Check your email to confirm your subscription.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="bg-bg-surface-2 border-border-default"
      />
      <Button type="submit" disabled={status === "loading"} className="bg-accent-primary hover:bg-accent-primary-hover text-bg-primary shrink-0">
        <Mail className="mr-2 h-4 w-4" />
        Subscribe
      </Button>
    </form>
  );
}
