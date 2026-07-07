import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { TraceabilityRecord } from "@shared/schema";
import { ShieldCheck, QrCode, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function TraceabilityPage() {
  const { data: records = [], isLoading } = useQuery<TraceabilityRecord[]>({
    queryKey: ["/api/traceability"],
  });

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-emerald-400" /> Trazabilidad & Genealogía de Lotes
          </h1>
          <p className="text-sm text-slate-400">Rastreabilidad integral desde la materia prima hasta el producto terminado (ISO 9001 / MES)</p>
        </div>
      </div>

      {/* Feature Banner */}
      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-emerald-400 flex items-center gap-2">
              <QrCode className="w-5 h-5" /> Sistema de Pasaporte Digital de Producto
            </h3>
            <p className="text-sm text-slate-400">Cada lote de fabricación registra la colada de materia prima, la máquina procesadora, el técnico responsable y la certificación de calidad.</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-100">{records.length}</div>
            <div className="text-xs text-slate-500 uppercase">Lotes Certificados</div>
          </div>
        </CardContent>
      </Card>

      {/* Traceability Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registro de Genealogía de Fabricación</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">Cargando registros de trazabilidad...</div>
          ) : records.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No hay registros de trazabilidad almacenados.</div>
          ) : (
            <Table>
              <TableHeader className="border-slate-800">
                <TableRow className="border-slate-800 hover:bg-slate-900">
                  <TableHead className="text-slate-400">Nº Lote Producto</TableHead>
                  <TableHead className="text-slate-400">Producto Terminado</TableHead>
                  <TableHead className="text-slate-400">Lote Materia Prima</TableHead>
                  <TableHead className="text-slate-400">Máquina</TableHead>
                  <TableHead className="text-slate-400">Operador</TableHead>
                  <TableHead className="text-slate-400">Fecha/Hora</TableHead>
                  <TableHead className="text-slate-400">Control Calidad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="font-mono font-bold text-emerald-400">{record.batchNumber}</TableCell>
                    <TableCell className="font-medium text-slate-200">{record.productName}</TableCell>
                    <TableCell className="font-mono text-xs text-cyan-400">{record.rawMaterialBatch}</TableCell>
                    <TableCell className="font-mono text-xs text-slate-300">{record.machineCode}</TableCell>
                    <TableCell className="text-xs text-slate-300">{record.operator}</TableCell>
                    <TableCell className="text-xs text-slate-400">{new Date(record.timestamp).toLocaleString()}</TableCell>
                    <TableCell>
                      {record.qualityPassed ? (
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 flex items-center gap-1 w-fit">
                          <CheckCircle className="w-3 h-3" /> APROBADO
                        </Badge>
                      ) : (
                        <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/40 flex items-center gap-1 w-fit">
                          <AlertCircle className="w-3 h-3" /> RECHAZADO
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
}
