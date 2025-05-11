import Shift from '../models/Shift.js';
import User from '../models/User.js';

export const createShift = async (req, res) => {
  try {
    const { user, date, startTime, endTime, role, employee,title } = req.body;

    const shift = await Shift.create({
      user,
      date,
      startTime,
      title,
      endTime,
      role,
      employee,
      location: role, // assuming role is used as location or you can update the model
    });

    res.status(201).json({ success: true, shift });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserShifts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const shifts = await Shift.find({ user: userId });

    res.status(200).json({ success: true, shifts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllShifts = async (req, res) => {
  try {
    const shifts = await Shift.find().populate('user');
    res.status(200).json({ success: true, shifts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get shifts for the logged-in user
export const getMyShifts = async (req, res) => {
  console.log(req.user);
  try {
    const id=req.user._id.toString();
    const userId = id;
    console.log("UI",userId);
    const shifts = await Shift.find({ employee: userId })
    res.status(200).json({ success: true, shifts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
