import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import DemoWrapper from "./DemoWrapper.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DemoWrapper />
  </StrictMode>
);
