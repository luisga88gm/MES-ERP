import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "@shared/schema";
import { Bell, AlertTriangle, AlertOctagon, Info, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AlertsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: alerts = [], isLoading } = useQuery<Alert[]>({
    queryKey: ["/api/alerts"],
    refetchInterval: 3000,
  });

  const ackMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("PATCH", `/api/alerts/${id}/acknowledge`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      toast({ title: "Alerta reconocida", description: "La alerta ha sido marcada como atendida." });
    },
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/40 flex items-center gap-1"><AlertOctagon className="w-3 h-3 animate-pulse" /> CRÍTICA</Badge>;
      case "WARNING":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> ADVERTENCIA</Badge>;
      case "INFO":
        return <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/40 flex items-center gap-1"><Info className="w-3 h-3" /> INFORMACIÓN</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <Bell className="h-7 w-7 text-amber-400 animate-bounce" /> Centro de Alertas & Telemetría en Tiempo Real
          </h1>
          <p className="text-sm text-slate-400">Notificaciones automáticas de paradas no programadas, anomalías de sensor y mantenimiento preventivo</p>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Cargando telemetría de alertas...</div>
        ) : alerts.length === 0 ? (
          <Card className="p-8 text-center text-slate-400">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
            Planta operando normalmente sin anomalías registradas.
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card key={alert.id} className={`transition-all ${alert.acknowledged ? 'opacity-60' : 'border-l-4 border-l-amber-500'}`}>
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getSeverityBadge(alert.severity)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-cyan-400 text-sm">Máquina {alert.machineCode}</span>
                      <span className="text-xs text-slate-500">• {new Date(alert.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-200 mt-1">{alert.message}</p>
                  </div>
                </div>

                <div>
                  {alert.acknowledged ? (
                    <Badge variant="outline" className="text-slate-500 border-slate-700">Atendida</Badge>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-amber-500/50 text-amber-400 hover:bg-amber-500/20 text-xs"
                      onClick={() => ackMutation.mutate(alert.id)}
                      disabled={ackMutation.isPending}
                    >
                      Reconocer Alerta
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </MainLayout>
  );
}
