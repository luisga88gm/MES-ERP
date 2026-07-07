import { MainLayout } from "@/components/layout/main-layout";
import { DashboardCards } from "@/components/analytics/dashboard-cards";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { Machine } from "@shared/schema";
import { Activity, Cpu, Server } from "lucide-react";

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

export default function Dashboard() {
  const { data: machines = [] } = useQuery<Machine[]>({
    queryKey: ["/api/machines"],
    refetchInterval: 5000
  });

  const machineStatusData = [
    { name: 'Operando', value: machines.filter(m => m.status === 'RUNNING').length || 2 },
    { name: 'Espera', value: machines.filter(m => m.status === 'IDLE').length || 1 },
    { name: 'Mantenimiento', value: machines.filter(m => m.status === 'MAINTENANCE').length || 1 },
    { name: 'Detenida', value: machines.filter(m => m.status === 'STOPPED').length || 1 },
  ];

  const oeeChartData = machines.map(m => ({
    name: m.code,
    OEE: m.oee,
    Disponibilidad: m.availability,
  }));

  return (
    <MainLayout>
      {/* Header Ejecutivo */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Server className="h-5 w-5 text-cyan-500" /> Monitor de Planta MES
        </h1>
        <p className="text-xs text-slate-500">Estado operativo y telemetría de activos en tiempo real</p>
      </div>

      <div className="space-y-6">
        <DashboardCards />

        {/* Semáforo Industrial */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-3 border-b border-slate-800/50">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-300">
              <Cpu className="w-4 h-4 text-cyan-500" /> Estado de Activos
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {machines.map((m) => (
                <div key={m.id} className="bg-slate-950 border border-slate-800 p-3 rounded-md hover:border-slate-700 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-[10px] text-cyan-500">{m.code}</span>
                    <div className={`h-2 w-2 rounded-full ${m.status === 'RUNNING' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : m.status === 'STOPPED' ? 'bg-rose-500' : 'bg-slate-600'}`}></div>
                  </div>
                  <div className="text-xs font-medium text-slate-200 mb-1 truncate">{m.name}</div>
                  <div className="flex justify-between font-mono text-[10px] text-slate-500">
                    <span>OEE</span>
                    <span className="text-slate-300">{m.oee}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader><CardTitle className="text-sm">Distribución de Estados</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={machineStatusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {machineStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip wrapperClassName="recharts-tooltip-custom" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader><CardTitle className="text-sm">Eficiencia OEE (Target: 85%)</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={oeeChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" fontSize={10} stroke="#475569" axisLine={false} tickLine={false} />
                    <YAxis fontSize={10} stroke="#475569" axisLine={false} tickLine={false} />
                    <Tooltip wrapperClassName="recharts-tooltip-custom" cursor={{ fill: '#0f172a' }} />
                    <Bar dataKey="OEE" fill="#06b6d4" radius={[2, 2, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}