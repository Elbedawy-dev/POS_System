import express from "express";
import {registerUser , loginUser, logoutUser, getMe}
from "../controllers/userAuthController.js";
import {protectUser} from "../middlewares/authUser.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protectUser, getMe);
router.post("/logout", logoutUser);
export default router