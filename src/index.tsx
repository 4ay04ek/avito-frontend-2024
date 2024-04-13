import { ConfigProvider, theme } from "antd";
import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <ConfigProvider
    theme={{
      algorithm: theme.darkAlgorithm,
    }}
  >
    <RouterProvider router={router} />
  </ConfigProvider>
);
