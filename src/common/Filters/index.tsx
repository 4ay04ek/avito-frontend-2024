export type FilterProps = {
  onFilterChange: (filters: FilterType) => void;
};

export type FilterType = {
  "countries.name"?: string;
  ageRating?: string;
  year?: string;
};

declare const Filters: (props: FilterProps) => React.ReactNode;
export default Filters;
