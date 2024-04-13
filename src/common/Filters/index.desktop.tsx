import { Flex } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FilterProps, FilterType } from ".";
import Filter from "./Filter";
import { AGES, COUNTRIES, YEARS } from "./constants";
import "./styles";

const Filters = ({ onFilterChange }: FilterProps) => {
  const [qparams, setParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterType>({});
  const params = useRef(qparams);

  useEffect(() => {
    if (filters) {
      onFilterChange(filters);
    }
  }, [filters, onFilterChange]);

  useEffect(() => {
    Object.keys(filters).forEach((key) =>
      filters[key as keyof FilterType] === undefined
        ? delete filters[key as keyof FilterType]
        : {}
    );
    setParams(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]); //изменения параметров в другом месте вызовет ререндер, если оставить setParams

  useEffect(() => {
    if (params.current.has("q")) return;
    const tmpFilters: FilterType = {};
    const country = params.current.get("countries.name");
    if (country && COUNTRIES.includes(country) && country != COUNTRIES[0])
      tmpFilters["countries.name"] = country;

    const years = params.current.get("year");
    if (years && YEARS.includes(years) && years != YEARS[0])
      tmpFilters.year = years;

    const age = params.current.get("ageRating");
    if (age && AGES.includes(age) && age != AGES[0]) tmpFilters.ageRating = age;

    setFilters(tmpFilters);
  }, [params]);

  return (
    <Flex gap={15} className="filters">
      <Filter
        placeholder="Страна"
        options={COUNTRIES}
        onChangeFilter={(f) => setFilters(f)}
        currentFilters={filters}
        filterKey="countries.name"
        exceptValue={COUNTRIES[0]}
      />
      <Filter
        placeholder="Возрастн. ограничение"
        options={AGES}
        onChangeFilter={(f) => setFilters(f)}
        currentFilters={filters}
        filterKey="ageRating"
        exceptValue={AGES[0]}
      />
      <Filter
        placeholder="Годы"
        options={YEARS}
        onChangeFilter={(f) => setFilters(f)}
        currentFilters={filters}
        filterKey="year"
        exceptValue={YEARS[0]}
      />
    </Flex>
  );
};

export default Filters;
