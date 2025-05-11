import {Router} from 'express';
import { createShift, getAllShifts, getMyShifts } from '../controllers/shiftController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const shiftRoute=Router()

shiftRoute.post("/create-shift",createShift)
shiftRoute.get("/getMyShifts",isAuthenticated,getMyShifts)
shiftRoute.get("/getAllShifts",getAllShifts)







export default shiftRoute
