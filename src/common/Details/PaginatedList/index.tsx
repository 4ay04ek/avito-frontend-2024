import { Episode } from "../../../entities/entities";

export type PaginatedListProps = {
  title: string;
  data: { name: string; photo: string; episodes?: Episode[] }[];
  total: number;
  onChange?: (page: number) => void;
  seasonEpisodes?: boolean;
};

declare const PaginatedList: (props: PaginatedListProps) => React.ReactNode;
export default PaginatedList;
