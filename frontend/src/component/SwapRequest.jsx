import React from "react";

export default function SwapRequest({ from, shift, status, isManager, onApprove, onReject }) {
  const showButtons = isManager && (status === "pending" || status === "matched");

  return (
    <div className="bg-[#0F1E39] p-4 rounded-md text-white">
      <div className="mb-2">
        <strong>Requested by:</strong> {from}
      </div>
      <div className="mb-2">
        <strong>Shift:</strong> {shift}
      </div>
      <div className="mb-2">
        <strong>Status:</strong>{" "}
        <span
          className={`font-semibold ${
            status === "approved"
              ? "text-green-400"
              : status === "rejected"
              ? "text-red-400"
              : "text-yellow-400"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Show Approve/Reject buttons only for Manager and if status is matched or pending */}
      {showButtons && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={onApprove}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md"
          >
            Approve
          </button>
          <button
            onClick={onReject}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
