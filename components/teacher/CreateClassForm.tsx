"use client";

import { useActionState } from "react";
import { createClass, type ActionState } from "@/lib/actions/classroom";
import { Button } from "@/components/ui/Button";

export function CreateClassForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    createClass,
    {},
  );
  return (
    <form action={action} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="nama"
          placeholder="Nama kelas (mis. XI Farmasi A)"
          required
          className="h-11 rounded-xl border border-line px-3 text-sm outline-none focus:border-primary"
        />
        <input
          name="tahun_ajaran"
          placeholder="Tahun ajaran (mis. 2025/2026)"
          className="h-11 rounded-xl border border-line px-3 text-sm outline-none focus:border-primary"
        />
      </div>
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      {state.ok && <p className="text-sm text-success">{state.ok}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Menyimpan…" : "Buat Kelas"}
      </Button>
    </form>
  );
}
