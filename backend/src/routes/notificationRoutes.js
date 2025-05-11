import {Router} from "express";
import { createNotification, deleteNotification, getUserNotifications, markAllAsRead } from "../controllers/notificationController.js";

const notificationRoute = Router();

notificationRoute.post("/notification", createNotification); // <-- New route
notificationRoute.get("/notification/:userId", getUserNotifications);
notificationRoute.post("/notifications/:userId", markAllAsRead);
notificationRoute.delete("/notification/:id", deleteNotification);


export default notificationRoute;