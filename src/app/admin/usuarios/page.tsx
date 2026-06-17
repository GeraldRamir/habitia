"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Shield } from "lucide-react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { getUsers, updateUser } from "@/lib/storage";
import { useApp } from "@/context/AppContext";
import type { User } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

export default function AdminUsuariosPage() {
  const { allowed } = useAuthGuard(["admin"]);
  const { addToast } = useApp();
  const [users, setUsers] = useState<User[]>([]);

  const load = () => setUsers(getUsers());

  useEffect(() => { load(); }, []);

  const toggleVerify = (id: string, verified: boolean) => {
    updateUser(id, { verified: !verified });
    addToast(verified ? "Verificación removida" : "Usuario verificado");
    load();
  };

  const roleLabel = (role: string) => {
    if (role === "admin") return "Admin";
    if (role === "seller") return "Vendedor";
    return "Comprador";
  };

  if (!allowed) return null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-title">Usuarios</h1>
        <p className="text-muted">{users.length} usuarios registrados</p>
      </div>

      <div className="card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5">
                <th className="text-left p-4 text-sm font-medium text-muted">Nombre</th>
                <th className="text-left p-4 text-sm font-medium text-muted">Email</th>
                <th className="text-left p-4 text-sm font-medium text-muted">Rol</th>
                <th className="text-left p-4 text-sm font-medium text-muted">Estado</th>
                <th className="text-left p-4 text-sm font-medium text-muted">Registro</th>
                <th className="text-left p-4 text-sm font-medium text-muted">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-black/5 dark:border-white/5">
                  <td className="p-4 text-sm font-medium text-title">{u.firstName} {u.lastName}</td>
                  <td className="p-4 text-sm text-muted">{u.email}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                      {roleLabel(u.role)}
                    </span>
                  </td>
                  <td className="p-4">
                    {u.role === "seller" ? (
                      u.verified ? (
                        <span className="flex items-center gap-1 text-xs text-success">
                          <BadgeCheck size={14} /> Verificado
                        </span>
                      ) : (
                        <span className="text-xs text-warning">Pendiente</span>
                      )
                    ) : (
                      <span className="text-xs text-muted">—</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-muted">{formatDate(u.createdAt)}</td>
                  <td className="p-4">
                    {u.role === "seller" && (
                      <Button variant="outline" size="sm" onClick={() => toggleVerify(u.id, u.verified)}>
                        {u.verified ? "Quitar verificación" : "Verificar"}
                      </Button>
                    )}
                    {u.role === "admin" && (
                      <Shield size={16} className="text-secondary" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
