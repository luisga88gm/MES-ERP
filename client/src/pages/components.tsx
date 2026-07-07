import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown, ChevronUp, Pencil, Trash, Cpu } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBoltTypes } from "@/hooks/use-bolt-types";

type ComponentType = 'conector' | 'morseteria';

type ComponentFormData = {
  type: ComponentType;
  name: string;
  description: string;
  // Fields for Conectores
  alWeight?: number;
  brWeight?: number;
  minutesPerPiece: number;
  selectedBoltId?: string; // ID of the selected bolt from variables
  bolts?: number; // Quantity of bolts
  // Fields for Morsetería
  productProvider?: string;
  weight?: number;
  treatment?: string;
  // Common fields
  stock: number;
  minStock: number;
};

// Sample data for dropdowns
const providers = ["Proveedor A", "Proveedor B", "Proveedor C"];
const treatments = [
  "Cincado en caliente - pieza liviana",
  "Cincado en caliente - pieza pesada",
  "Otro tratamiento"
];

export default function ComponentsPage() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [selectedComponent, setSelectedComponent] = useState<any>(null);
  const [componentType, setComponentType] = useState<ComponentType>('conector');
  const { toast } = useToast();
  const { data: boltTypes = [] } = useBoltTypes();

  const form = useForm<ComponentFormData>({
    defaultValues: {
      type: 'conector',
      name: "",
      description: "",
      stock: 0,
      minStock: 0,
      minutesPerPiece: 0,
      selectedBoltId: "",
      bolts: 0
    },
  });

  const editForm = useForm<ComponentFormData>({
    defaultValues: {
      type: 'conector',
      name: "",
      description: "",
      stock: 0,
      minStock: 0,
      minutesPerPiece: 0
    },
  });

  const toggleRowExpansion = (id: number) => {
    setExpandedRows(prev => ({...prev, [id]: !prev[id]}));
  };

  const handleEdit = (component: any) => {
    setSelectedComponent(component);
    setComponentType(component.type);
    editForm.reset({
      ...component
    });
    setEditOpen(true);
  };

  const onEditSubmit = async (data: ComponentFormData) => {
    try {
      console.log("Editing component:", data);
      toast({
        title: "Component Updated",
        description: "The component has been updated successfully.",
      });
      setEditOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error updating the component.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: ComponentFormData) => {
    try {
      console.log("Creating component:", data);
      toast({
        title: "Component Created",
        description: "The component has been created successfully.",
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Error creating the component.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id: number) => {
    try {
      console.log("Deleting component:", id);
      toast({
        title: "Componente Eliminado",
        description: "El componente ha sido eliminado exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al eliminar el componente.",
        variant: "destructive",
      });
    }
  };

  const renderComponentList = (type: ComponentType) => {
    const filteredComponents = components.filter(c => c.type === type);

    if (filteredComponents.length === 0) return null;

    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/70">
          <h2 className="text-sm font-semibold text-slate-300 tracking-wider">{type === 'conector' ? 'CONECTORES' : 'MORSETERÍA'}</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/50">
              <th className="h-10 px-4 text-left font-medium text-slate-400 w-[200px]">Nombre</th>
              <th className="h-10 px-4 text-left font-medium text-slate-400 w-[300px]">Descripción</th>
              <th className="h-10 px-4 text-center font-medium text-slate-400 w-[100px]">Stock</th>
              <th className="h-10 px-4 text-center font-medium text-slate-400 w-[100px]">Stock Mínimo</th>
              <th className="h-10 px-4 text-center font-medium text-slate-400 w-[120px]">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredComponents.map((component) => (
              <tr key={component.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                <td className="p-4 text-slate-100 font-medium">{component.name}</td>
                <td className="p-4 text-slate-400">{component.description}</td>
                <td className="p-4 text-center">
                  <span className={`font-mono font-bold text-sm ${
                    component.stock <= component.minStock ? 'text-rose-400' : 'text-emerald-400'
                  }`}>{component.stock}</span>
                </td>
                <td className="p-4 text-center text-slate-400 font-mono text-sm">{component.minStock}</td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-slate-500 hover:text-cyan-400 hover:bg-slate-700"
                      onClick={() => toggleRowExpansion(component.id)}
                    >
                      {expandedRows[component.id] ?
                        <ChevronUp className="h-4 w-4" /> :
                        <ChevronDown className="h-4 w-4" />
                      }
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-slate-500 hover:text-blue-400 hover:bg-slate-700"
                      onClick={() => handleEdit(component)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-500 hover:text-rose-400 hover:bg-slate-700"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-slate-900 border-slate-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-slate-100">¿Está seguro?</AlertDialogTitle>
                          <AlertDialogDescription className="text-slate-400">
                            Esta acción no se puede deshacer. Se eliminará permanentemente el componente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-slate-700 text-slate-300 hover:bg-slate-800">Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(component.id)}
                            className="bg-rose-600 hover:bg-rose-500 text-white"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="h-5 w-5 text-cyan-500" />
            Componentes
          </h1>
          <p className="text-xs text-slate-500 mt-1">Conectores, morsetería y piezas del catálogo</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-600 hover:bg-cyan-500 text-white gap-2">
              <Plus className="h-4 w-4" /> Nuevo Componente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl bg-slate-900 border-slate-700 text-slate-100">
                <DialogHeader>
                  <DialogTitle className="text-slate-100">Crear Componente</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Complete los detalles del nuevo componente
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Nombre del componente" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo</FormLabel>
                            <Select
                              onValueChange={(value: ComponentType) => {
                                field.onChange(value);
                                setComponentType(value);
                              }}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar tipo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="conector">Conector</SelectItem>
                                <SelectItem value="morseteria">Morsetería</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Descripción del componente" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Conditional Fields Based on Type */}
                    {componentType === 'conector' ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="alWeight"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>kg / pieza en Aluminio</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="brWeight"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>kg / pieza en Bronce</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="minutesPerPiece"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>minutos / pieza</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="selectedBoltId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tipo de Bulón</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Seleccionar bulón" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {boltTypes.map((bolt) => (
                                      <SelectItem key={bolt.id} value={bolt.id}>
                                        {bolt.type} {bolt.medida} - ${bolt.valorPesos}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="bolts"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cantidad de bulones</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="productProvider"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Producto de Proveedor</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccione un producto-proveedor" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {providers.map((provider) => (
                                    <SelectItem key={provider} value={provider}>
                                      {provider}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="weight"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>kg / pieza</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="minutesPerPiece"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>minutos / pieza</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="treatment"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tratamiento</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccione un tratamiento" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {treatments.map((treatment) => (
                                    <SelectItem key={treatment} value={treatment}>
                                      {treatment}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* Stock Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stock</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="minStock"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stock Mínimo</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white">
                       Crear Componente
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
      </div>

      {/* Component Lists */}
      <div className="space-y-6">
        {renderComponentList('conector')}
        {renderComponentList('morseteria')}
      </div>
    </MainLayout>
  );
}

// Sample data - will be replaced with actual API data
const components = [
  {
    id: 1,
    type: 'conector' as ComponentType,
    name: "R X1",
    description: "Módulo de Cable 13mm RECTO",
    stock: 100,
    minStock: 20,
    alWeight: 0.21,
    brWeight: 0.70,
    minutesPerPiece: 18,
    bolts: 4,
    boltType: 'galvanizado',
    boltMeasurement: '10mm'
  },
  {
    id: 2,
    type: 'morseteria' as ComponentType,
    name: "Componente B",
    description: "Descripción del componente B",
    stock: 50,
    minStock: 10,
    productProvider: "Proveedor A",
    weight: 1.5,
    minutesPerPiece: 25,
    treatment: "Cincado en caliente - pieza liviana"
  },
];