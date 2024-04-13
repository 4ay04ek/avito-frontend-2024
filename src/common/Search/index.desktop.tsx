import { AutoComplete, Input, SelectProps } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Cookies from "universal-cookie";
import { useDebounce } from "use-debounce";
import { SearchProps } from ".";
import "./styles";

const Search = ({ onSearchDone, loading }: SearchProps) => {
  const byText = (v: string) =>
    queryHistory.current
      ?.filter((q) => q.toLowerCase().includes(v.toLowerCase()))
      .map((q) => ({ value: q, label: q })) || [];

  const [qparams, setParams] = useSearchParams();
  const params = useRef(qparams);
  const [options, setOptions] = useState<SelectProps<object>["options"]>([]);
  const [text, setText] = useState<string>();
  const [query] = useDebounce(text, 1000);
  const cookies = useRef(new Cookies());
  const queryHistory = useRef<string[]>();
  useEffect(() => {
    onSearchDone(query);
  }, [query, onSearchDone]);

  useEffect(() => {
    if (query) setParams({ q: query });
    else setParams({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]); //изменения параметров в другом месте вызовет ререндер, если оставить setParams

  useEffect(() => {
    queryHistory.current = cookies.current.get("qH")?.split(",") || [];
  }, [loading]);

  useEffect(() => {
    const q = params.current.get("q");
    if (q) setText(q);
  }, [params]);

  const forceSearch = () => {
    onSearchDone(query, true);
    if (query) setParams({ q: query });
  };

  return (
    <div className="search">
      <AutoComplete
        style={{ width: "100%" }}
        placeholder="Поиск"
        options={options}
        onSearch={(v) => (v ? setOptions(byText(v)) : setOptions([]))}
        onChange={(v) => setText(v)}
        value={text}
      >
        <Input.Search
          onPressEnter={forceSearch}
          size="large"
          variant="filled"
          onSearch={(v) => setText(v)}
          onChange={(v) => setText(v.target.value)}
        />
      </AutoComplete>
    </div>
  );
};

export default Search;
