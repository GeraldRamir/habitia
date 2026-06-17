"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useApp } from "@/context/AppContext";
import { validateEmail } from "@/lib/utils";

export default function ContactoPage() {
  const { addToast } = useApp();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const e2: Record<string, string> = {};
    if (!form.name.trim()) e2.name = "El nombre es obligatorio";
    if (!form.email.trim() || !validateEmail(form.email)) e2.email = "Email inválido";
    if (!form.message.trim()) e2.message = "El mensaje es obligatorio";
    setErrors(e2);
    if (Object.keys(e2).length > 0) return;

    addToast("Mensaje enviado. Te responderemos pronto.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-title">Contáctanos</h1>
        <p className="text-muted mt-2">Estamos aquí para ayudarte</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-3 mb-2">
              <Mail size={20} className="text-secondary" />
              <div>
                <p className="font-medium text-title">Email</p>
                <p className="text-sm text-muted">info@habitia.com</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3 mb-2">
              <Phone size={20} className="text-secondary" />
              <div>
                <p className="font-medium text-title">Teléfono</p>
                <p className="text-sm text-muted">+1 809 555 0000</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3 mb-2">
              <MapPin size={20} className="text-secondary" />
              <div>
                <p className="font-medium text-title">Oficina</p>
                <p className="text-sm text-muted">Av. Winston Churchill, Santo Domingo</p>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Nombre *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
            <Input label="Email *" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
            <Input label="Asunto" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            <div>
              <label className="text-sm font-medium text-title block mb-1.5">Mensaje *</label>
              <textarea
                className="input min-h-[120px] resize-y"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              {errors.message && <span className="text-xs text-red-500">{errors.message}</span>}
            </div>
            <Button type="submit" className="w-full">
              <Send size={16} />
              Enviar mensaje
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
