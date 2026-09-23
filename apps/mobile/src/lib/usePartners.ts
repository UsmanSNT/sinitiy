import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import type { PartnerCompany } from "@sinity/shared";
import { api } from "./api";

// Sahifa ochilganda (va unga qaytilganda) hamkor tashkilotlarni serverdan oladi.
export function usePartners() {
  const [items, setItems] = useState<PartnerCompany[] | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setError(false);
    api
      .get<PartnerCompany[]>("/partners")
      .then(setItems)
      .catch(() => setError(true));
  }, []);

  useFocusEffect(load);

  return { items: items ?? [], loading: items === null && !error, error };
}
