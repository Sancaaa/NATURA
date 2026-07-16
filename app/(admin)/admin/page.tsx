import { getAllUsers, adminStats } from "@/lib/db/admin";
import { getCurrentProfile } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { RoleSelect } from "@/components/admin/RoleSelect";
import { DeleteUserButton } from "@/components/admin/DeleteUserButton";
import { CreateUserForm } from "@/components/admin/CreateUserForm";
import { Users, GraduationCap, ShieldCheck, User } from "lucide-react";

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <Card className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </span>
      <div>
        <div className="text-xl font-bold">{value}</div>
        <div className="text-xs text-muted">{label}</div>
      </div>
    </Card>
  );
}

const roleLabel: Record<string, string> = {
  student: "Murid",
  teacher: "Guru",
  admin: "Admin",
};

export default async function AdminPage() {
  const users = await getAllUsers();
  const me = await getCurrentProfile();
  const s = adminStats(users);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Kelola Pengguna</h1>
        <p className="text-sm text-muted">
          Atur peran tiap akun. Peran menentukan hak akses (murid/guru/admin).
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat icon={<Users className="h-5 w-5" />} label="Total akun" value={s.total} />
        <Stat icon={<GraduationCap className="h-5 w-5" />} label="Murid" value={s.murid} />
        <Stat icon={<User className="h-5 w-5" />} label="Guru" value={s.guru} />
        <Stat icon={<ShieldCheck className="h-5 w-5" />} label="Admin" value={s.admin} />
      </div>

      <CreateUserForm />

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black/5 text-left text-xs uppercase text-muted">
              <tr>
                <th className="p-3">Nama</th>
                <th className="p-3">Email</th>
                <th className="p-3">Peran</th>
                <th className="p-3">Ubah peran</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-muted">
                    Belum ada akun.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-black/[0.02]">
                    <td className="p-3 font-medium">{u.nama || "—"}</td>
                    <td className="p-3 text-muted">{u.email || "—"}</td>
                    <td className="p-3">
                      <Badge
                        tone={
                          u.role === "admin"
                            ? "danger"
                            : u.role === "teacher"
                              ? "primary"
                              : "muted"
                        }
                      >
                        {roleLabel[u.role] ?? u.role}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <RoleSelect userId={u.id} role={u.role} />
                    </td>
                    <td className="p-3">
                      {me?.id === u.id ? (
                        <span className="text-xs text-muted">(Anda)</span>
                      ) : (
                        <DeleteUserButton
                          userId={u.id}
                          nama={u.nama || u.email || "akun"}
                        />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
