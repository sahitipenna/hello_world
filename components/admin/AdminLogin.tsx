"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [secret, setSecret] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error || "Couldn't sign in.");
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-sm paper-card rounded-2xl shadow-card p-6">
      <p className="text-sm text-ink/60 mb-4">Enter the admin secret to manage sections, content, and pricing.</p>
      <input
        type="password"
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
        placeholder="Admin secret"
        className="w-full rounded-md border border-ink/20 bg-white px-3 py-2 text-sm outline-none focus:border-terracotta mb-3"
        autoFocus
      />
      {error && <p className="text-sm text-terracotta mb-3">{error}</p>}
      <button
        type="submit"
        disabled={loading || !secret}
        className="w-full text-sm font-semibold bg-ink text-paper rounded-full px-4 py-2.5 hover:bg-ink/85 transition-colors disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
