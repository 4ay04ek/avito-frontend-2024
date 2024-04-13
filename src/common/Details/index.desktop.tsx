import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Card, Carousel, Flex, Image, Pagination } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  useApiImages,
  useApiMovie,
  useApiReviews,
  useApiSeasons,
} from "../../hooks/useApi";
import { FALLBACK } from "../Content/constants";
import PaginatedList from "./PaginatedList";
import "./styles";

const REVIEW_LIMIT = 2;
const DEFAULT_LIMIT = 10;

const Details = () => {
  const [actorsIndex, setActorsIndex] = useState(1);
  const [seasonsIndex, setSeasonsIndex] = useState(1);
  const [reviewIndex, setReviewIndex] = useState(1);
  const [params] = useSearchParams();
  const id = params.get("id") || "";
  const { data: movie } = useApiMovie(id);
  const { data: reviews } = useApiReviews(id, reviewIndex, REVIEW_LIMIT);
  const { data: seasons } = useApiSeasons(id, seasonsIndex);
  const { data: images } = useApiImages(id);
  return (
    <Flex vertical className="details">
      <Link to={`/?${params.toString()}`}>
        <Title level={4} className="back">
          К поиску
        </Title>
      </Link>
      <Flex className="detailsMainBox">
        <div className="poster">
          <Image
            src={movie?.poster?.previewUrl || ""}
            fallback={FALLBACK}
            width={350}
          />
        </div>
        <Flex vertical>
          <Title style={{ marginTop: 40 }} className="title">
            {movie?.name}
          </Title>
          <Flex vertical className="rating">
            <Title level={3}>Рейтинг</Title>
            <div>IMDb: {movie?.rating?.imdb}</div>
            <div>Кинопоиск: {movie?.rating?.kp}</div>
          </Flex>
          <Title level={3}>Описание</Title>
          <Paragraph className="description">{movie?.description}</Paragraph>
        </Flex>
      </Flex>
      <Flex vertical className="detailsOtherBox">
        <PaginatedList
          title="Актеры"
          data={
            movie?.persons
              ?.filter((v) => v.profession == "актеры")
              ?.slice(
                (actorsIndex - 1) * DEFAULT_LIMIT,
                actorsIndex * DEFAULT_LIMIT
              )
              .map((v) => ({
                name: v.name || "",
                photo: v.photo || "",
              })) || []
          }
          total={
            movie?.persons?.filter((v) => v.profession == "актеры").length || 0
          }
          onChange={(p) => setActorsIndex(p)}
        ></PaginatedList>
        <PaginatedList
          title="Сезоны"
          data={
            seasons?.docs
              .sort((a, b) => Number(a.number) - Number(b.number))
              .map((v) => ({
                name: v.name || "",
                photo: v.poster?.previewUrl || "",
                episodes: v.episodes,
              })) || []
          }
          seasonEpisodes
          total={seasons?.total || 0}
          onChange={(p) => setSeasonsIndex(p)}
        ></PaginatedList>
        <>
          <Flex align="center">
            <Title>Отзывы</Title>
          </Flex>
          <Flex className="reviewRow">
            {reviews?.docs.map((v, ii) => (
              <Card
                key={ii}
                className="reviewCard"
                title={
                  <Flex vertical gap={10} style={{ margin: "15px 0" }}>
                    <div>{v.author}</div>
                    <div>{v.title}</div>
                  </Flex>
                }
              >
                <Paragraph className="reviewText">{v.review}</Paragraph>
              </Card>
            ))}
          </Flex>
          {(reviews?.total || 0) > 2 && (
            <Pagination
              defaultCurrent={1}
              total={reviews?.total}
              style={{ marginTop: 10 }}
              onChange={(p) => setReviewIndex(p)}
              showSizeChanger={false}
            />
          )}
          {reviews?.docs.length == 0 && (
            <Flex align="center">
              <Title level={3}>Нет отзывов</Title>
            </Flex>
          )}
        </>
        <Flex align="center">
          <Title>Изображения</Title>
        </Flex>
        {images?.total != 0 && (
          <Carousel
            arrows
            prevArrow={<LeftOutlined />}
            nextArrow={<RightOutlined />}
            className="carousel"
            slidesPerRow={6}
            dots={false}
          >
            {images?.docs.map((v, i) => (
              <div key={i}>
                <Flex
                  vertical
                  style={{
                    margin: 10,
                    justifyContent: "center",
                    height: 200,
                  }}
                >
                  <Image src={v.previewUrl} />
                </Flex>
              </div>
            ))}
          </Carousel>
        )}
        {images?.total == 0 && (
          <Flex align="center">
            <Title level={3}>Нет изображений</Title>
          </Flex>
        )}
        <Flex align="center">
          <Title>Похожие фильмы</Title>
        </Flex>
        {movie?.similarMovies?.length != 0 && (
          <Carousel
            arrows
            prevArrow={<LeftOutlined />}
            nextArrow={<RightOutlined />}
            className="carousel"
            slidesPerRow={5}
            dots={false}
          >
            {movie?.similarMovies?.map((v, i) => (
              <div key={i}>
                <Flex vertical className="similarMovieCard" key={i}>
                  <Link to={`/details?id=${v.id}&${params.toString()}`}>
                    <Image src={v.poster?.previewUrl || ""} preview={false} />
                  </Link>
                  <div>{v.name}</div>
                </Flex>
              </div>
            ))}
          </Carousel>
        )}
        {movie?.similarMovies?.length == 0 && (
          <Flex align="center">
            <Title level={3}>Нет информации о похожих фильмах</Title>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default Details;
