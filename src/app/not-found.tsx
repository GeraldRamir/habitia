import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <h1 className="text-6xl font-bold text-secondary mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-title mb-2">Página no encontrada</h2>
      <p className="text-muted mb-8">La página que buscas no existe o fue eliminada.</p>
      <Link href="/">
        <Button>Volver al inicio</Button>
      </Link>
    </div>
  );
}
