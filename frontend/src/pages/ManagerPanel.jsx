import { useContext, useEffect, useState } from "react";
import Sidebar from "../component/Sidebar";
import SwapRequest from "../component/SwapRequest";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

export default function ManagerPanel() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const {user}= useContext(AuthContext);

  // Fetch all swap requests
  const fetchRequests = () => {
    setLoading(true);
    fetch("http://localhost:8080/api/swap/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRequests(data.swaps || []);
      })
      .catch((err) => {
        console.error("Error fetching swap requests:", err);
        toast.error("Failed to fetch swap requests.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, [token]);

  const handleDecision = async (id, action) => {
    console.log(`Performing ${action} on request ID: ${id}`);
    const url = `http://localhost:8080/api/swap/${action}/${id}`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (res.ok) {
        toast.success(`Request ${action === "approve" ? "approved" : "rejected"} successfully`);
        fetchRequests(); // Refresh data
      } else {
        throw new Error(result.message || "Action failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to perform action");
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/report/download", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to download report");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ShiftSwap_Report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Report downloaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download report");
    }
  };

  const pendingRequests = requests.filter((r) => r.status === "matched" || r.status === "pending");
  const pastRequests = requests.filter((r) =>
  ["approve", "approved", "reject", "rejected"].includes(r.status?.toLowerCase())
);

  return (
    <div className="flex min-h-screen bg-[#04152D] text-white">
      <main className="flex-1 p-6 space-y-6 animate-fadeIn">
        <ToastContainer position="top-right" autoClose={2000} />
        <h1 className="text-2xl font-bold text-blue-400">Manager Panel</h1>

        {/* Pending Requests */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Pending Swap Requests</h2>
          {loading ? (
            <div className="text-yellow-400 flex items-center gap-2">
              <FaSpinner className="animate-spin" /> Loading pending requests...
            </div>
          ) : pendingRequests.length === 0 ? (
            <p className="text-gray-400">No pending requests.</p>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <div
                  key={req._id}
                  className="bg-[#0B1B33] p-4 rounded-md shadow flex flex-col gap-2"
                >
                  <SwapRequest
                    from={req.requester?.name || "Unknown"}
                    shift={
                      req.shift
                        ? `${req.shift.date}, ${req.shift.startTime} - ${req.shift.endTime}`
                        : "N/A"
                    }
                    status={req.status}
                    isManager={user.role === "manager"}
                    onApprove={() => handleDecision(req._id, "approve")}
                    onReject={() => handleDecision(req._id, "reject")}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past Requests */}
        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Past Swap Actions</h2>
          {loading ? (
            <div className="text-yellow-400 flex items-center gap-2">
              <FaSpinner className="animate-spin" /> Loading past actions...
            </div>
          ) : pastRequests.length === 0 ? (
            <p className="text-gray-400">No past swap actions found.</p>
          ) : (
            <div className="overflow-x-auto rounded-md">
              <table className="w-full text-sm bg-[#0B1B33]">
                <thead className="text-gray-300 border-b border-gray-600">
                  <tr>
                    <th className="px-4 py-2 text-left">Employee</th>
                    <th className="px-4 py-2 text-left">Shift</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Requested On</th>
                  </tr>
                </thead>
                <tbody className="text-gray-200">
                  {pastRequests.map((req) => (
                    <tr
                      key={req._id}
                      className="border-b border-gray-700 hover:bg-[#13294B]"
                    >
                      <td className="px-4 py-2">{req.requester?.name || "Unknown"}</td>
                      <td className="px-4 py-2">
                        {req.shift
                          ? `${req.shift.date}, ${req.shift.startTime} - ${req.shift.endTime}`
                          : "N/A"}
                      </td>
                      <td
                        className={`px-4 py-2 ${
                          req.status !== "approved"
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {req.status}
                      </td>
                      <td className="px-4 py-2">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Report Download */}
        <button
          className="mt-4 bg-green-600 hover:bg-green-700 px-4 py-2 text-white rounded-md"
          onClick={handleDownloadReport}
        >
          Download Report
        </button>
      </main>
    </div>
  );
}
