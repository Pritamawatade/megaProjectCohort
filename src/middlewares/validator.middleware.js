import { validationResult } from "express-validator";
import {ApiError} from "../utils/api-error.js"
export const validate = (req,res,next)=>{

    console.log("validator functions ");
    
    const errors = validationResult(req);
    console.log("error L ",errors)
    console.log(errors.array());
    

    if(errors.isEmpty()){
        next()
    }

    const extractedErrors = []

    errors.array().map((err)=> extractedErrors.push({
            [err.path]: err.msg
    }))

    console.log("EXteacted error : ", extractedErrors);
    

    throw new ApiError(422, "data is not valid", extractedErrors)
}