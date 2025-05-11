import { useState, useEffect, useContext } from "react";
import { UserCircle, LogOut, Bell, X } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; // Update path if needed
import dayjs from "dayjs";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const userId = user?._id;

  // Fetch notifications on mount
  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:8080/api/notification/${userId}`)
        .then((res) => {
          console.log("Notifications:", res.data);
          const all = res.data.notifications || [];
          setNotifications(all);
          setUnreadCount(all.filter((n) => !n.read).length);
        })
        .catch(console.error);
    }
  }, [userId]);

  const handleNotificationClick = async () => {
    setShowNotifications(!showNotifications);
    if (unreadCount > 0) {
      console.log("Marking all as read",unreadCount);
      try {
      await axios.post(`http://localhost:8080/api/notifications/${userId}`);
        setUnreadCount(0);
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, read: true }))
        );
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/notification/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  return (
    <header className="w-full px-6 py-3 bg-black text-white flex items-center justify-between shadow-md relative">
      <h1 className="text-xl font-bold tracking-wide"></h1>

      <div className="flex items-center gap-4 relative">
        {/* Notification Icon */}
        <div className="relative cursor-pointer" onClick={handleNotificationClick}>
          <Bell />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        {/* Notification Dropdown */}
        {showNotifications && (
          <div className="absolute right-16 top-12 bg-white text-black w-80 shadow-lg rounded-lg p-4 z-10">
            <h4 className="font-semibold text-gray-800 mb-2">Notifications</h4>
            <ul className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {notifications.length > 0 ? (
                notifications.map((note) => (
                  <li key={note._id} className="border-l-4 border-blue-600 pl-3 relative">
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="absolute right-0 top-0 text-gray-500 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                    <p className="font-medium text-sm">{note.message}</p>
                    <p className="text-xs text-gray-600">
                      {dayjs(note.timestamp).format("DD MMM YYYY [at] hh:mm A")}
                    </p>
                  </li>
                ))
              ) : (
                <p className="text-sm text-center text-gray-500">No notifications</p>
              )}
            </ul>
          </div>
        )}

        {/* Profile and Logout */}
        <div className="w-8 h-8 bg-gray-700 text-white rounded-full flex items-center justify-center font-bold text-sm uppercase">
          {user?.name?.charAt(0) || "?"}
        </div>
        <button
          className="flex items-center gap-1 hover:text-red-400 transition"
          onClick={logout}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </header>
  );
}
