import React, {StrictMode} from "react";
import ReactDOM from "react-dom/client";
import { initBolt } from "../lib/utils/bolt";
import "../index.scss";
import { App } from "./main";

initBolt();

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
