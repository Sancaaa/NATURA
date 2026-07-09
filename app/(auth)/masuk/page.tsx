"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
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
      setError("Supabase belum dikonfigurasi. Gunakan mode demo dari halaman awal.");
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <span className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-primary text-white">
          <Leaf className="h-8 w-8" />
        </span>
        <h1 className="text-2xl font-extrabold">Masuk ke NATURA</h1>
      </div>

      {!isSupabaseConfigured && (
        <div className="rounded-xl border border-accent/40 bg-accent/10 p-3 text-sm">
          Mode demo aktif (Supabase belum dikonfigurasi).{" "}
          <Link href="/" className="font-semibold text-primary underline">
            Kembali ke pemilihan peran
          </Link>
          .
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-3">
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          required
        />
        <TextField
          label="Kata sandi"
          type="password"
          value={password}
          onChange={setPassword}
          required
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Memproses…" : "Masuk"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted">
        Belum punya akun?{" "}
        <Link href="/daftar" className="font-semibold text-primary">
          Daftar
        </Link>
      </p>
    </div>
  );
}
