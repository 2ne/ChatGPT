import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { PipMoodProvider } from "./components/PipMood";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PipMoodProvider>
      <App />
    </PipMoodProvider>
  </StrictMode>,
);
