import { validationResult } from "express-validator";
import { ApiError } from "../utils/api-error.js";

export const validate = (req, res, next) => {

    const errors = validationResult(req);

    
    if (errors.isEmpty()) {
        return  next(); // Stop further execution if no errors
    }

    const extractedErrors = [];
    errors.array().forEach((err) => extractedErrors.push({
        [err.path]: err.msg
    }));

    console.log("Extracted errors: ", extractedErrors);

    throw new ApiError(422, "Data is not valid", extractedErrors);
};