import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { TaskProvider } from "./context/TaskContext";



ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <TaskProvider>
      <App />
    </TaskProvider>
  </BrowserRouter>
);
