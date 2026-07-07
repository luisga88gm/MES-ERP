import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState, KeyboardEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, X, Minus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useDollarRate } from "@/hooks/use-dollar-rate";
import { Input } from "@/components/ui/input";

interface RateToggleProps {
  value: number;
  onChange: (increment: boolean) => void;
  onValueChange: (value: number) => void;
  isPercentage?: boolean;
}

interface BulonItem {
  medida: string;
  valorPesos: number;
  valorUSD: number;
  actualizadoEl: string;
}

interface CaballeteItem {
  tipo: string;
  valorPesos: number;
  valorUSD: number;
  actualizadoEl: string;
}

function RateToggle({ value, onChange, onValueChange, isPercentage = false }: RateToggleProps) {
  const [editValue, setEditValue] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newValue = Number(editValue);
      if (!isNaN(newValue)) {
        onValueChange(newValue);
      }
      setIsEditing(false);
    }
  };

  const handleClick = () => {
    setIsEditing(true);
    setEditValue(value.toFixed(2));
  };

  return (
    <div className="flex gap-1 ml-2 items-center">
      <Button
        variant="outline"
        size="sm"
        className="h-6 w-6 p-0 border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
        onClick={() => onChange(false)}
        title="Decrease by 0.01"
      >
        <Minus className="h-3 w-3" />
      </Button>
      {isEditing ? (
        <Input
          type="number"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setIsEditing(false)}
          className="w-24 h-6 text-right px-1 bg-slate-800 border-slate-600 text-slate-100"
          step="0.01"
          autoFocus
        />
      ) : (
        <span
          onClick={handleClick}
          className="cursor-pointer min-w-[60px] text-right text-slate-100 hover:text-cyan-400 transition-colors"
          title="Click to edit"
        >
          {isPercentage ? `${value.toFixed(2)}%` : value.toFixed(2)}
        </span>
      )}
      <Button
        variant="outline"
        size="sm"
        className="h-6 w-6 p-0 border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
        onClick={() => onChange(true)}
        title="Increase by 0.01"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}

function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-6 w-6 p-0 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
      onClick={onClick}
      title="Eliminar fila"
    >
      <X className="h-4 w-4" />
    </Button>
  );
}

function AddRowButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="mt-3 border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
      onClick={onClick}
    >
      <Plus className="h-4 w-4 mr-2" />
      Agregar fila
    </Button>
  );
}

