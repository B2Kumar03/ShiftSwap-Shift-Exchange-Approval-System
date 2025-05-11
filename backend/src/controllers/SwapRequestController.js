import SwapRequest from '../models/SwapRequest.js';
import Shift from '../models/Shift.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// Create a new swap request
export const createSwapRequest = async (req, res) => {
  try {
    const { shift} = req.body;

    console.log('Creating swap request for shift:', shift);
    const requesterId = req.user._id;
    console.log('Requester ID:', requesterId.toString());

    const existingRequest = await SwapRequest.findOne({  shift, requester: requesterId });
    if (existingRequest) {
      return res.status(400).json({ success: false, message: 'Swap request already exists' });
    }

    const newRequest = await SwapRequest.create({
       shift,
      requester: requesterId.toString()
    });

    res.status(201).json({ success: true, request: newRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Volunteer for a swap
export const volunteerForSwap = async (req, res) => {
  try {
    const { requestId } = req.params;
    const volunteerId = req.user._id;

    const swap = await SwapRequest.findById(requestId);
    if (!swap) return res.status(404).json({ success: false, message: 'Swap request not found' });

    if (swap.volunteer) {
      return res.status(400).json({ success: false, message: 'A volunteer already exists' });
    }

    swap.volunteer = volunteerId;
    swap.status = 'matched';
    await swap.save();

    // Send notification to requester
    await Notification.create({
      user: req.user._id,
      message: 'Someone volunteered for your shift swap request.',
      recipient: swap.requester,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString()
    });

    res.status(200).json({ success: true, swap });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve a volunteer (by manager)
export const approveSwap = async (req, res) => {
  try {
    const { requestId } = req.params;
    console.log(requestId);
    const swap = await SwapRequest.findById(requestId);
    console.log(swap);
    if (!swap) return res.status(404).json({ success: false, message: 'Swap request not found' });

    

    swap.status = 'approved';
    await swap.save();

    // Send notifications to requester and volunteer
    await Notification.insertMany([
      {
        message: 'Your shift swap request was approved.',
        user: req.user._id,
        recipient: swap.requester,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString()
      },
      {
        message: 'You have been approved for a shift swap.',
        recipient: swap.volunteer,
        user: req.user._id,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString()
      }
    ]);

    res.status(200).json({ success: true, swap });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reject a swap request
export const rejectSwap = async (req, res) => {
  try {
    const { requestId } = req.params;

    const swap = await SwapRequest.findById(requestId);
    if (!swap) return res.status(404).json({ success: false, message: 'Swap request not found' });

    swap.status = 'rejected';
    await swap.save();

    // Notify requester
    await Notification.create({
      user:req.user._id,
      message: 'Your shift swap request was rejected.',
      recipient: swap.requester,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString()
    });

    res.status(200).json({ success: true, swap });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all swap requests (admin or manager)
export const getAllSwapRequests = async (req, res) => {
  try {
    const swaps = await SwapRequest.find()
      .populate('shift requester volunteer')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, swaps });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user-specific swap requests
export const getUserSwapRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const swaps = await SwapRequest.find({
      $or: [{ requester: userId }, { volunteer: userId }]
    }).populate('shift requester volunteer');

    res.status(200).json({ success: true, swaps });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
