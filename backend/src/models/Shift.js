import mongoose from "mongoose";

const shiftSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  
  role: { type: String, required: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Shift = mongoose.model("Shift", shiftSchema);

export default Shift;
