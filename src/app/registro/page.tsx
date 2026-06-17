"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createUser, getUserByEmail } from "@/lib/storage";
import { validateEmail, validatePhone } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import type { UserRole } from "@/lib/types";
import { Building2, ShoppingBag } from "lucide-react";

export default function RegistroPage() {
  const { setUser, addToast } = useApp();
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("buyer");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "El nombre es obligatorio";
    if (!form.lastName.trim()) e.lastName = "El apellido es obligatorio";
    if (!form.email.trim()) e.email = "El email es obligatorio";
    else if (!validateEmail(form.email)) e.email = "Email inválido";
    else if (getUserByEmail(form.email)) e.email = "Este email ya está registrado";
    if (!form.phone.trim()) e.phone = "El teléfono es obligatorio";
    else if (!validatePhone(form.phone)) e.phone = "Teléfono inválido";
    if (!form.password) e.password = "La contraseña es obligatoria";
    else if (form.password.length < 8) e.password = "Mínimo 8 caracteres";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Las contraseñas no coinciden";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const user = createUser({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      password: form.password,
      role,
    });

    const { password: _, ...safeUser } = user;
    setUser(safeUser as typeof user);
    addToast("¡Cuenta creada exitosamente!");
    setLoading(false);

    if (role === "seller") router.push("/dashboard");
    else router.push("/propiedades");
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-title">Crear cuenta</h1>
        <p className="text-muted mt-2">Únete a habitia - InmoConnect</p>
      </div>

      <Card>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setRole("buyer")}
            className={`p-4 rounded-xl border-2 text-center transition-colors ${
              role === "buyer" ? "border-secondary bg-secondary/5" : "border-transparent bg-black/5 dark:bg-white/5"
            }`}
          >
            <ShoppingBag size={24} className={`mx-auto mb-2 ${role === "buyer" ? "text-secondary" : "text-muted"}`} />
            <p className="font-medium text-sm text-title">Comprador / Inquilino</p>
          </button>
          <button
            type="button"
            onClick={() => setRole("seller")}
            className={`p-4 rounded-xl border-2 text-center transition-colors ${
              role === "seller" ? "border-secondary bg-secondary/5" : "border-transparent bg-black/5 dark:bg-white/5"
            }`}
          >
            <Building2 size={24} className={`mx-auto mb-2 ${role === "seller" ? "text-secondary" : "text-muted"}`} />
            <p className="font-medium text-sm text-title">Vendedor</p>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nombre *" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} error={errors.firstName} />
            <Input label="Apellido *" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} error={errors.lastName} />
          </div>
          <Input label="Email *" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
          <Input label="Teléfono *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} error={errors.phone} placeholder="+1 809 555 0000" />
          <Input label="Contraseña *" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} />
          <Input label="Confirmar contraseña *" type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} error={errors.confirmPassword} />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creando cuenta..." : "Registrarse"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-secondary hover:underline font-medium">
            Iniciar sesión
          </Link>
        </p>
      </Card>
    </div>
  );
}
