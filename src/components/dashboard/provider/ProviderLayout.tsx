import { Outlet } from "react-router-dom";
import ProviderSidebar from "./ProviderSidebar";
import DashboardTopbar from "../DashboardTopbar";

export default function ProviderLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <ProviderSidebar />
      <div className="flex flex-1 flex-col">
        <DashboardTopbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
