import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const quotations = [
  {
    id: 1,
    title: "Construcción de Estructura Metálica",
    client: "ABC Corporation",
    amount: 25000,
    status: "Pendiente",
    date: "2024-02-20",
  },
  {
    id: 2,
    title: "Equipamiento Industrial",
    client: "XYZ Limited",
    amount: 15000,
    status: "Aprobado",
    date: "2024-02-19",
  },
];

export function Quotations() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cotizaciones</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotations.map((quotation) => (
              <TableRow key={quotation.id}>
                <TableCell>{quotation.title}</TableCell>
                <TableCell>{quotation.client}</TableCell>
                <TableCell>${quotation.amount.toLocaleString()}</TableCell>
                <TableCell>{quotation.status}</TableCell>
                <TableCell>{quotation.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}