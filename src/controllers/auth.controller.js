import { body } from 'express-validator';
import { asyncHandler } from '../utils/async-handler.js';
import { userRegistraionValidator } from '../validators/index.js';

const registerUser = asyncHandler(async (req, res) => {

  console.log("reg controllers")
  
  userRegistraionValidator(body);
});

export { registerUser };
