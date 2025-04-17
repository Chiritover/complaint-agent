import React from "react";
import ReactDOM from "react-dom/client";   // ← THIS line brings in ReactDOM
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Submit from "./pages/Submit";
import Admin from "./pages/Admin";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import "./index.css";

const router = createBrowserRouter([
  { path:"/login",element:<Login />},
  {
    path: "/",
    element: <Layout/>,
    children: [
      { path: "/submit", element: <Submit /> },
      { path: "/admin",  element: <Admin /> ,errorElement:<Navigate to="/login" replace/>},
      { index: true, element: <Submit /> }       // “/” → Submit
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);