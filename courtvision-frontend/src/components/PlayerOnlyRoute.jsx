import { Outlet } from "react-router-dom"

function PlayerOnlyRoute() {
  // Static access for viewing - no authentication check for development
  console.log("Rendering PlayerOnlyRoute")
  return <Outlet />
}

export default PlayerOnlyRoute
