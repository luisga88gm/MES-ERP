import { useQuery } from "@tanstack/react-query";

export interface BoltType {
  id: string;
  medida: string;
  type: 'galvanizado' | 'inoxidable';
  valorPesos: number;
  valorUSD: number;
  actualizadoEl: string;
}

export function useBoltTypes() {
  return useQuery({
    queryKey: ["/api/variables/bolts"],
    queryFn: async () => {
      const response = await fetch("/api/variables/bolts");
      if (!response.ok) {
        throw new Error("Failed to fetch bolt types");
      }
      const data = await response.json();
      return data as BoltType[];
    },
  });
}