import { Outlet } from "react-router-dom";
import DashboardHeader from "../component/DashboardHeader";
export default function DashboardLayout() {
  return (
    <div className="dashboard-container">
      <DashboardHeader />
      <main className="dashboard-main-content">
        <Outlet />
      </main>
    </div>
  );
}
