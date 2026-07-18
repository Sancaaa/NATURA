"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { Logo } from "@/components/ui/Logo";
import { GoogleMark } from "@/components/ui/GoogleMark";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";

export default function Masuk() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setError("Layanan belum tersedia. Kembali ke halaman awal untuk mode pratinjau.");
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div>
      <Logo size={52} className="mb-6" />
      <h1 className="text-3xl font-extrabold tracking-tight">Selamat datang</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Masukkan email dan password anda untuk melanjutkan.
      </p>

      {!isSupabaseConfigured && (
        <div className="mt-5 rounded-2xl border border-accent/40 bg-accent/10 p-3 text-sm">
          Mode pratinjau aktif.{" "}
          <Link href="/" className="font-semibold text-primary underline">
            Kembali ke pemilihan peran
          </Link>
          .
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-7 space-y-4">
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="nama@email.com"
          required
        />
        <div>
          <TextField
            label="Kata Sandi"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            required
          />
          <div className="mt-1.5 text-right">
            <Link
              href="/masuk"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Lupa Sandi?
            </Link>
          </div>
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Memproses…" : "Masuk"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-line" />
        Atau masuk dengan
        <span className="h-px flex-1 bg-line" />
      </div>

      <button
        type="button"
        onClick={() =>
          setError("Masuk dengan Google belum tersedia.")
        }
        className="flex h-12 w-full items-center justify-center gap-2.5 rounded-2xl border border-line bg-surface text-sm font-semibold transition hover:bg-black/[0.03]"
      >
        <GoogleMark className="h-5 w-5" />
        Google
      </button>

      <p className="mt-6 text-center text-sm text-muted">
        Belum punya akun?{" "}
        <Link href="/daftar" className="font-semibold text-primary">
          Daftar
        </Link>
      </p>
    </div>
  );
}
