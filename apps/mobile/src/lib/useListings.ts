import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import type { Listing, ListingType, PaginatedResult } from "@sinity/shared";
import { api } from "./api";

// Sahifa ochilganda (va unga qaytilganda) tasdiqlangan e'lonlarni serverdan oladi.
export function useListings(listingType: ListingType) {
  const [items, setItems] = useState<Listing[] | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setError(false);
    api
      .get<PaginatedResult<Listing>>(`/listings?listingType=${listingType}&pageSize=50`)
      .then((res) => setItems(res.items))
      .catch(() => setError(true));
  }, [listingType]);

  useFocusEffect(load);

  return { items: items ?? [], loading: items === null && !error, error, reload: load };
}
