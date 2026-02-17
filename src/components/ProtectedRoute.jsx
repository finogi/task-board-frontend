import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isAuth =
    localStorage.getItem("isAuth") === "true" ||
    sessionStorage.getItem("isAuth") === "true";

  return isAuth ? children : <Navigate to="/" />;
}

export default ProtectedRoute;