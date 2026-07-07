import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package2, Settings, Truck, Cpu, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { DollarRateCard } from "@/components/ui/dollar-rate-card";
import { Machine, ProductionOrder, Product, DeliveryNote } from "@shared/schema";

export function DashboardCards() {
  const { data: machines = [] } = useQuery<Machine[]>({ queryKey: ["/api/machines"] });
  const { data: productionOrders = [] } = useQuery<ProductionOrder[]>({ queryKey: ["/api/productionorders"] });
  const { data: products = [] } = useQuery<Product[]>({ queryKey: ["/api/products"] });
  const { data: deliveryNotes = [] } = useQuery<DeliveryNote[]>({ queryKey: ["/api/deliverynotes"] });

  const runningMachines = machines.filter(m => m.status === "RUNNING").length;
  const activeOrders = productionOrders.filter(o => o.status !== "COMPLETADO" && o.status !== "terminada").length;
  const totalProducts = products.length;
  const totalDeliveries = deliveryNotes.length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DollarRateCard />

      <Card className="bg-slate-900/90 border-slate-800 text-slate-100 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-slate-400">Máquinas en Operación</CardTitle>
          <Cpu className="h-4 w-4 text-emerald-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-400">{runningMachines} <span className="text-xs font-normal text-slate-400">/ {machines.length || 5}</span></div>
          <p className="text-[11px] text-slate-400 mt-1">
            Planta Operativa Activa
          </p>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/90 border-slate-800 text-slate-100 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-slate-400">Órdenes en Proceso</CardTitle>
          <Settings className="h-4 w-4 text-cyan-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-cyan-400">{activeOrders}</div>
          <p className="text-[11px] text-slate-400 mt-1">
            Órdenes de Producción activas
          </p>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/90 border-slate-800 text-slate-100 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold uppercase text-slate-400">Productos en Catálogo</CardTitle>
          <Package2 className="h-4 w-4 text-indigo-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-indigo-400">{totalProducts}</div>
          <p className="text-[11px] text-slate-400 mt-1">
            SKUs en BOM registrados
          </p>
        </CardContent>
      </Card>
    </div>
  );
}