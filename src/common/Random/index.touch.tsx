import { LoadingOutlined } from "@ant-design/icons";
import { Alert, Flex, Image, Select, Slider } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import React, { useReducer, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { useApiGenres, useApiRandom } from "../../hooks/useApi";
import { FALLBACK } from "../Content/constants";
import { COUNTRIES, NETWORK_TYPES, TYPES } from "../Filters/constants";
import "./styles";

const Random = () => {
  const [params, setParams] = useState({});
  const [confirmedParams, setConfirmedParams] = useState({});
  const [x, forceUpdate] = useReducer((x) => x + 1, 0);
  const navigate = useNavigate();
  const cookies = useRef(new Cookies());
  const auth = cookies.current.get("auth");
  const { data, loading, error } = useApiRandom({
    force: x,
    ...confirmedParams,
  });
  const { data: genres } = useApiGenres();
  if (!auth) return navigate("/");
  return (
    <Flex className="random" vertical align="center">
      {error && (
        <Alert
          message="Что-то пошло не так"
          type="error"
          showIcon
          closable
          className="errorAlert"
        />
      )}
      <Flex justify="center" style={{ width: "100vw" }}>
        <Title
          style={{ cursor: "pointer" }}
          onClick={() => {
            setConfirmedParams(params);
            forceUpdate();
          }}
        >
          Мне повезет
        </Title>
      </Flex>
      <Flex className="randomFilters" vertical gap={10}>
        <Select
          options={genres?.map((v) => ({ value: v.name, label: v.name }))}
          className="filterSelect"
          placement="bottomLeft"
          placeholder={"Жанр"}
          onChange={(v) => {
            setParams({ ...params, "genres.name": v });
          }}
        />
        <Select
          options={COUNTRIES.filter((v) => v != "Все страны").map((v) => ({
            value: v,
            label: v,
          }))}
          className="filterSelect"
          placement="bottomLeft"
          placeholder={"Страна"}
          onChange={(v) => {
            setParams({ ...params, "countries.name": v });
          }}
        />
        <Select
          options={TYPES.map((v) => ({
            value: v.value,
            label: v.label,
          }))}
          className="filterSelect"
          placement="bottomLeft"
          placeholder={"Тип"}
          onChange={(v) => {
            setParams({ ...params, type: v });
          }}
        />
        <Select
          options={NETWORK_TYPES.map((v) => ({
            value: v,
            label: v,
          }))}
          className="filterSelect"
          placement="bottomLeft"
          placeholder={"Сеть производства"}
          onChange={(v) => {
            setParams({ ...params, "networks.items.name": v });
          }}
        />
        <Flex>
          <Title
            style={{
              margin: 0,
              marginRight: 15,
              marginTop: -5,
              width: 100,
            }}
            level={5}
          >
            Рейтинг на Кинопоиске
          </Title>
          <Slider
            style={{ width: 200 }}
            marks={{ 0: "0", 10: "10" }}
            max={10}
            range
            defaultValue={[0, 10]}
            step={0.1}
            onChangeComplete={(v) =>
              setParams({ ...params, "rating.kp": `${v[0]}-${v[1]}` })
            }
          />
        </Flex>
      </Flex>
      {!loading && data?.name && (
        <Flex className="detailsMainBox">
          <Flex vertical>
            <div className="poster">
              <Link to={`/details?id=${data.id}`}>
                <Image
                  style={{ width: "90%" }}
                  src={data?.poster?.previewUrl || ""}
                  fallback={FALLBACK}
                  preview={false}
                />
              </Link>
            </div>
            <Flex style={{ width: "100%", justifyContent: "center" }}>
              <Title style={{ marginTop: 20 }} className="title">
                {data?.name}
              </Title>
            </Flex>
            <Flex vertical className="rating">
              <Title level={3}>Рейтинг</Title>
              <div>IMDb: {data?.rating?.imdb}</div>
              <div>Кинопоиск: {data?.rating?.kp}</div>
            </Flex>
            <Title level={3}>Описание</Title>
            <Paragraph className="description">{data?.description}</Paragraph>
          </Flex>
        </Flex>
      )}
      {loading && <LoadingOutlined className="loadingContent" />}
    </Flex>
  );
};

export default Random;
