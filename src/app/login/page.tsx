"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getUserByEmail } from "@/lib/storage";
import { useApp } from "@/context/AppContext";

export default function LoginPage() {
  const { setUser, addToast } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const user = getUserByEmail(email.trim());
    if (!user || user.password !== password) {
      setError("Email o contraseña incorrectos");
      setLoading(false);
      return;
    }

    const { password: _, ...safeUser } = user;
    setUser(safeUser as typeof user);
    addToast(`Bienvenido, ${user.firstName}!`);

    if (user.role === "admin") router.push("/admin");
    else if (user.role === "seller") router.push("/dashboard");
    else router.push("/propiedades");

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-title">Iniciar sesión</h1>
        <p className="text-muted mt-2">Accede a tu cuenta de habitia</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
          />
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </Button>
        </form>

        <div className="mt-6 p-4 rounded-xl bg-black/5 dark:bg-white/5">
          <p className="text-xs font-medium text-title mb-2">Cuentas demo:</p>
          <div className="text-xs text-muted space-y-1">
            <p>admin@habitia.com / Admin123!</p>
            <p>maria@habitia.com / Vendedor123!</p>
            <p>carlos@habitia.com / Vendedor123!</p>
            <p>ana@habitia.com / Comprador123!</p>
          </div>
        </div>

        <p className="text-center text-sm text-muted mt-6">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="text-secondary hover:underline font-medium">
            Registrarse
          </Link>
        </p>
      </Card>
    </div>
  );
}
