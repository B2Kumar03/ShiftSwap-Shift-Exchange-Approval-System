import {Router} from 'express';
import { getAllUsers, getUserById, login, register } from '../controllers/authController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';


const authRoute= Router();

authRoute.post("/register",register);
authRoute.post("/login",login);
authRoute.get("/getUserById",isAuthenticated,getUserById);
authRoute.get("/getAllUsers",getAllUsers);




export default authRoute;