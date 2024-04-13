import { Select } from "antd";
import React from "react";
import { FilterType } from "..";
import "./styles";

export type FilterProps = {
  placeholder: string;
  options: string[];
  onChangeFilter: (filter: FilterType) => void;
  currentFilters: FilterType;
  filterKey: string;
  exceptValue: string;
};

const Filter = ({
  placeholder,
  options,
  onChangeFilter,
  currentFilters,
  filterKey,
  exceptValue,
}: FilterProps) => {
  const onChange = (v: string) => {
    onChangeFilter({
      ...currentFilters,
      [filterKey]: v == exceptValue ? undefined : v,
    });
  };
  return (
    <Select
      options={options.map((v) => ({
        value: v,
        label: v,
      }))}
      className="filterSelect"
      placement="bottomLeft"
      placeholder={placeholder}
      onChange={onChange}
      value={currentFilters[filterKey as keyof FilterType]}
    />
  );
};

export default Filter;
