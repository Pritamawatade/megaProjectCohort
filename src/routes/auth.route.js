import { Router } from "express";
import { registerUser } from "../controllers/auth.controller.js";
import { userRegistraionValidator } from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";


const router = Router();

router.route("/register").post(userRegistraionValidator, validate,registerUser)


export default router