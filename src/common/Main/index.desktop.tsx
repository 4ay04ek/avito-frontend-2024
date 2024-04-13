import { Alert, Flex, Pagination } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Cookies from "universal-cookie";
import { useDebounce } from "use-debounce";
import { ManyMovies } from "../../entities/entities";
import { useApiMovies, useApiSearch } from "../../hooks/useApi";
import Content from "../Content";
import Filters, { FilterType } from "../Filters";
import RndNAuth from "../RndNAuth";
import Search from "../Search";
import "./styles";

type PageParams = { page?: string; limit?: string };

const Main = () => {
  const [params] = useSearchParams();
  const [force, setForce] = useState<number>();
  const [data, setData] = useState<ManyMovies>();
  const [filters, setFilters] = useState<FilterType>();
  const [pageParams, setPageParams] = useState<PageParams>();
  const [query, setQuery] = useState<string>();
  const lastQuery = useRef<string>();
  const cookies = useRef(new Cookies());
  const {
    loading: basicLoading,
    data: basicData,
    error: basicError,
  } = useApiMovies(
    { ...filters, ...pageParams },
    params.has("year") ||
      params.has("ageRating") ||
      params.has("countries.name") ||
      params.has("q")
  );
  const {
    loading: searchLoading,
    data: searchData,
    error: searchError,
  } = useApiSearch(
    query ? { query, ...pageParams, force: String(force) } : undefined,
    true
  );
  useEffect(() => {
    if (basicData) setData(basicData);
  }, [basicData]);
  useEffect(() => {
    if (searchData) {
      setData(searchData);
      const queryHistory: string[] =
        cookies.current.get("qH")?.split(",") || [];
      if (!queryHistory.includes(lastQuery.current!))
        queryHistory.unshift(lastQuery.current!);
      cookies.current.set("qH", queryHistory.join(","));
    }
  }, [searchData]);
  const errorVisible = useMemo(
    () => basicError || searchError,
    [basicError, searchError]
  );
  const [paginationLoading] = useDebounce(basicLoading || searchLoading, 200);
  return (
    <div className="box">
      <RndNAuth />
      {errorVisible && (
        <Alert
          message="Что-то пошло не так"
          type="error"
          showIcon
          closable
          className="errorAlert"
        />
      )}
      <Flex vertical gap={35} className="main" align="center">
        <Search
          onSearchDone={(v, force) => {
            setQuery(v);
            lastQuery.current = v;
            force ? setForce(Math.random()) : undefined;
          }}
          loading={searchLoading}
        />
        <Filters onFilterChange={(f) => setFilters(f)} />
        <Content data={data} loading={basicLoading || searchLoading} />
        {!paginationLoading &&
          !basicLoading &&
          !searchLoading &&
          data?.total && (
            <Pagination
              defaultCurrent={Number(pageParams?.page) || 1}
              total={data.total}
              onChange={(page, limit) => {
                setPageParams({ page: `${page}`, limit: `${limit}` });
              }}
              style={{ marginTop: 10 }}
            />
          )}
      </Flex>
    </div>
  );
};

export default Main;
