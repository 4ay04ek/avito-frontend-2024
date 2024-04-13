import { ManyMovies } from "../../entities/entities";

export type ContentProps = {
  data?: ManyMovies;
  loading?: boolean;
};

declare const Content: (props: ContentProps) => React.ReactNode;
export default Content;
