import { Router } from "express";
import { registerUser } from "../controllers/auth.controller";
import { userRegistraionValidator } from "../validators";
import { validate } from "../middlewares/validator.middleware";


const router = Router();

router.route("/register").post(userRegistraionValidator(), validate,registerUser)


export default router