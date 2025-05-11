import { useState } from "react";
import Papa from "papaparse";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSocket } from "../socket/socket"; // Adjust the import path as necessary

export default function ScheduleShift() {
  const [shift, setShift] = useState({
    title: "",
    date: "",
    time: "",
    role: "",
    employee: "",
  });

  const [mockShifts, setMockShifts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setShift({ ...shift, [e.target.name]: e.target.value });
  };

  const parseTime = (timeString) => {
    const [startTime, endTime] = timeString.split("-").map((t) => t.trim());
    return { startTime, endTime };
  };

  const createShift = async (shiftData) => {
    const { startTime, endTime } = parseTime(shiftData.time);
    console.log(shift)
    const payload = {
      user: "663da3df4fa179e2e9c98f11", // TODO: Replace with actual user ID
      date: shiftData.date,
      title: shift.title,
      startTime,
      endTime,
      role: shiftData.role,
      employee: shiftData.employee,
    };
console.log("Payload:", payload);
    try {
      const res = await fetch("http://localhost:8080/api/create-shift", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Shift created successfully");
        return true;
      } else {
        toast.error(data.message || "Failed to create shift");
        return false;
      }
    } catch (err) {
      console.error("Create shift error:", err);
      toast.error("Server error");
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const success = await createShift(shift);
    if (success) {
      setMockShifts((prev) => [...prev, shift]);
      setShift({ title: "", date: "", time: "", role: "", employee: "" });
    }

    setLoading(false);
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async function (results) {
        setLoading(true);
        const newShifts = [];

        for (const row of results.data) {
          const shiftObj = {
            title: row.title || "",
            date: row.date || "",
            time: row.time || "",
            role: row.role || "",
            employee: row.employee || "",
          };

          const success = await createShift(shiftObj);
          if (success) newShifts.push(shiftObj);
        }

        setMockShifts((prev) => [...prev, ...newShifts]);
        setLoading(false);
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-black space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Schedule New Shift</h2>

        <input name="title" type="text" placeholder="Shift Title" value={shift.title} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="date" type="date" value={shift.date} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="time" type="text" placeholder="Time (e.g. 10:00 - 18:00)" value={shift.time} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="role" type="text" placeholder="Role (e.g. Cashier)" value={shift.role} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="employee" type="text" placeholder="Assigned to (username)" value={shift.employee} onChange={handleChange} className="w-full p-2 border rounded" required />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50" disabled={loading}>
          {loading ? "Creating..." : "Create Shift"}
        </button>
      </form>

      <div className="mt-6 space-y-2">
        <label className="font-semibold text-gray-700">Or Upload Shifts (CSV):</label>
        <input type="file" accept=".csv" onChange={handleCSVUpload} className="p-2 border rounded" />
        <p className="text-sm text-gray-500">Expected columns: title, date, time, role, employee</p>
      </div>

      {mockShifts.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Scheduled Shifts</h3>
          <ul className="space-y-2">
            {mockShifts.map((item, idx) => (
              <li key={idx} className="p-3 border rounded shadow-sm bg-gray-50">
                <p><strong>Title:</strong> {item.title}</p>
                <p><strong>Date:</strong> {item.date}</p>
                <p><strong>Time:</strong> {item.time}</p>
                <p><strong>Role:</strong> {item.role}</p>
                <p><strong>Employee:</strong> {item.employee}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
