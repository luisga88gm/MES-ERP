import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const workOrders = [
  {
    id: 1,
    title: "Machine Repair",
    client: "ABC Corp",
    status: "In Progress",
    dueDate: "2024-04-15",
  },
  {
    id: 2,
    title: "Installation",
    client: "XYZ Ltd",
    status: "Pending",
    dueDate: "2024-04-20",
  },
];

export function WorkOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.title}</TableCell>
                <TableCell>{order.client}</TableCell>
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
