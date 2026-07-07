import { useQuery } from "@tanstack/react-query";

export function useDollarRate() {
  return useQuery({
    queryKey: ["dollarRate"],
    queryFn: () => Promise.resolve(1071.20),  // This will be replaced with actual API call later
    initialData: 1071.20
  });
}