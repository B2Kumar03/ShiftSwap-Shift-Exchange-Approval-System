import { LayoutDashboard, LogOut, Users, CalendarPlus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar() {
  const { pathname } = useLocation();
  const { user, logout } = useContext(AuthContext);

  // Only show links based on role
  const links = [
    { name: "Dashboard", icon: <LayoutDashboard />, path: "/dashboard" },
  ];

  if (user?.role === "manager") {
    links.push(
      { name: "Manager Panel", icon: <Users />, path: "/manager" },
      { name: "Schedule Shift", icon: <CalendarPlus />, path: "/schedule" }
    );
  }

  return (
    <aside className="w-64 hidden md:flex flex-col bg-[#0A1A34] p-4 text-white shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">ShiftSwap</h2>

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-2">
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-600 transition ${
              pathname === link.path ? "bg-blue-700" : ""
            }`}
          >
            {link.icon}
            {link.name}
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="mt-auto">
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 w-full rounded-lg hover:bg-red-600 bg-red-500 transition"
        >
          <LogOut /> Logout
        </button>
      </div>
    </aside>
  );
}
