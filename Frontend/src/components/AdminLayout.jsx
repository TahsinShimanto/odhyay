import { Outlet } from "react-router";
import { useState } from "react";
import AdminHeader from "./AdminHeader.jsx";
import AdminSidebar from "./AdminSidebar.jsx";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout" style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar  isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <div style={{ flex: 1}}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
