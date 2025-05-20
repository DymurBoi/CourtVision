import { Outlet } from "react-router-dom";

function AdminOnlyRoute() {
  // Static access for viewing
  return <Outlet />;
}

export default AdminOnlyRoute;
