"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";

function RoleBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "h-11 rounded-xl border-2 border-primary bg-primary/10 text-sm font-semibold text-primary"
          : "h-11 rounded-xl border border-line text-sm font-medium text-muted"
      }
    >
      {children}
    </button>
  );
}

export default function Daftar() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setError("Supabase belum dikonfigurasi. Gunakan mode demo dari halaman awal.");
      return;
    }
    setLoading(true);
    setError(null);
    setNotice(null);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nama, role } },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data.session) {
      router.push("/");
      router.refresh();
    } else {
      setNotice(
        "Akun dibuat. Konfirmasi email bila diaktifkan, lalu masuk.",
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <span className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-primary text-white">
          <Leaf className="h-8 w-8" />
        </span>
        <h1 className="text-2xl font-extrabold">Daftar NATURA</h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <TextField label="Nama" value={nama} onChange={setNama} required />
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
        <div>
          <span className="mb-1 block text-sm font-medium">Peran</span>
          <div className="grid grid-cols-2 gap-2">
            <RoleBtn
              active={role === "student"}
              onClick={() => setRole("student")}
            >
              Siswa
            </RoleBtn>
            <RoleBtn
              active={role === "teacher"}
              onClick={() => setRole("teacher")}
            >
              Guru
            </RoleBtn>
          </div>
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        {notice && <p className="text-sm text-success">{notice}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Memproses…" : "Daftar"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted">
        Sudah punya akun?{" "}
        <Link href="/masuk" className="font-semibold text-primary">
          Masuk
        </Link>
      </p>
    </div>
  );
}
