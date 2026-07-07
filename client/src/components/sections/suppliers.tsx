import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const suppliers = [
  {
    id: 1,
    name: "Proveedor A",
    contact: "Juan Pérez",
    email: "juan@proveedora.com",
    phone: "+54 11 4567-8901",
  },
  {
    id: 2,
    name: "Proveedor B",
    contact: "María García",
    email: "maria@proveedorb.com",
    phone: "+54 11 2345-6789",
  },
];

export function Suppliers() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Proveedores</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Persona de Contacto</TableHead>
              <TableHead>Correo Electrónico</TableHead>
              <TableHead>Teléfono</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.contact}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>{supplier.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}