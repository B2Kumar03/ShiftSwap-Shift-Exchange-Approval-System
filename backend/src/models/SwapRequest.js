import mongoose from 'mongoose';

const swapRequestSchema = new mongoose.Schema({
  shift: { type: mongoose.Schema.Types.ObjectId, ref: 'Shift', required: true },
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'matched', 'approved', 'rejected'],
    default: 'pending',
  },
  note: { type: String },
  volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

const SwapRequest = mongoose.model('SwapRequest', swapRequestSchema);

export default SwapRequest;
