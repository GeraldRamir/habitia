"use client";

import { useEffect, useState } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { getReports, updateReport, getPropertyById, getUserById } from "@/lib/storage";
import { useApp } from "@/context/AppContext";
import type { Report } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Flag } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function AdminReportesPage() {
  const { allowed } = useAuthGuard(["admin"]);
  const { addToast } = useApp();
  const [reports, setReports] = useState<Report[]>([]);

  const load = () => setReports(getReports().sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ));

  useEffect(() => { load(); }, []);

  const handleStatus = (id: string, status: Report["status"]) => {
    updateReport(id, status);
    addToast(status === "resolved" ? "Reporte resuelto" : "Reporte descartado");
    load();
  };

  const getTargetName = (report: Report) => {
    if (report.type === "property") {
      return getPropertyById(report.targetId)?.title || report.targetId;
    }
    const user = getUserById(report.targetId);
    return user ? `${user.firstName} ${user.lastName}` : report.targetId;
  };

  const statusLabel = (s: string) => {
    if (s === "pending") return "Pendiente";
    if (s === "resolved") return "Resuelto";
    return "Descartado";
  };

  if (!allowed) return null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-title">Reportes</h1>
        <p className="text-muted">{reports.filter((r) => r.status === "pending").length} pendientes</p>
      </div>

      {reports.length === 0 ? (
        <EmptyState
          icon={<Flag size={32} />}
          title="No hay reportes"
          description="Los reportes de usuarios aparecerán aquí"
        />
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="card p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary capitalize">
                      {report.type === "property" ? "Propiedad" : "Usuario"}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      report.status === "pending" ? "bg-warning/10 text-warning" :
                      report.status === "resolved" ? "bg-success/10 text-success" :
                      "bg-gray-100 text-muted"
                    }`}>
                      {statusLabel(report.status)}
                    </span>
                  </div>
                  <p className="font-medium text-title">{getTargetName(report)}</p>
                  <p className="text-sm text-muted mt-1">{report.reason}</p>
                  <p className="text-xs text-muted mt-2">{formatDate(report.createdAt)}</p>
                </div>
                {report.status === "pending" && (
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" onClick={() => handleStatus(report.id, "resolved")}>
                      Resolver
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleStatus(report.id, "dismissed")}>
                      Descartar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
