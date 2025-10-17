import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children, links, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleCloseSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-[--color-arena]">
      <Sidebar
        links={links}
        user={user}
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
      />

      <div className="flex-1 flex flex-col">
        <Navbar title="Panel Carbono Cer0" onToggleSidebar={handleToggleSidebar} />
        <main className="flex-1 p-6 sm:p-10 transition-all">{children}</main>
      </div>
    </div>
  );
}
