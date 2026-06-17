import Link from "next/link";
import { Building2, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                <Building2 size={20} />
              </div>
              <div>
                <span className="font-bold text-lg">InmoConnect</span>
                <span className="text-xs text-gray-400 block -mt-1">habitia</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Tu plataforma inmobiliaria de confianza en República Dominicana.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/propiedades" className="hover:text-white transition-colors">Propiedades</Link></li>
              <li><Link href="/publicar" className="hover:text-white transition-colors">Publicar</Link></li>
              <li><Link href="/favoritos" className="hover:text-white transition-colors">Favoritos</Link></li>
              <li><Link href="/comparador" className="hover:text-white transition-colors">Comparador</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Cuenta</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/login" className="hover:text-white transition-colors">Iniciar sesión</Link></li>
              <li><Link href="/registro" className="hover:text-white transition-colors">Registrarse</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard vendedor</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Mail size={16} />
                info@habitia.com
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                +1 809 555 0000
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} />
                Santo Domingo, RD
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} habitia - InmoConnect. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
