import { body } from "express-validator";
import { asyncHandler } from "../utils/async-handler";
import { userRegistraionValidator } from "../validators";

const registerUser = asyncHandler(async (req, res)=>{
    userRegistraionValidator(body)  
})

export {
    registerUser
}