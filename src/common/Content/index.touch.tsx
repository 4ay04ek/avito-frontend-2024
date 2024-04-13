import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Image } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ContentProps } from ".";
import { FALLBACK } from "./constants";
import "./styles";

const Content = ({ data, loading }: ContentProps) => {
  const [params] = useSearchParams();
  const [imageLoading, setImageLoading] = useState(false);
  useEffect(() => {
    setImageLoading(Boolean(loading));
  }, [loading]);
  return (
    <Flex gap={15} className="content" wrap="wrap">
      {loading && <LoadingOutlined className="loadingContent" />}
      {!imageLoading &&
        data?.docs.map((movie, i) => (
          <Link to={`/details?id=${movie.id}&${params.toString()}`} key={i}>
            <Image
              src={movie.poster?.previewUrl || ""}
              preview={false}
              fallback={FALLBACK}
              onChange={() => setImageLoading(false)}
            />
          </Link>
        ))}
    </Flex>
  );
};

export default Content;
