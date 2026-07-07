import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Machine } from "@shared/schema";
import { Cpu, Activity, PlayCircle, StopCircle, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function OEEMonitorPage() {
  const { data: machines = [], isLoading } = useQuery<Machine[]>({
    queryKey: ["/api/machines"],
    refetchInterval: 5000,
  });

  const totalMachines = machines.length;
  const avgOEE = totalMachines > 0 ? (machines.reduce((acc, m) => acc + (m.oee || 0), 0) / totalMachines).toFixed(1) : "0.0";
  const avgAvailability = totalMachines > 0 ? (machines.reduce((acc, m) => acc + (m.availability || 0), 0) / totalMachines).toFixed(1) : "0.0";
  const avgPerformance = totalMachines > 0 ? (machines.reduce((acc, m) => acc + (m.performance || 0), 0) / totalMachines).toFixed(1) : "0.0";
  const avgQuality = totalMachines > 0 ? (machines.reduce((acc, m) => acc + (m.quality || 0), 0) / totalMachines).toFixed(1) : "0.0";

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RUNNING":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 flex items-center gap-1"><PlayCircle className="w-3 h-3 animate-pulse" /> EN OPERACIÓN</Badge>;
      case "IDLE":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/40 flex items-center gap-1"><Activity className="w-3 h-3" /> EN ESPERA (IDLE)</Badge>;
      case "MAINTENANCE":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40 flex items-center gap-1"><Wrench className="w-3 h-3" /> MANTENIMIENTO</Badge>;
      case "STOPPED":
        return <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/40 flex items-center gap-1"><StopCircle className="w-3 h-3" /> PARADA DE PLANTA</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <Cpu className="h-7 w-7 text-cyan-400" /> Monitor de OEE & Eficiencia Planta
          </h1>
          <p className="text-sm text-slate-400">Telemetría en tiempo real de centros de mecanizado y líneas de producción (Industria 4.0)</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>WebSocket Activo (5000ms)</span>
        </div>
      </div>

      {/* Global Factory KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-slate-400">OEE Promedio Planta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-cyan-400">{avgOEE}%</div>
            <p className="text-xs text-slate-500 mt-1">Meta Mundial: &gt; 85%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-slate-400">Disponibilidad (A)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-emerald-400">{avgAvailability}%</div>
            <p className="text-xs text-slate-500 mt-1">Tiempo Operativo vs Planificado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-slate-400">Rendimiento (P)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-blue-400">{avgPerformance}%</div>
            <p className="text-xs text-slate-500 mt-1">Velocidad real vs Capacidad teórica</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-slate-400">Calidad (Q)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-indigo-400">{avgQuality}%</div>
            <p className="text-xs text-slate-500 mt-1">Piezas conformes vs Total producido</p>
          </CardContent>
        </Card>
      </div>

      {/* Machine Monitoring Grid */}
      <div>
        <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-cyan-400" /> Estado de Máquinas & Telemetría Sensorizada
        </h2>

        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Cargando telemetría de máquinas...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {machines.map((machine) => (
              <Card key={machine.id} className="relative overflow-hidden">
                <CardHeader className="pb-3 border-b border-slate-800/60">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs font-mono text-cyan-400 font-bold">{machine.code}</div>
                      <CardTitle className="text-base font-semibold text-slate-100">{machine.name}</CardTitle>
                    </div>
                    {getStatusBadge(machine.status)}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{machine.location}</div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">OEE Máquina</span>
                      <span className="font-bold text-cyan-400">{machine.oee}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${machine.oee >= 85 ? 'bg-cyan-400' : machine.oee >= 70 ? 'bg-amber-400' : 'bg-rose-400'}`} 
                        style={{ width: `${machine.oee}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center bg-slate-950/60 p-2 rounded-lg border border-slate-800/40">
                    <div>
                      <div className="text-[10px] uppercase text-slate-500">Disponib.</div>
                      <div className="text-xs font-semibold text-emerald-400">{machine.availability}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-slate-500">Rendim.</div>
                      <div className="text-xs font-semibold text-blue-400">{machine.performance}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-slate-500">Calidad</div>
                      <div className="text-xs font-semibold text-indigo-400">{machine.quality}%</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-800/40">
                    <div>
                      <span className="text-slate-500 block text-[10px]">TEMP. CABEZAL</span>
                      <span className={`font-mono font-semibold ${machine.temperature > 50 ? 'text-rose-400' : 'text-slate-200'}`}>{machine.temperature}°C</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">VELOCIDAD (RPM)</span>
                      <span className="font-mono font-semibold text-slate-200">{machine.rpm} RPM</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 block text-[10px]">ORDEN EN CURSO</span>
                      <span className="font-mono font-semibold text-cyan-400">{machine.currentOrder || "N/A"}</span>
                    </div>
                  </div>

                  {machine.operator && (
                    <div className="text-[11px] text-slate-500 bg-slate-950/40 px-2.5 py-1 rounded-md">
                      Operador: <span className="text-slate-300 font-medium">{machine.operator}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
