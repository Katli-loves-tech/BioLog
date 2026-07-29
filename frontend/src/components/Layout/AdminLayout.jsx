import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

// Wraps every /admin/* route. Outlet renders whichever admin page is
// currently active, while Sidebar stays mounted and visible the whole time.
export default function AdminLayout() {
  return (
    <div>
      <Sidebar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
