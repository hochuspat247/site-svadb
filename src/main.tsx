
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import AdminPage from "./app/admin/AdminPage.tsx";
import "./styles/index.css";

const isAdminRoute = window.location.pathname.startsWith("/admin");

createRoot(document.getElementById("root")!).render(
  isAdminRoute ? <AdminPage /> : <App />,
);
  
