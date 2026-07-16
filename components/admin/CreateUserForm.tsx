"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, ChevronDown } from "lucide-react";
import { createUser } from "@/lib/actions/admin";
import { Card } from "@/components/ui/Card";
import { buttonClass } from "@/components/ui/Button";
import { Field, TextInput, inputCls } from "@/components/admin/formFields";

const empty = { nama: "", email: "", password: "", role: "student" };

export function CreateUserForm() {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState(empty);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const set = (patch: Partial<typeof empty>) => setF((p) => ({ ...p, ...patch }));

  const submit = () => {
    setErr(null);
    setOk(null);
    startTransition(async () => {
      const res = await createUser(f);
      if (res.error) {
        setErr(res.error);
        return;
      }
      setOk(`Akun ${f.email} dibuat.`);
      setF(empty);
      router.refresh();
    });
  };

  return (
    <Card className="p-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left font-semibold"
      >
        <UserPlus className="h-4 w-4 text-primary" />
        Tambah Pengguna
        <ChevronDown
          className={`ml-auto h-4 w-4 text-muted transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="space-y-4 border-t border-line p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nama">
              <TextInput
                value={f.nama}
                onChange={(e) => set({ nama: e.target.value })}
                placeholder="Nama lengkap"
              />
            </Field>
            <Field label="Email *">
              <TextInput
                type="email"
                value={f.email}
                onChange={(e) => set({ email: e.target.value })}
                placeholder="nama@contoh.sch.id"
              />
            </Field>
            <Field label="Kata sandi *" hint="Minimal 6 karakter">
              <TextInput
                type="password"
                value={f.password}
                onChange={(e) => set({ password: e.target.value })}
                placeholder="••••••"
              />
            </Field>
            <Field label="Peran">
              <select
                value={f.role}
                onChange={(e) => set({ role: e.target.value })}
                className={inputCls}
              >
                <option value="student">Murid</option>
                <option value="teacher">Guru</option>
                <option value="admin">Admin</option>
              </select>
            </Field>
          </div>

          {err && (
            <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
              {err}
            </p>
          )}
          {ok && (
            <p className="rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
              {ok}
            </p>
          )}

          <button
            type="button"
            onClick={submit}
            disabled={pending}
            className={buttonClass("primary", "md")}
          >
            {pending ? "Membuat…" : "Buat Akun"}
          </button>
        </div>
      )}
    </Card>
  );
}