export default function VariablesPage() {
  const [editingNew, setEditingNew] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState(false);
  const [newRow, setNewRow] = useState<{
    proveedor?: string;
    medida?: string;
    tipo?: string;
    valorPesos: number;
    valorUSD?: number;
    actualizadoEl?: string;
  }>({
    proveedor: "Nuevo Proveedor",
    valorPesos: 0
  });
  const [editingType, setEditingType] = useState<'aluminio' | 'bronce' | 'steel' | 'bulonGalvanizado' | 'bulonInoxidable' | 'caballete' | null>(null);

  const [variables, setVariables] = useState({
    plusImprevistosAluminio: {
      valor: 3000,
      actualizadoEl: "2025-01-29",
    },
    plusImprevistosEnBronce: {
      valor: 3000,
      actualizadoEl: "2025-01-29",
    },
    aluminio: [
      {
        proveedor: "Fundición García",
        valorPesos: 12700,
        valorUSD: 11.86,
        actualizadoEl: "2025-01-29",
      },
      {
        proveedor: "Oscar Gutiérrez",
        valorPesos: 12700,
        valorUSD: 11.86,
        actualizadoEl: "2025-01-29",
      },
      {
        proveedor: "Metalúrgica Uhrig (tierra)",
        valorPesos: 13500,
        valorUSD: 12.61,
        actualizadoEl: "2025-01-29",
      },
      {
        proveedor: "Metalúrgica Uhrig (coquilla)",
        valorPesos: 11500,
        valorUSD: 10.74,
        actualizadoEl: "2025-01-29",
      },
      {
        proveedor: "Metalúrgica Uhrig (inyección)",
        valorPesos: 11000,
        valorUSD: 10.27,
        actualizadoEl: "2025-01-29",
      },
    ],
    bronce: [
      {
        proveedor: "Fundición García",
        valorPesos: 30500,
        valorUSD: 28.48,
        actualizadoEl: "2025-01-29",
      },
      {
        proveedor: "Metalúrgica Uhrig (tierra-latón)",
        valorPesos: 1,
        valorUSD: 0,
        actualizadoEl: "2025-01-29",
      },
    ],
    steel: [
      {
        proveedor: "Acindar",
        valorPesos: 8500,
        valorUSD: 7.93,
        actualizadoEl: "2025-01-29",
      },
      {
        proveedor: "Siderar",
        valorPesos: 8200,
        valorUSD: 7.65,
        actualizadoEl: "2025-01-29",
      },
      {
        proveedor: "Aceros del Sur",
        valorPesos: 8800,
        valorUSD: 8.21,
        actualizadoEl: "2025-01-29",
      },
    ],
    cobreado: {
      valorPorKg: 0,
      valorUSD: 0,
      actualizadoEl: "2025-01-29",
    },
    manoDeObra: {
      valorPorHora: 5100,
      valorUSD: 4.76,
      valorPorMinuto: 85,
      valorMinutoUSD: 0.08,
      actualizadoEl: "2025-01-29",
    },
    cincadoEnCaliente: {
      piezasLivianas: {
        valorPorKg: 1250,
        valorUSD: 1.25,
        actualizadoEl: "2025-01-29",
      },
      piezasPesadas: {
        valorPorKg: 1250,
        valorUSD: 1.25,
        actualizadoEl: "2025-01-29",
      },
    },
    gananciaConectores: {
      porcentaje: 65,
      actualizadoEl: "2025-01-29",
    },
    estañadoEnBronce: {
      valorPorKg: 7902.90,
      valorUSD: 7.38,
      actualizadoEl: "2025-01-29",
    },
    bulonGalvanizado: [
      {
        medida: "Bulón 1/4\"",
        valorPesos: 2.22,
        valorUSD: 0.00,
        actualizadoEl: "2025-01-29",
      },
      {
        medida: "Bulón 5/16\"",
        valorPesos: 17.95,
        valorUSD: 0.02,
        actualizadoEl: "2025-01-29",
      },
      {
        medida: "Bulón 3/8\"",
        valorPesos: 248.27,
        valorUSD: 0.23,
        actualizadoEl: "2025-01-29",
      },
      {
        medida: "Bulón 1/2\" x 2 1/2\"",
        valorPesos: 1115.50,
        valorUSD: 1.04,
        actualizadoEl: "2025-01-29",
      },
    ],
    bulonInoxidable: [
      {
        medida: "Bulón 1/4\"",
        valorPesos: 8.55,
        valorUSD: 0.01,
        actualizadoEl: "2025-01-29",
      },
      {
        medida: "Bulón 5/16\"",
        valorPesos: 69.09,
        valorUSD: 0.06,
        actualizadoEl: "2025-01-29",
      },
      {
        medida: "Bulón 3/8\"",
        valorPesos: 2801.60,
        valorUSD: 2.62,
        actualizadoEl: "2025-01-29",
      },
      {
        medida: "Bulón 1/2\" x 2 1/2\"",
        valorPesos: 3470.01,
        valorUSD: 3.24,
        actualizadoEl: "2025-01-29",
      },
    ],
    caballeteGalvanizado: {
      valorPesos: 248.30,
      valorUSD: 0.23,
      actualizadoEl: "2025-01-29",
    },
    caballeteInoxidable: {
      valorPesos: 956.00,
      valorUSD: 0.89,
      actualizadoEl: "2025-01-29",
    },
  });
  const [rates, setRates] = useState<Record<string, number>>({
    plusImprevistosAluminio: 0,
    plusImprevistosEnBronce: 0,
    cobreado_valorPorKg: 0,
    gananciaConectores: 0,
    aluminio_0: 0,
    aluminio_1: 0,
    aluminio_2: 0,
    aluminio_3: 0,
    aluminio_4: 0,
    bronce_0: 0,
    bronce_1: 0,
    cincadoEnCaliente_piezasLivianas: 0,
    cincadoEnCaliente_piezasPesadas: 0,
    estañadoEnBronce: 0,
    manoDeObra_valorPorHora: 0,
    manoDeObra_valorPorMinuto: 0,
    steel_0: 0,
    steel_1: 0,
    steel_2: 0,
    bulon_galvanizado_Bulón_1_4: 0,
    bulon_galvanizado_Bulón_5_16: 0,
    bulon_galvanizado_Bulón_3_8: 0,
    bulon_galvanizado_Bulón_1_2: 0,
    bulon_inoxidable_Bulón_1_4: 0,
    bulon_inoxidable_Bulón_5_16: 0,
    bulon_inoxidable_Bulón_3_8: 0,
    bulon_inoxidable_Bulón_1_2: 0,
    caballete_galvanizado: 0,
    caballete_inoxidable: 0,
  });
  const { data: dollarRate = 1071.20 } = useDollarRate();

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "dd/MMM/yyyy", { locale: es }).toUpperCase();
  };

  const formatUSD = (pesosValue: number, key?: string) => {
    const adjustedPesosValue = getAdjustedValue(pesosValue, key);
    const usdValue = adjustedPesosValue / dollarRate;
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(usdValue);
  };

  const getAdjustedValue = (baseValue: number, key?: string) => {
    if (!key) return baseValue;
    const adjustment = rates[key] || 0;
    const result = Number(baseValue) + Number(adjustment);
    return Number(result.toFixed(2));
  };

  const adjustRate = (key: string, increment: boolean) => {
    setRates(prev => {
      const currentValue = Number(prev[key] || 0);
      const newValue = Number((currentValue + (increment ? 0.01 : -0.01)).toFixed(2));
      return {
        ...prev,
        [key]: newValue
      };
    });
  };

  const handleDirectValueChange = (key: string, newValue: number) => {
    setRates(prev => ({
      ...prev,
      [key]: Number(newValue.toFixed(2))
    }));
  };

  const displayValue = (key: string, pesosValue: number, prefix: string = "$") => {
    const adjustedValue = getAdjustedValue(pesosValue, key);
    return `${prefix} ${new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(adjustedValue)}`;
  };

  const handleAddRow = (type: 'aluminio' | 'bronce' | 'steel' | 'bulonGalvanizado' | 'bulonInoxidable' | 'caballete') => {
    setEditingType(type);
    setEditingNew(true);
    setEditingProveedor(true);

    if (type === 'bulonGalvanizado' || type === 'bulonInoxidable') {
      setNewRow({
        medida: "Nuevo Bulón",
        valorPesos: 0,
        valorUSD: 0,
        actualizadoEl: new Date().toISOString().split('T')[0]
      });
    } else if (type === 'caballete') {
      setNewRow({
        tipo: "Nuevo Caballete",
        valorPesos: 0,
        valorUSD: 0,
        actualizadoEl: new Date().toISOString().split('T')[0]
      });
    } else {
      setNewRow({
        proveedor: "Nuevo Proveedor",
        valorPesos: 0
      });
    }
  };

  const handleSaveNewRow = () => {
    if (!editingType) return;

    const rowToAdd = {
      ...newRow,
      valorUSD: Number((newRow.valorPesos / dollarRate).toFixed(2)),
      actualizadoEl: new Date().toISOString().split('T')[0]
    };

    setVariables(prev => {
      // For array-based types (bulones, aluminio, bronce, steel)
      if (Array.isArray(prev[editingType])) {
        return {
          ...prev,
          [editingType]: [...prev[editingType], rowToAdd as any]
        };
      }

      // For caballetes (single object types)
      if (editingType === 'caballete') {
        const caballeteKey = (rowToAdd.tipo || '').toLowerCase().includes('inox') ?
          'caballeteInoxidable' : 'caballeteGalvanizado';

        return {
          ...prev,
          [caballeteKey]: {
            valorPesos: rowToAdd.valorPesos,
            valorUSD: rowToAdd.valorUSD,
            actualizadoEl: rowToAdd.actualizadoEl
          }
        };
      }

      return prev;
    });

    setEditingNew(false);
    setEditingType(null);
  };


  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-slate-950 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-100">Variables y Tasas de Materiales</h1>
          <p className="text-sm text-slate-400 mt-1">Gestión de precios de materias primas e insumos productivos</p>
        </div>

        <div className="grid gap-6">
            {/* Acero */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="border-b border-slate-800/60 pb-3">
                <CardTitle className="text-slate-100 text-base font-semibold tracking-wide">🔩 Acero</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <Table>
                  <thead>
                    <TableRow className="border-b border-slate-800 hover:bg-transparent">
                      <TableHead className="font-semibold text-slate-400 w-1/3">Proveedor</TableHead>
                      <TableHead className="font-semibold text-slate-400 w-1/4">Valor AR$/Kg</TableHead>
                      <TableHead className="font-semibold text-slate-400 w-1/4">Valor U$D/Kg</TableHead>
                      <TableHead className="font-semibold text-slate-400 w-1/6">Actualizado</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </thead>
                  <TableBody>
                    {variables.steel.map((item, index) => (
                      <TableRow key={index} className={`border-b border-slate-800/40 ${index % 2 === 0 ? 'bg-slate-950/60' : 'bg-slate-900/60'} hover:bg-slate-800/40 transition-colors`}>
                        <TableCell className="w-1/3 text-slate-200">{item.proveedor}</TableCell>
                        <TableCell className="w-1/4">
                          <div className="flex items-center text-emerald-400 font-mono text-sm">
                            <span>$</span>
                            <RateToggle
                              value={getAdjustedValue(item.valorPesos, `steel_${index}`)}
                              onChange={(increment) => adjustRate(`steel_${index}`, increment)}
                              onValueChange={(value) => handleDirectValueChange(`steel_${index}`, value - item.valorPesos)}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="w-1/4 text-slate-300 font-mono text-sm">U$D {formatUSD(item.valorPesos, `steel_${index}`)}</TableCell>
                        <TableCell className="w-1/6 text-slate-400 text-xs">{formatDate(item.actualizadoEl)}</TableCell>
                        <TableCell className="w-[50px]">
                          <DeleteButton onClick={() => {
                            const newSteel = [...variables.steel];
                            newSteel.splice(index, 1);
                            setVariables(prev => ({
                              ...prev,
                              steel: newSteel
                            }));
                          }} />
                        </TableCell>
                      </TableRow>
                    ))}
                    {editingNew && editingType === 'steel' && (
                      <TableRow>
                        <TableCell>
                          {editingProveedor ? (
                            <Input
                              autoFocus
                              value={newRow.proveedor}
                              onChange={(e) => setNewRow(prev => ({ ...prev, proveedor: e.target.value }))}
                              onBlur={() => setEditingProveedor(false)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  setEditingProveedor(false);
                                }
                              }}
                            />
                          ) : (
                            <span
                              onClick={() => setEditingProveedor(true)}
                              className="cursor-pointer"
                            >
                              {newRow.proveedor}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span>$</span>
                            <RateToggle
                              value={newRow.valorPesos}
                              onChange={(increment) =>
                                setNewRow(prev => ({
                                  ...prev,
                                  valorPesos: Number((prev.valorPesos + (increment ? 0.01 : -0.01)).toFixed(2))
                                }))
                              }
                              onValueChange={(value) =>
                                setNewRow(prev => ({
                                  ...prev,
                                  valorPesos: value
                                }))
                              }
                            />
                          </div>
                        </TableCell>
                        <TableCell>U$D {(newRow.valorPesos / dollarRate).toFixed(2)}</TableCell>
                        <TableCell>{formatDate(new Date().toISOString())}</TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            variant="default"
                            onClick={() => {
                              setVariables(prev => ({
                                ...prev,
                                steel: [...prev.steel, {
                                  ...newRow,
                                  valorUSD: Number((newRow.valorPesos / dollarRate).toFixed(2)),
                                  actualizadoEl: new Date().toISOString().split('T')[0]
                                } as any]
                              }));
                              setEditingNew(false);
                              setEditingType(null);
                            }}
                          >
                            Guardar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive/90"
                            onClick={() => {
                              setEditingNew(false);
                              setEditingType(null);
                              setNewRow({
                                proveedor: "Nuevo Proveedor",
                                valorPesos: 0
                              });
                            }}
                            title="Cancelar"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <AddRowButton onClick={() => handleAddRow('steel')} />
              </CardContent>
            </Card>

            {/* Aluminio */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="border-b border-slate-800/60 pb-3">
                <CardTitle className="text-slate-100 text-base font-semibold tracking-wide">🪨 Aluminio</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <Table>
                  <thead>
                    <TableRow className="border-b border-slate-800 hover:bg-transparent">
                      <TableHead className="font-semibold text-slate-400 w-1/3">Proveedor</TableHead>
                      <TableHead className="font-semibold text-slate-400 w-1/4">Valor AR$/Kg</TableHead>
                      <TableHead className="font-semibold text-slate-400 w-1/4">Valor U$D/Kg</TableHead>
                      <TableHead className="font-semibold text-slate-400 w-1/6">Actualizado</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </thead>
                  <TableBody>
                    {variables.aluminio.map((item, index) => (
                      <TableRow key={index} className={`border-b border-slate-800/40 ${index % 2 === 0 ? 'bg-slate-950/60' : 'bg-slate-900/60'} hover:bg-slate-800/40 transition-colors`}>
                        <TableCell className="w-1/3 text-slate-200">{item.proveedor}</TableCell>
                        <TableCell className="w-1/4">
                          <div className="flex items-center text-emerald-400 font-mono text-sm">
                            <span>$</span>
                            <RateToggle
                              value={getAdjustedValue(item.valorPesos, `aluminio_${index}`)}
                              onChange={(increment) => adjustRate(`aluminio_${index}`, increment)}
                              onValueChange={(value) => handleDirectValueChange(`aluminio_${index}`, value - item.valorPesos)}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="w-1/4 text-slate-300 font-mono text-sm">U$D {formatUSD(item.valorPesos, `aluminio_${index}`)}</TableCell>
                        <TableCell className="w-1/6 text-slate-400 text-xs">{formatDate(item.actualizadoEl)}</TableCell>
                        <TableCell className="w-[50px]">
                          <DeleteButton onClick={() => {
                            const newAluminio = [...variables.aluminio];
                            newAluminio.splice(index, 1);
                            setVariables(prev => ({
                              ...prev,
                              aluminio: newAluminio
                            }));
                          }} />
                        </TableCell>
                      </TableRow>
                    ))}
                    {editingNew && editingType === 'aluminio' && (
                      <TableRow>
                        <TableCell>
                          {editingProveedor ? (
                            <Input
                              autoFocus
                              value={newRow.proveedor}
                              onChange={(e) => setNewRow(prev => ({ ...prev, proveedor: e.target.value }))}
                              onBlur={() => setEditingProveedor(false)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  setEditingProveedor(false);
                                }
                              }}
                            />
                          ) : (
                            <span
                              onClick={() => setEditingProveedor(true)}
                              className="cursor-pointer"
                            >
                              {newRow.proveedor}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span>$</span>
                            <RateToggle
                              value={newRow.valorPesos}
                              onChange={(increment) =>
                                setNewRow(prev => ({
                                  ...prev,
                                  valorPesos: Number((prev.valorPesos + (increment ? 0.01 : -0.01)).toFixed(2))
                                }))
                              }
                              onValueChange={(value) =>
                                setNewRow(prev => ({
                                  ...prev,
                                  valorPesos: value
                                }))
                              }
                            />
                          </div>
                        </TableCell>
                        <TableCell>U$D {(newRow.valorPesos / dollarRate).toFixed(2)}</TableCell>
                        <TableCell>{formatDate(new Date().toISOString())}</TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            variant="default"
                            onClick={() => {
                              setVariables(prev => ({
                                ...prev,
                                aluminio: [...prev.aluminio, {
                                  ...newRow,
                                  valorUSD: Number((newRow.valorPesos / dollarRate).toFixed(2)),
                                  actualizadoEl: new Date().toISOString().split('T')[0]
                                } as any]
                              }));
                              setEditingNew(false);
                              setEditingType(null);
                            }}
                          >
                            Guardar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive/90"
                            onClick={() => {
                              setEditingNew(false);
                              setEditingType(null);
                              setNewRow({
                                proveedor: "Nuevo Proveedor",
                                valorPesos: 0
                              });
                            }}
                            title="Cancelar"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <AddRowButton onClick={() => handleAddRow('aluminio')} />
              </CardContent>
            </Card>

            {/* Bronce */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="border-b border-slate-800/60 pb-3">
                <CardTitle className="text-slate-100 text-base font-semibold tracking-wide">🥉 Bronce</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <Table>
                  <thead>
                    <TableRow className="border-b border-slate-800 hover:bg-transparent">
                      <TableHead className="font-semibold text-slate-400 w-1/3">Proveedor</TableHead>
                      <TableHead className="font-semibold text-slate-400 w-1/4">Valor AR$/Kg</TableHead>
                      <TableHead className="font-semibold text-slate-400 w-1/4">Valor U$D/Kg</TableHead>
                      <TableHead className="font-semibold text-slate-400 w-1/6">Actualizado</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </thead>
                  <TableBody>
                    {variables.bronce.map((item, index) => (
                      <TableRow key={index} className={`border-b border-slate-800/40 ${index % 2 === 0 ? 'bg-slate-950/60' : 'bg-slate-900/60'} hover:bg-slate-800/40 transition-colors`}>
                        <TableCell className="w-1/3 text-slate-200">{item.proveedor}</TableCell>
                        <TableCell className="w-1/4">
                          <div className="flex items-center text-emerald-400 font-mono text-sm">
                            <span>$</span>
                            <RateToggle
                              value={getAdjustedValue(item.valorPesos, `bronce_${index}`)}
                              onChange={(increment) => adjustRate(`bronce_${index}`, increment)}
                              onValueChange={(value) => handleDirectValueChange(`bronce_${index}`, value - item.valorPesos)}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="w-1/4 text-slate-300 font-mono text-sm">U$D {formatUSD(item.valorPesos, `bronce_${index}`)}</TableCell>
                        <TableCell className="w-1/6 text-slate-400 text-xs">{formatDate(item.actualizadoEl)}</TableCell>
                        <TableCell className="w-[50px]">
                          <DeleteButton onClick={() => {
                            const newBronce = [...variables.bronce];
                            newBronce.splice(index, 1);
                            setVariables(prev => ({
                              ...prev,
                              bronce: newBronce
                            }));
                          }} />
                        </TableCell>
                      </TableRow>
                    ))}
                    {editingNew && editingType === 'bronce' && (
                      <TableRow>
                        <TableCell>
                          {editingProveedor ? (
                            <Input
                              autoFocus
                              value={newRow.proveedor}
                              onChange={(e) => setNewRow(prev => ({ ...prev, proveedor: e.target.value }))}
                              onBlur={() => setEditingProveedor(false)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  setEditingProveedor(false);
                                }
                              }}
                            />
                          ) : (
                            <span
                              onClick={() => setEditingProveedor(true)}
                              className="cursor-pointer"
                            >
                              {newRow.proveedor}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span>$</span>
                            <RateToggle
                              value={newRow.valorPesos}
                              onChange={(increment) =>
                                setNewRow(prev => ({
                                  ...prev,
                                  valorPesos: Number((prev.valorPesos + (increment ? 0.01 : -0.01)).toFixed(2))
                                }))
                              }
                              onValueChange={(value) =>
                                setNewRow(prev => ({
                                  ...prev,
                                  valorPesos: value
                                }))
                              }
                            />
                          </div>
                        </TableCell>
                        <TableCell>U$D {(newRow.valorPesos / dollarRate).toFixed(2)}</TableCell>
                        <TableCell>{formatDate(new Date().toISOString())}</TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            variant="default"
                            onClick={() => {
                              setVariables(prev => ({
                                ...prev,
                                bronce: [...prev.bronce, {
                                  ...newRow,
                                  valorUSD: Number((newRow.valorPesos / dollarRate).toFixed(2)),
                                  actualizadoEl: new Date().toISOString().split('T')[0]
                                } as any]
                              }));
                              setEditingNew(false);
                              setEditingType(null);
                            }}
                          >
                            Guardar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive/90"
                            onClick={() => {
                              setEditingNew(false);
                              setEditingType(null);
                              setNewRow({
                                proveedor: "Nuevo Proveedor",
                                valorPesos: 0
                              });
                            }}
                            title="Cancelar"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <AddRowButton onClick={() => handleAddRow('bronce')} />
              </CardContent>
            </Card>

            {/* Tratamientos */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="border-b border-slate-800/60 pb-3">
                <CardTitle className="text-slate-100 text-base font-semibold tracking-wide">⚗️ Tratamientos Superficiales</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-slate-950/40 rounded-lg p-4 border border-slate-800/60">
                    <h3 className="font-semibold text-slate-200 mb-4">Cobreado en Aluminio</h3>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-400 min-w-[100px]">Valor por kg:</span>
                      <div className="flex items-center text-emerald-400 font-mono text-sm">
                        <span>$</span>
                        <RateToggle
                          value={getAdjustedValue(variables.cobreado.valorPorKg, 'cobreado_valorPorKg')}
                          onChange={(increment) => adjustRate('cobreado_valorPorKg', increment)}
                          onValueChange={(value) => handleDirectValueChange('cobreado_valorPorKg', value - variables.cobreado.valorPorKg)}
                        />
                      </div>
                    </div>
                    <p className="mt-2 text-slate-300 text-sm">Valor USD: <span className="text-cyan-400 font-mono">U$D {formatUSD(variables.cobreado.valorPorKg, 'cobreado_valorPorKg')}</span></p>
                    <p className="text-xs text-slate-500 mt-1">
                      Actualizado: {formatDate(variables.cobreado.actualizadoEl)}
                    </p>
                  </div>
                  <div className="bg-slate-950/40 rounded-lg p-4 border border-slate-800/60">
                    <h3 className="font-semibold text-slate-200 mb-4">Estañado en Bronce</h3>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-400 min-w-[100px]">Valor por kg:</span>
                      <div className="flex items-center text-emerald-400 font-mono text-sm">
                        <span>$</span>
                        <RateToggle
                          value={getAdjustedValue(variables.estañadoEnBronce.valorPorKg, 'estañadoEnBronce')}
                          onChange={(increment) => adjustRate('estañadoEnBronce', increment)}
                          onValueChange={(value) => handleDirectValueChange('estañadoEnBronce', value - variables.estañadoEnBronce.valorPorKg)}
                        />
                      </div>
                    </div>
                    <p className="mt-2 text-slate-300 text-sm">Valor USD: <span className="text-cyan-400 font-mono">U$D {formatUSD(variables.estañadoEnBronce.valorPorKg, 'estañadoEnBronce')}</span></p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Actualizado: {formatDate(variables.estañadoEnBronce.actualizadoEl)}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-200 mb-4">Cincado en Caliente</h3>
                    <h4 className="font-semibold text-slate-200 mb-2">Piezas Livianas</h4>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-400 min-w-[100px]">Valor por kg:</span>
                      <div className="flex items-center">
                        <span>$</span>
                        <RateToggle
                          value={getAdjustedValue(variables.cincadoEnCaliente.piezasLivianas.valorPorKg, 'cincadoEnCaliente_piezasLivianas')}
                          onChange={(increment) => adjustRate('cincadoEnCaliente_piezasLivianas', increment)}
                          onValueChange={(value) => handleDirectValueChange('cincadoEnCaliente_piezasLivianas', value - variables.cincadoEnCaliente.piezasLivianas.valorPorKg)}
                        />
                      </div>
                    </div>
                    <p className="mt-2">Valor USD: U$D {formatUSD(variables.cincadoEnCaliente.piezasLivianas.valorPorKg, 'cincadoEnCaliente_piezasLivianas')}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Actualizado: {formatDate(variables.cincadoEnCaliente.piezasLivianas.actualizadoEl)}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-200 mb-4">Cincado en Caliente</h3>
                    <h4 className="font-semibold text-slate-200 mb-2">Piezas Pesadas</h4>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-400 min-w-[100px]">Valor por kg:</span>
                      <div className="flex items-center">
                        <span>$</span>
                        <RateToggle
                          value={getAdjustedValue(variables.cincadoEnCaliente.piezasPesadas.valorPorKg, 'cincadoEnCaliente_piezasPesadas')}
                          onChange={(increment) => adjustRate('cincadoEnCaliente_piezasPesadas', increment)}
                          onValueChange={(value) => handleDirectValueChange('cincadoEnCaliente_piezasPesadas', value - variables.cincadoEnCaliente.piezasPesadas.valorPorKg)}
                        />
                      </div>
                    </div>
                    <p className="mt-2">Valor USD: U$D {formatUSD(variables.cincadoEnCaliente.piezasPesadas.valorPorKg, 'cincadoEnCaliente_piezasPesadas')}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Actualizado: {formatDate(variables.cincadoEnCaliente.piezasPesadas.actualizadoEl)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bulones */}
            <Card>
              <CardHeader>
                <CardTitle>Bulones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-medium mb-4">Bulón Galvanizado</h3>
                    <Table>
                      <thead>
                        <TableRow>
                          <TableHead className="font-semibold text-slate-400 w-1/3">Medida</TableHead>
                          <TableHead className="font-semibold text-slate-400 w-1/4">Valor AR$</TableHead>
                          <TableHead className="font-semibold text-slate-400 w-1/4">Valor U$D</TableHead>
                          <TableHead className="font-semibold text-slate-400 w-1/6">Actualizado</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </thead>
                      <TableBody>
                        {variables.bulonGalvanizado.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="w-1/3">{item.medida}</TableCell>
                            <TableCell className="w-1/4">
                              <div className="flex items-center">
                                <span>$</span>
                                <RateToggle
                                  value={getAdjustedValue(item.valorPesos, `bulon_galvanizado_${item.medida.split('"')[0].replace(/[^0-9_]/g, '_')}`)}
                                  onChange={(increment) => adjustRate(`bulon_galvanizado_${item.medida.split('"')[0].replace(/[^0-9_]/g, '_')}`, increment)}
                                  onValueChange={(value) => handleDirectValueChange(`bulon_galvanizado_${item.medida.split('"')[0].replace(/[^0-9_]/g, '_')}`, value - item.valorPesos)}
                                />
                              </div>
                            </TableCell>
                            <TableCell className="w-1/4">U$D {formatUSD(item.valorPesos, `bulon_galvanizado_${item.medida.split('"')[0].replace(/[^0-9_]/g, '_')}`)}</TableCell>
                            <TableCell className="w-1/6">{formatDate(item.actualizadoEl)}</TableCell>
                            <TableCell className="w-[50px]">
                              <DeleteButton onClick={() => {
                                const newBulonGalvanizado = [...variables.bulonGalvanizado];
                                newBulonGalvanizado.splice(index, 1);
                                setVariables(prev => ({
                                  ...prev,
                                  bulonGalvanizado: newBulonGalvanizado
                                }));
                              }} />
                            </TableCell>
                          </TableRow>
                        ))}
                        {editingNew && editingType === 'bulonGalvanizado' && (
                          <TableRow>
                            <TableCell className="w-1/3">
                              {editingProveedor ? (
                                <Input
                                  autoFocus
                                  value={newRow.medida}
                                  onChange={(e) => setNewRow(prev => ({ ...prev, medida: e.target.value }))}
                                  onBlur={() => setEditingProveedor(false)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      setEditingProveedor(false);
                                    }
                                  }}
                                />
                              ) : (
                                <span
                                  onClick={() => setEditingProveedor(true)}
                                  className="cursor-pointer"
                                >
                                  {newRow.medida}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="w-1/4">
                              <div className="flex items-center">
                                <span>$</span>
                                <RateToggle
                                  value={newRow.valorPesos}
                                  onChange={(increment) =>
                                    setNewRow(prev => ({
                                      ...prev,
                                      valorPesos: Number((prev.valorPesos + (increment ? 0.01 : -0.01)).toFixed(2))
                                    }))
                                  }
                                  onValueChange={(value) =>
                                    setNewRow(prev => ({
                                      ...prev,
                                      valorPesos: value
                                    }))
                                  }
                                />
                              </div>
                            </TableCell>
                            <TableCell className="w-1/4">U$D {(newRow.valorPesos / dollarRate).toFixed(2)}</TableCell>
                            <TableCell className="w-1/6">{formatDate(new Date().toISOString())}</TableCell>
                            <TableCell className="space-x-2">
                              <Button
                                variant="default"
                                onClick={handleSaveNewRow}
                              >
                                Guardar
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-destructive hover:text-destructive/90"
                                onClick={() => {
                                  setEditingNew(false);
                                  setEditingType(null);
                                  setNewRow({
                                    medida: "Nuevo Bulón",
                                    valorPesos: 0,
                                    valorUSD: 0,
                                    actualizadoEl: new Date().toISOString().split('T')[0]
                                  });
                                }}
                                title="Cancelar"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    <p className="text-sm text-muted-foreground mt-2">incluyen arandela plana, arandela grower y tuerca</p>
                    <AddRowButton onClick={() => handleAddRow('bulonGalvanizado')} />
                  </div>
                  <div>
                    <h3 className="font-medium mb-4">Bulón Inoxidable</h3>
                    <Table>
                      <thead>
                        <TableRow>
                          <TableHead className="font-semibold text-slate-400 w-1/3">Medida</TableHead>
                          <TableHead className="font-semibold text-slate-400 w-1/4">Valor AR$</TableHead>
                          <TableHead className="font-semibold text-slate-400 w-1/4">Valor U$D</TableHead>
                          <TableHead className="font-semibold text-slate-400 w-1/6">Actualizado</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </thead>
                      <TableBody>
                        {variables.bulonInoxidable.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="w-1/3">{item.medida}</TableCell>
                            <TableCell className="w-1/4">
                              <div className="flex items-center">
                                <span>$</span>
                                <RateToggle
                                  value={getAdjustedValue(item.valorPesos, `bulon_inoxidable_${item.medida.split('"')[0].replace(/[^0-9_]/g, '_')}`)}
                                  onChange={(increment) => adjustRate(`bulon_inoxidable_${item.medida.split('"')[0].replace(/[^0-9_]/g, '_')}`, increment)}
                                  onValueChange={(value) => handleDirectValueChange(`bulon_inoxidable_${item.medida.split('"')[0].replace(/[^0-9_]/g, '_')}`, value - item.valorPesos)}
                                />
                              </div>
                            </TableCell>
                            <TableCell className="w-1/4">U$D {formatUSD(item.valorPesos, `bulon_inoxidable_${item.medida.split('"')[0].replace(/[^0-9_]/g, '_')}`)}</TableCell>
                            <TableCell className="w-1/6">{formatDate(item.actualizadoEl)}</TableCell>
                            <TableCell className="w-[50px]">
                              <DeleteButton onClick={() => {
                                const newBulonInoxidable = [...variables.bulonInoxidable];
                                newBulonInoxidable.splice(index, 1);
                                setVariables(prev => ({
                                  ...prev,
                                  bulonInoxidable: newBulonInoxidable
                                }));
                              }} />
                            </TableCell>
                          </TableRow>
                        ))}
                        {editingNew && editingType === 'bulonInoxidable' && (
                          <TableRow>
                            <TableCell className="w-1/3">
                              {editingProveedor ? (
                                <Input
                                  autoFocus
                                  value={newRow.medida}
                                  onChange={(e) => setNewRow(prev => ({ ...prev, medida: e.target.value }))}
                                  onBlur={() => setEditingProveedor(false)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      setEditingProveedor(false);
                                    }
                                  }}
                                />
                              ) : (
                                <span
                                  onClick={() => setEditingProveedor(true)}
                                  className="cursor-pointer"
                                >
                                  {newRow.medida}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="w-1/4">
                              <div className="flex items-center">
                                <span>$</span>
                                <RateToggle
                                  value={newRow.valorPesos}
                                  onChange={(increment) =>
                                    setNewRow(prev => ({
                                      ...prev,
                                      valorPesos: Number((prev.valorPesos + (increment ? 0.01 : -0.01)).toFixed(2))
                                    }))
                                  }
                                  onValueChange={(value) =>
                                    setNewRow(prev => ({
                                      ...prev,
                                      valorPesos: value
                                    }))
                                  }
                                />
                              </div>
                            </TableCell>
                            <TableCell className="w-1/4">U$D {(newRow.valorPesos / dollarRate).toFixed(2)}</TableCell>
                            <TableCell className="w-1/6">{formatDate(new Date().toISOString())}</TableCell>
                            <TableCell className="space-x-2">
                              <Button
                                variant="default"
                                onClick={handleSaveNewRow}
                              >
                                Guardar
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-destructive hover:text-destructive/90"
                                onClick={() => {
                                  setEditingNew(false);
                                  setEditingType(null);
                                  setNewRow({
                                    medida: "Nuevo Bulón",
                                    valorPesos: 0,
                                    valorUSD: 0,
                                    actualizadoEl: new Date().toISOString().split('T')[0]
                                  });
                                }}
                                title="Cancelar"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    <p className="text-sm text-muted-foreground mt-2">incluyen arandela plana, arandela grower y tuerca</p>
                    <AddRowButton onClick={() => handleAddRow('bulonInoxidable')} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Caballetes */}
            <Card>
              <CardHeader>
                <CardTitle>Caballetes</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <thead>
                    <TableRow>
                      <TableHead className="font-semibold text-slate-400 w-1/3">Tipo</TableHead>
                      <TableHead className="font-semibold text-slate-400 w-1/4">Valor AR$</TableHead>
                      <TableHead className="font-semibold text-slate-400 w-1/4">Valor U$D</TableHead>
                      <TableHead className="font-semibold text-slate-400 w-1/6">Actualizado</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </thead>
                  <TableBody>
                    <TableRow>
                      <TableCell className="w-1/3">Caballete Galvanizado</TableCell>
                      <TableCell className="w-1/4">
                        <div className="flex items-center">
                          <span>$</span>
                          <RateToggle
                            value={getAdjustedValue(variables.caballeteGalvanizado.valorPesos, 'caballete_galvanizado')}
                            onChange={(increment) => adjustRate('caballete_galvanizado', increment)}
                            onValueChange={(value) => handleDirectValueChange('caballete_galvanizado', value - variables.caballeteGalvanizado.valorPesos)}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="w-1/4">U$D {formatUSD(variables.caballeteGalvanizado.valorPesos, 'caballete_galvanizado')}</TableCell>
                      <TableCell className="w-1/6">{formatDate(variables.caballeteGalvanizado.actualizadoEl)}</TableCell>
                      <TableCell className="w-[50px]">
                        <DeleteButton onClick={() => {
                          const newVariables = { ...variables };
                          delete newVariables.caballeteGalvanizado;
                          setVariables(newVariables);
                        }} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="w-1/3">Caballete Inoxidable</TableCell>
                      <TableCell className="w-1/4">
                        <div className="flex items-center">
                          <span>$</span>
                          <RateToggle
                            value={getAdjustedValue(variables.caballeteInoxidable.valorPesos, 'caballete_inoxidable')}
                            onChange={(increment) => adjustRate('caballete_inoxidable', increment)}
                            onValueChange={(value) => handleDirectValueChange('caballete_inoxidable', value - variables.caballeteInoxidable.valorPesos)}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="w-1/4">U$D {formatUSD(variables.caballeteInoxidable.valorPesos, 'caballete_inoxidable')}</TableCell>
                      <TableCell className="w-1/6">{formatDate(variables.caballeteInoxidable.actualizadoEl)}</TableCell>
                      <TableCell className="w-[50px]">
                        <DeleteButton onClick={() => {
                          const newVariables = { ...variables };
                          delete newVariables.caballeteInoxidable;
                          setVariables(newVariables);
                        }} />
                      </TableCell>
                    </TableRow>
                    {editingNew && editingType === 'caballete' && (
                      <TableRow>
                        <TableCell className="w-1/3">
                          {editingProveedor ? (
                            <Input
                              autoFocus
                              value={newRow.tipo}
                              onChange={(e) => setNewRow(prev => ({ ...prev, tipo: e.target.value }))}
                              onBlur={() => setEditingProveedor(false)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  setEditingProveedor(false);
                                }
                              }}
                            />
                          ) : (
                            <span
                              onClick={() => setEditingProveedor(true)}
                              className="cursor-pointer"
                            >
                              {newRow.tipo}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="w-1/4">
                          <div className="flex items-center">
                            <span>$</span>
                            <RateToggle
                              value={newRow.valorPesos}
                              onChange={(increment) =>
                                setNewRow(prev => ({
                                  ...prev,
                                  valorPesos: Number((prev.valorPesos + (increment ? 0.01 : -0.01)).toFixed(2))
                                }))
                              }
                              onValueChange={(value) =>
                                setNewRow(prev => ({
                                  ...prev,
                                  valorPesos: value
                                }))
                              }
                            />
                          </div>
                        </TableCell>
                        <TableCell className="w-1/4">U$D {(newRow.valorPesos / dollarRate).toFixed(2)}</TableCell>
                        <TableCell className="w-1/6">{formatDate(new Date().toISOString())}</TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            variant="default"
                            onClick={handleSaveNewRow}
                          >
                            Guardar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive/90"
                            onClick={() => {
                              setEditingNew(false);
                              setEditingType(null);
                              setNewRow({
                                tipo: "Nuevo Caballete",
                                valorPesos: 0,
                                valorUSD: 0,
                                actualizadoEl: new Date().toISOString().split('T')[0]
                              });
                            }}
                            title="Cancelar"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <p className="text-sm text-muted-foreground mt-2">incluyen arandela plana, arandela grower y tuerca</p>
                <AddRowButton onClick={() => handleAddRow('caballete')} />
              </CardContent>
            </Card>

            {/* Mano de Obra */}
            <Card>
              <CardHeader>
                <CardTitle>Mano de Obra</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-4">Por Hora</h3>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-400 min-w-[100px]">Valor:</span>
                      <div className="flex items-center">
                        <span>$</span>
                        <RateToggle
                          value={getAdjustedValue(variables.manoDeObra.valorPorHora, 'manoDeObra_valorPorHora')}
                          onChange={(increment) => adjustRate('manoDeObra_valorPorHora', increment)}
                          onValueChange={(value) => handleDirectValueChange('manoDeObra_valorPorHora', value - variables.manoDeObra.valorPorHora)}
                        />
                      </div>
                    </div>
                    <p className="mt-2">USD: U$D {formatUSD(variables.manoDeObra.valorPorHora, 'manoDeObra_valorPorHora')}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Por Minuto</h3>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-400 min-w-[100px]">Valor:</span>
                      <div className="flex items-center">
                        <span>$</span>
                        <RateToggle
                          value={getAdjustedValue(variables.manoDeObra.valorPorMinuto, 'manoDeObra_valorPorMinuto')}                          onChange={(increment)=> adjustRate('manoDeObra_valorPorMinuto', increment)}
                          onValueChange={(value) => handleDirectValueChange('manoDeObra_valorPorMinuto', value - variables.manoDeObra.valorPorMinuto)}
                        />
                      </div>
                    </div>
                    <p className="mt-2">USD: U$D {formatUSD(variables.manoDeObra.valorPorMinuto, 'manoDeObra_valorPorMinuto')}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Actualizado: {formatDate(variables.manoDeObra.actualizadoEl)}
                </p>
              </CardContent>
            </Card>

            {/* Ganancia en Conectores */}
            <Card>
              <CardHeader>
                <CardTitle>Ganancia en Conectores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <span className="text-slate-400 min-w-[100px]">Porcentaje:</span>
                  <RateToggle
                    value={getAdjustedValue(variables.gananciaConectores.porcentaje, 'gananciaConectores')}
                    onChange={(increment) => adjustRate('gananciaConectores', increment)}
                    onValueChange={(value) => handleDirectValueChange('gananciaConectores', value - variables.gananciaConectores.porcentaje)}
                    isPercentage={true}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Actualizado: {formatDate(variables.gananciaConectores.actualizadoEl)}
                </p>
              </CardContent>
            </Card>

            {/* Plus Imprevistos */}
            <Card>
              <CardHeader>
                <CardTitle>Plus Imprevistos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-4">En Aluminio</h3>
                    <div className="flex items-center">
                      <span>Valor: $</span>
                      <RateToggle
                        value={getAdjustedValue(variables.plusImprevistosAluminio.valor, 'plusImprevistosAluminio')}
                        onChange={(increment) => adjustRate('plusImprevistosAluminio', increment)}
                        onValueChange={(value) => handleDirectValueChange('plusImprevistosAluminio', value - variables.plusImprevistosAluminio.valor)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Actualizado: {formatDate(variables.plusImprevistosAluminio.actualizadoEl)}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">En Bronce</h3>
                    <div className="flex items-center">
                      <span>Valor: $</span>
                      <RateToggle
                        value={getAdjustedValue(variables.plusImprevistosEnBronce.valor, 'plusImprevistosEnBronce')}
                        onChange={(increment) => adjustRate('plusImprevistosEnBronce', increment)}
                        onValueChange={(value) => handleDirectValueChange('plusImprevistosEnBronce', value - variables.plusImprevistosEnBronce.valor)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Actualizado: {formatDate(variables.plusImprevistosEnBronce.actualizadoEl)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
      </main>
    </div>
  );
}