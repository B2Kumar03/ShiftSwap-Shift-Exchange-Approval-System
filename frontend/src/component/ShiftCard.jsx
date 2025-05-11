export default function ShiftCard({ shift, onRequestSwap,isRequested }) {
  console.log(isRequested)
  return (
    <div className="bg-[#0F2A50] p-4 rounded-lg shadow text-white space-y-2">
      <h3 className="text-lg font-semibold">{shift.title}</h3>
      <p>{shift.date}</p>
      <p>{shift.time}</p>
      <p>{shift.role}</p>

      {/* Request Swap Button */}
      {onRequestSwap && (
        <button
  disabled={isRequested}
  onClick={() => onRequestSwap(shift)}
  className={`mt-2 px-3 py-1 text-black rounded 
    ${isRequested ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"}`}
>
  Request Swap
</button>

      )}
    </div>
  );
}
