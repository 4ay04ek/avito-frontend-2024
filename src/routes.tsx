import { Flex } from "antd";
import Title from "antd/es/typography/Title";
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Details from "./common/Details";
import Main from "./common/Main";
import Random from "./common/Random";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "/details",
    element: <Details />,
  },
  {
    path: "/random",
    element: <Random />,
  },
  {
    path: "*",
    element: (
      <Flex
        style={{
          width: "100vw",
          justifyContent: "center",
        }}
      >
        <Title>NOT FOUND 404</Title>
      </Flex>
    ),
  },
]);
