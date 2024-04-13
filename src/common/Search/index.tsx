export type SearchProps = {
  onSearchDone: (query?: string, force?: boolean) => void;
  loading: boolean;
};

declare const Search: (props: SearchProps) => React.ReactNode;
export default Search;
