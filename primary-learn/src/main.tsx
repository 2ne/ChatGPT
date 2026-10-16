import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { PipMoodProvider } from "./components/PipMood";
import { installSoundUi } from "./lib/sound";
import "./index.css";

installSoundUi();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <PipMoodProvider>
        <App />
      </PipMoodProvider>
    </HashRouter>
  </StrictMode>,
);
