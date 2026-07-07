import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

interface DetailSection {
  label: string;
  value: string | number | React.ReactNode;
}

interface DetailGridProps {
  sections: DetailSection[];
  columns?: number;
}

export function DetailGrid({ sections, columns = 2 }: DetailGridProps) {
  const gridClass = columns === 2 
    ? "grid-cols-2" 
    : columns === 3 
      ? "grid-cols-3" 
      : columns === 4 
        ? "grid-cols-4" 
        : "grid-cols-1";

  return (
    <div className={`grid ${gridClass} gap-4`}>
      {sections.map((section, index) => (
        <div key={index} className="space-y-1">
          <div className="text-sm font-medium text-muted-foreground">{section.label}</div>
          <div className="font-medium">{section.value}</div>
        </div>
      ))}
    </div>
  );
}

interface CostDetailRowProps {
  label: string;
  value: string | number;
}

export function CostDetailRow({ label, value }: CostDetailRowProps) {
  return (
    <div className="grid grid-cols-2 gap-x-4 text-sm">
      <span>{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

interface DetailViewProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function DetailView({ title, open, onClose, children }: DetailViewProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{title}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="mt-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface SectionCardProps {
  title?: string;
  children: React.ReactNode;
}

export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <Card className="mb-4">
      {title && (
        <div className="px-4 py-2 bg-muted font-medium">{title}</div>
      )}
      <CardContent className="p-4">
        {children}
      </CardContent>
    </Card>
  );
}

interface ComponentDetailProps {
  open: boolean;
  onClose: () => void;
  data: {
    id: number;
    name: string;
    description: string;
    code?: string;
    photo?: string;
    materialSpecs?: {
      alWeight?: number;
      brWeight?: number;
      timePerPiece?: number;
    };
    costs?: {
      alCost?: number;
      brCost?: number;
      alBulkGalvCost?: number;
      brBulkGalvCost?: number;
      alBulkInoxCost?: number;
      brBulkInoxCost?: number;
      laborCost?: number;
      alTotalGalvCost?: number;
      brTotalGalvCost?: number;
      alTotalInoxCost?: number;
      brTotalInoxCost?: number;
      finalPriceAl?: number;
      finalPriceAlInox?: number;
      finalPriceBr?: number;
      finalPriceBrInox?: number;
    };
    stock?: number;
    minStock?: number;
    [key: string]: any;
  };
}

export function ComponentDetailView({ open, onClose, data }: ComponentDetailProps) {
  const hasCosts = data.costs && Object.keys(data.costs).length > 0;
  const hasMaterialSpecs = data.materialSpecs && Object.keys(data.materialSpecs).length > 0;

  return (
    <DetailView 
      title={`Detalle del Componente: ${data.name}`} 
      open={open} 
      onClose={onClose}
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Photo and Basic Info */}
        <div className="md:w-1/3">
          <SectionCard>
            <div className="flex flex-col items-center">
              <div className="border border-black h-32 w-32 aspect-square bg-muted/10 flex items-center justify-center text-sm mb-4">
                {data.photo ? (
                  <img src={data.photo} alt={data.name} className="h-full w-full object-contain" />
                ) : (
                  <div className="text-center">
                    <div className="mb-1">Sin imagen</div>
                    <div className="text-xs">FOTO RECTO</div>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-bold mb-4">{data.name}</h3>

              <DetailGrid 
                sections={[
                  { label: "Código", value: data.code || "N/A" },
                  { label: "Stock Actual", value: data.stock || 0 },
                  { label: "Stock Mínimo", value: data.minStock || 0 },
                ]}
              />

              {hasMaterialSpecs && data.materialSpecs && (
                <div className="w-full mt-4 text-xs space-y-0.5 text-slate-200">
                  {data.materialSpecs.alWeight && (
                    <div>kg / pieza en Al: {data.materialSpecs.alWeight}</div>
                  )}
                  {data.materialSpecs.brWeight && (
                    <div>kg / pieza en Br: {data.materialSpecs.brWeight}</div>
                  )}
                  {data.materialSpecs.timePerPiece && (
                    <div>minutos / pieza: {data.materialSpecs.timePerPiece}</div>
                  )}
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        {/* Cost and Price Details */}
        {hasCosts && data.costs && (
          <div className="md:w-2/3">
            <SectionCard title="Costos y Precios">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Center column - Cost Details */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-12">
                  <div className="space-y-1">
                    {data.costs.alCost && (
                      <CostDetailRow label="Costo en Al" value={`$${data.costs.alCost.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`} />
                    )}
                    {data.costs.alBulkGalvCost && (
                      <CostDetailRow label="Costo Bul Galv." value={`$${data.costs.alBulkGalvCost.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`} />
                    )}
                    {data.costs.alBulkInoxCost && (
                      <CostDetailRow label="Costo Bul Inox." value={`$${data.costs.alBulkInoxCost.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`} />
                    )}
                    {data.costs.laborCost && (
                      <CostDetailRow label="Costo M. Obra" value={`$${data.costs.laborCost.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`} />
                    )}
                    {data.costs.alTotalGalvCost && (
                      <CostDetailRow 
                        label="C. Total Galv." 
                        value={`$${data.costs.alTotalGalvCost.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`} 
                      />
                    )}
                    {data.costs.alTotalInoxCost && (
                      <CostDetailRow 
                        label="C. Total Inox." 
                        value={`$${data.costs.alTotalInoxCost.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`} 
                      />
                    )}
                  </div>

                  <div className="space-y-1">
                    {data.costs.brCost && (
                      <CostDetailRow 
                        label="Costo en Br." 
                        value={`$${data.costs.brCost.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`} 
                      />
                    )}
                    {data.costs.brBulkGalvCost && (
                      <CostDetailRow 
                        label="Costo Bul Galv." 
                        value={`$${data.costs.brBulkGalvCost.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`} 
                      />
                    )}
                    {data.costs.brBulkInoxCost && (
                      <CostDetailRow 
                        label="Costo Bul Inox." 
                        value={`$${data.costs.brBulkInoxCost.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`} 
                      />
                    )}
                    {data.costs.laborCost && (
                      <CostDetailRow 
                        label="Costo M. Obra" 
                        value={`$${data.costs.laborCost.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`} 
                      />
                    )}
                    {data.costs.brTotalGalvCost && (
                      <CostDetailRow 
                        label="C. Total Galv." 
                        value={`$${data.costs.brTotalGalvCost.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`} 
                      />
                    )}
                    {data.costs.brTotalInoxCost && (
                      <CostDetailRow 
                        label="C. Total Inox." 
                        value={`$${data.costs.brTotalInoxCost.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`} 
                      />
                    )}
                  </div>
                </div>

                {/* Right side - Prices Box */}
                <div className="w-full md:w-64">
                  <div className="space-y-1">
                    {data.costs.finalPriceAl && (
                      <div className="border border-black p-2">
                        <div className="grid grid-cols-2 gap-x-2 text-sm text-slate-200">
                          <span className="font-bold whitespace-nowrap">Precio en Al.</span>
                          <span className="text-right font-bold">${data.costs.finalPriceAl.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    )}
                    {data.costs.finalPriceAlInox && (
                      <div className="border border-black p-2">
                        <div className="grid grid-cols-2 gap-x-2 text-sm text-slate-200">
                          <span className="font-bold whitespace-nowrap">Precio en Al. Inox.</span>
                          <span className="text-right font-bold">${data.costs.finalPriceAlInox.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    )}
                    {data.costs.finalPriceBr && (
                      <div className="border border-black p-2">
                        <div className="grid grid-cols-2 gap-x-2 text-sm text-slate-200">
                          <span className="font-bold whitespace-nowrap">Precio en Br.</span>
                          <span className="text-right font-bold">${data.costs.finalPriceBr.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    )}
                    {data.costs.finalPriceBrInox && (
                      <div className="border border-black p-2">
                        <div className="grid grid-cols-2 gap-x-2 text-sm text-slate-200">
                          <span className="font-bold whitespace-nowrap">Precio en Br. Inox.</span>
                          <span className="text-right font-bold">${data.costs.finalPriceBrInox.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Document Buttons */}
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <Button variant="outline" className="bg-blue-100 hover:bg-blue-200 text-xs">
                  PLANO GALV.
                </Button>
                <Button variant="outline" className="bg-blue-100 hover:bg-blue-200 text-xs">
                  PLANO INOX
                </Button>
              </div>
            </SectionCard>
          </div>
        )}
      </div>

      {/* Additional Details Section */}
      <SectionCard title="Descripción y Detalles Adicionales">
        <p className="mb-4">{data.description}</p>
        
        {data.additionalDetails && (
          <DetailGrid
            sections={Object.entries(data.additionalDetails).map(([key, value]) => ({
              label: key,
              value: String(value)
            }))}
            columns={3}
          />
        )}
      </SectionCard>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </DetailView>
  );
}