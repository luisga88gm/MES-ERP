import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const logistics = [
  {
    id: 1,
    orderNumber: "LOG-001",
    destination: "Buenos Aires",
    status: "In Transit",
    transportCompany: "TransporteBA",
    estimatedDelivery: "2024-02-25",
  },
  {
    id: 2,
    orderNumber: "LOG-002",
    destination: "Córdoba",
    status: "Scheduled",
    transportCompany: "ExpresoCentral",
    estimatedDelivery: "2024-02-28",
  },
];

export function Logistics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Logistics</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Transport Company</TableHead>
              <TableHead>Estimated Delivery</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logistics.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.orderNumber}</TableCell>
                <TableCell>{log.destination}</TableCell>
                <TableCell>{log.status}</TableCell>
                <TableCell>{log.transportCompany}</TableCell>
                <TableCell>{log.estimatedDelivery}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
