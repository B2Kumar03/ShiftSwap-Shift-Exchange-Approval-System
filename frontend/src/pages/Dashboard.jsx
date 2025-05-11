import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner } from "react-icons/fa";
import Sidebar from "../component/Sidebar";
import ShiftCard from "../component/ShiftCard";
import SwapRequest from "../component/SwapRequest";

export default function Dashboard() {
  const [shifts, setShifts] = useState([]);
  const [swapRequests, setSwapRequests] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [note, setNote] = useState("");
  const [loadingShifts, setLoadingShifts] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [submittingSwap, setSubmittingSwap] = useState(false);
  const [volunteering, setVolunteering] = useState(null);
  const [al,setAl]=useState([])

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
 
  useEffect(() => {
    if (!token) return;
    setLoadingShifts(true);
    fetch("http://localhost:8080/api/getMyShifts", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setShifts(data.shifts || []))
      .catch((err) => {
        toast.error("Error fetching shifts");
        console.error(err);
      })
      .finally(() => setLoadingShifts(false));
  }, [token]);

  useEffect(() => {
    if (!token) return;
    setLoadingRequests(true);
    fetch("http://localhost:8080/api/swap/all", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setSwapRequests(data.swaps || []))
      .catch((err) => {
        toast.error("Error fetching swap requests");
        console.error(err);
      })
      .finally(() => setLoadingRequests(false));
  }, [token]);

  const handleSwapRequest = (shift) => {
    setSelectedShift(shift);
    setNote(""); // clear previous note
  };

  const submitSwap = () => {
    if (!selectedShift || !selectedShift._id) {
      toast.error("No shift selected for swap.");
      return;
    }

    if (note.trim().length === 0) {
      toast.warn("Please add a note before submitting.");
      return;
    }

    setSubmittingSwap(true);

    fetch("http://localhost:8080/api/swap/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        shift: selectedShift._id,
        note: note.trim(),
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Invalid request");
        }
        return res.json();
      })
      .then((data) => {
        if (data?.request) {
          setSwapRequests((prev) => [...prev, data.request]);
          setSelectedShift(null);
          setNote("");
          toast.success("Swap request submitted successfully!");
        } else {
          toast.error("Unexpected response from server");
        }
      })
      .catch((err) => {
       
        console.error(err);
      })
      .finally(() => setSubmittingSwap(false));
  };

  const handleVolunteer = (requestId) => {
    setVolunteering(requestId);
    fetch(`http://localhost:8080/api/swap/volunteer/${requestId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("Successfully volunteered!");
        setSwapRequests((prev) =>
          prev.map((req) =>
            req._id === requestId ? { ...req, volunteer: userId } : req
          )
        );
      })
      .catch((err) => {
        toast.error("Volunteer request failed");
        console.error(err);
      })
      .finally(() => setVolunteering(null));
  };

  useEffect(()=>{
     const isAlredyin=swapRequests.map((req)=>req.shift._id)
     setAl(isAlredyin)
     
  },[swapRequests])





  return (
    <div className="flex min-h-screen bg-[#04152D] text-white">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <main className="flex-1 p-6 space-y-6 animate-fadeIn">
        <h1 className="text-2xl font-bold text-blue-400">
          Welcome to Your Dashboard
        </h1>

        {/* Shifts Section */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Upcoming Shifts</h2>
          {loadingShifts ? (
            <div className="text-center text-gray-300">
              <FaSpinner className="animate-spin inline mr-2" />
              Loading shifts...
            </div>
          ) : shifts.length > 0 ? (
            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
              {shifts.map((shift, idx) => (
                <ShiftCard
                  key={idx}
                  shift={shift}
                  onRequestSwap={handleSwapRequest}
                  isRequested={al.includes(shift._id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No shifts available.</p>
          )}
        </section>

        {/* Swap Form */}
        {selectedShift && (
          <div className="bg-[#0F2A50] p-4 rounded-lg text-white space-y-2">
            <h3 className="text-lg font-semibold">
              Swap Shift: {selectedShift.date} - {selectedShift.time}
            </h3>
            <textarea
              placeholder="Add a note..."
              className="w-full p-2 text-black rounded"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button
              onClick={submitSwap}
              disabled={submittingSwap}
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 text-black flex items-center gap-2"
            >
              {submittingSwap && <FaSpinner className="animate-spin" />}
              {submittingSwap ? "Submitting..." : "Submit Swap Request"}
            </button>
          </div>
        )}

        {/* Swap Requests */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Swap Requests</h2>
          {loadingRequests ? (
            <div className="text-center text-gray-300">
              <FaSpinner className="animate-spin inline mr-2" />
              Loading swap requests...
            </div>
          ) : swapRequests.length > 0 ? (
            <div className="space-y-3">
              {swapRequests.map((req, idx) => {
                if (!req || req.status === "approved" || req.status === "rejected") {
                  return null;
                }

                return (
                  <div
                    key={idx}
                    className="bg-[#13294B] p-4 rounded-lg shadow-md space-y-1"
                  >
                    <SwapRequest
                      from={req.requester?.name || "Unknown"}
                      shift={
                        req.shift
                          ? `${req.shift.date}, ${req.shift.startTime} - ${req.shift.endTime}`
                          : "N/A"
                      }
                      status={req.status}
                    />
                    <button
                      onClick={() => handleVolunteer(req._id)}
                      disabled={volunteering === req._id}
                      className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 flex items-center gap-2"
                    >
                      {volunteering === req._id && (
                        <FaSpinner className="animate-spin" />
                      )}
                      {volunteering === req._id ? "Volunteering..." : "Volunteer"}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400">No swap requests available.</p>
          )}
        </section>
      </main>
    </div>
  );
}
