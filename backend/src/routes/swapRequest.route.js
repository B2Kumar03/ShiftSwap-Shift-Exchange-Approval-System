import { Router } from "express";
import {
  createSwapRequest,
  volunteerForSwap,
  approveSwap,
  rejectSwap,
  getAllSwapRequests,
  getUserSwapRequests,
} from "../controllers/SwapRequestController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";



const swapRequestRoute = Router();

// Create a new swap request
swapRequestRoute.post("/swap/create", isAuthenticated, createSwapRequest);

// Volunteer for a shift swap

// Approve a volunteer (Manager)
swapRequestRoute.post("/swap/approve/:requestId", isAuthenticated, approveSwap);

// Reject a swap request
swapRequestRoute.post("/swap/reject/:requestId", isAuthenticated, rejectSwap);

// Get all swap requests (Manager/Admin view)
swapRequestRoute.get("/swap/all", isAuthenticated, getAllSwapRequests);

// Get current user's swap requests
swapRequestRoute.get("/swap/my-requests", isAuthenticated, getUserSwapRequests);

//voleteer for a shift swap
swapRequestRoute.post("/swap/volunteer/:requestId", isAuthenticated, volunteerForSwap);


export default swapRequestRoute;
