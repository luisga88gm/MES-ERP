import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const productionOrders = [
  {
    id: 1,
    title: "Production Batch #1",
    product: "Steel Frame",
    quantity: 50,
    status: "In Progress",
    dueDate: "2024-04-15",
  },
  {
    id: 2,
    title: "Production Batch #2",
    product: "Aluminum Parts",
    quantity: 100,
    status: "Pending",
    dueDate: "2024-04-20",
  },
];

export function ProductionOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Production Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productionOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.title}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.dueDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
