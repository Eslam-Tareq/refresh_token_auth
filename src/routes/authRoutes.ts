import express from "express";
import { getMe, logIn, logOut, signUp } from "../controllers/authControllers";
import { protect } from "../services/authServices";
const authRouter = express.Router();

authRouter.post("/signup", signUp);

authRouter.post("/logIn", logIn);
authRouter.post("/logout", protect, logOut);

authRouter.get("/getMe", protect, getMe);

export default authRouter;
