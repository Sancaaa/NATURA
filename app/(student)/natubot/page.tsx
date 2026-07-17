"use client";

import { useState, useRef, useEffect } from "react";
import { AppHeader } from "@/components/student/AppHeader";
import { Bot, Send, Paperclip } from "lucide-react";
import { cn } from "@/lib/cn";

type Msg = { role: "user" | "assistant"; text: string; time: string };

const suggestions = [
  "Berikan contoh lain",
  "Apa itu Simplisia Mineral?",
  "Beda maserasi & perkolasi?",
];

function jam() {
  return new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NatuBot() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Halo! Saya NatuBot. Ada yang bisa saya bantu terkait materi Simplisia hari ini?",
      time: "09:00",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q, time: jam() }]);
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
        {
          role: "assistant",
          text: data.reply ?? "Maaf, terjadi kesalahan.",
          time: jam(),
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "Maaf, tutor sedang tidak tersedia.",
          time: jam(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader title="NatuBot" />

      <div className="flex-1 space-y-5 p-4">
        {messages.map((m, i) =>
          m.role === "assistant" ? (
            <div key={i} className="flex items-start gap-2.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-white">
                <Bot className="h-5 w-5" />
              </span>
              <div className="max-w-[80%]">
                <div className="whitespace-pre-line rounded-2xl rounded-tl-md bg-surface px-4 py-3 text-sm leading-relaxed shadow-card">
                  {m.text}
                </div>
                <div className="mt-1 pl-1 text-[11px] text-muted">
                  NatuBot · {m.time}
                </div>
              </div>
            </div>
          ) : (
            <div key={i} className="flex flex-col items-end">
              <div className="max-w-[80%] rounded-2xl rounded-tr-md bg-primary px-4 py-3 text-sm leading-relaxed text-white shadow-sm">
                {m.text}
              </div>
              <div className="mt-1 pr-1 text-[11px] text-muted">
                Anda · {m.time}
              </div>
            </div>
          ),
        )}
        {loading && (
          <div className="flex items-start gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-white">
              <Bot className="h-5 w-5" />
            </span>
            <div className="rounded-2xl rounded-tl-md bg-surface px-4 py-3 text-sm text-muted shadow-card">
              <span className="inline-flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.2s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.1s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" />
              </span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-16 z-40 border-t border-line bg-bg/90 px-4 pb-3 pt-3 backdrop-blur">
        <div className="no-scrollbar mb-2.5 flex gap-2 overflow-x-auto">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="shrink-0 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-medium text-ink hover:bg-black/[0.03]"
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
          className="flex items-center gap-2 rounded-2xl border border-line bg-surface px-2 py-1.5 focus-within:border-primary"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center text-muted">
            <Paperclip className="h-5 w-5" />
          </span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanyakan sesuatu…"
            className="h-9 flex-1 bg-transparent text-sm outline-none placeholder:text-muted/70"
          />
          <button
            type="submit"
            disabled={loading}
            aria-label="Kirim"
            className={cn(
              "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-white transition hover:bg-primary-dark disabled:opacity-50",
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
