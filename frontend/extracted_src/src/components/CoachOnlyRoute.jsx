import { Outlet } from "react-router-dom";

function CoachOnlyRoute() {
  // Static access for viewing
  return <Outlet />;
}

export default CoachOnlyRoute;
