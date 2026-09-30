import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface Props {
  children: React.ReactNode;
}

interface JwtPayload {
  role?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
}

export default function ProtectedAdminRoute({
  children,
}: Props) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  let userRole = "";

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    userRole =
      decoded.role ??
      decoded[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ] ??
      "";
  } catch {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}