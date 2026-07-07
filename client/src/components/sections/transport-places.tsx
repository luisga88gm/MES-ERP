import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const transportPlaces = [
  {
    id: 1,
    name: "ExpresoCentral",
    address: "Av. Corrientes 1234, CABA",
    contact: "Juan Pérez",
    phone: "+54 11 4567-8901",
    zones: "CABA, GBA Norte",
  },
  {
    id: 2,
    name: "TransporteBA",
    address: "Av. Rivadavia 5678, CABA",
    contact: "María García",
    phone: "+54 11 2345-6789",
    zones: "CABA, GBA Sur",
  },
];

export function TransportPlaces() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transportes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Zonas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transportPlaces.map((place) => (
              <TableRow key={place.id}>
                <TableCell>{place.name}</TableCell>
                <TableCell>{place.address}</TableCell>
                <TableCell>{place.contact}</TableCell>
                <TableCell>{place.phone}</TableCell>
                <TableCell>{place.zones}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}