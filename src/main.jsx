import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.jsx";
import "./style.css";

const root = document.getElementById("root");
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// The production build is prerendered (see scripts/prerender.js); `npm run dev` is not.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
