"use client";

import { useActionState } from "react";
import { joinClass, type ActionState } from "@/lib/actions/classroom";
import { Button } from "@/components/ui/Button";

export function JoinClassForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    joinClass,
    {},
  );
  return (
    <form action={action} className="space-y-3">
      <input
        name="code"
        placeholder="Kode kelas (mis. NAT-4821)"
        required
        className="h-11 w-full rounded-xl border border-line px-3 text-sm uppercase outline-none focus:border-primary"
      />
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      {state.ok && <p className="text-sm text-success">{state.ok}</p>}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Memproses…" : "Gabung Kelas"}
      </Button>
    </form>
  );
}
