"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Send } from "lucide-react";
import { cn } from "@/lib/cn";

type Msg = { role: "user" | "assistant"; text: string };

const suggestions = [
  "Apa itu simplisia?",
  "Kandungan utama kunyit?",
  "Beda maserasi dan perkolasi?",
];

export default function NatuBot() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Halo! Aku NatuBot, tutor Farmakognosi-mu. Mau tanya apa tentang simplisia, tanaman obat, atau prosedur lab?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setLoading(true);
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", text: data.reply ?? "Maaf, terjadi kesalahan." },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Maaf, tutor sedang tidak tersedia." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pb-4">
      <PageHeader title="NatuBot" />

      <div className="space-y-3 p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[85%] rounded-2xl px-4 py-2 text-sm",
              m.role === "user"
                ? "ml-auto bg-primary text-white"
                : "border border-line bg-surface",
            )}
          >
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="w-16 rounded-2xl border border-line bg-surface px-4 py-2 text-sm text-muted">
            …
          </div>
        )}
      </div>

      <div className="sticky bottom-16 z-40 border-t border-line bg-surface p-3">
        <div className="mb-2 flex gap-2 overflow-x-auto">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tulis pertanyaan…"
            className="h-11 flex-1 rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-primary"
          />
          <Button type="submit" disabled={loading} aria-label="Kirim">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
