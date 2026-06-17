"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { updateUser } from "@/lib/storage";
import { useApp } from "@/context/AppContext";
import { BadgeCheck } from "lucide-react";

export default function ConfiguracionPage() {
  const { user, allowed } = useAuthGuard(["seller"]);
  const { setUser, addToast } = useApp();
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    email: user?.email || "",
  });

  if (!allowed || !user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateUser(user.id, form);
    if (updated) {
      const { password: _, ...safe } = updated;
      setUser(safe as typeof user);
      addToast("Perfil actualizado");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-title">Configuración</h1>
        <p className="text-muted">Administra tu perfil de vendedor</p>
      </div>

      <div className="max-w-lg space-y-6">
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-white text-xl font-bold">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div>
              <p className="font-semibold text-title">{user.firstName} {user.lastName}</p>
              <p className="text-sm text-muted">{user.email}</p>
              {user.verified ? (
                <span className="flex items-center gap-1 text-xs text-success mt-1">
                  <BadgeCheck size={14} />
                  Vendedor verificado
                </span>
              ) : (
                <span className="text-xs text-warning mt-1">Verificación pendiente</span>
              )}
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Nombre" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
              <Input label="Apellido" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
            <Input label="Email" type="email" value={form.email} disabled />
            <Input label="Teléfono" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Button type="submit">Guardar cambios</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
