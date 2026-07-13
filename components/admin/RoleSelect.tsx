"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateUserRole } from "@/lib/actions/admin";

export function RoleSelect({
  userId,
  role,
}: {
  userId: string;
  role: string;
}) {
  const [val, setVal] = useState(role);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <select
      value={val}
      disabled={pending}
      onChange={(e) => {
        const r = e.target.value;
        setVal(r);
        startTransition(async () => {
          await updateUserRole(userId, r);
          router.refresh();
        });
      }}
      className="h-9 rounded-lg border border-line bg-white px-2 text-sm outline-none focus:border-primary disabled:opacity-50"
    >
      <option value="student">Murid</option>
      <option value="teacher">Guru</option>
      <option value="admin">Admin</option>
    </select>
  );
}
