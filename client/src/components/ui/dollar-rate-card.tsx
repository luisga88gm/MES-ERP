import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export function DollarRateCard() {
  const [rate, setRate] = useState<number>(1071.20);
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.setQueryData(["dollarRate"], rate);
  }, [rate, queryClient]);

  const adjustRate = (increment: boolean) => {
    setRate(prev => {
      const step = 0.01;
      return Number((prev + (increment ? step : -step)).toFixed(2));
    });
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-400">Exchange Rate Control</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-slate-100">
              1 U$D = $ {rate.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-500">source: bna.com.ar</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
              onClick={() => adjustRate(false)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
              onClick={() => adjustRate(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}