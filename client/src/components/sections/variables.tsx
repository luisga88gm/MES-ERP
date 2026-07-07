import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

interface MaterialRate {
  id: number;
  name: string;
  rate: number;
  unit: string;
}

const initialRates: MaterialRate[] = [
  { id: 1, name: "Acero", rate: 123.45, unit: "valor por kg" },
  { id: 2, name: "Aluminio", rate: 150.45, unit: "valor por kg" },
  { id: 3, name: "Galvanizado", rate: 120.45, unit: "valor por kg" },
];

export function Variables() {
  const [rates, setRates] = useState<MaterialRate[]>(initialRates);

  const formatCurrency = (value: number) => {
    return `U$D ${value.toFixed(2).replace('.', ',')}`;
  };

  const adjustRate = (id: number, increment: boolean) => {
    setRates(prev =>
      prev.map(rate =>
        rate.id === id
          ? { ...rate, rate: parseFloat((rate.rate + (increment ? 0.01 : -0.01)).toFixed(2)) }
          : rate
      )
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {rates.map((material) => (
        <Card key={material.id}>
          <CardHeader>
            <CardTitle>{material.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {formatCurrency(material.rate)}
                <span className="text-sm text-muted-foreground ml-2">
                  {material.unit}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => adjustRate(material.id, false)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => adjustRate(material.id, true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}