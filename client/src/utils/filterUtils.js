import { defaultFilterValues } from "../reducers/filter";

export const getDefaultFilters = () => ({
  priceRange: { ...defaultFilterValues.priceRange },
  rating: defaultFilterValues.rating,
  experience: defaultFilterValues.experience,
});
