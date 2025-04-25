import { body } from 'express-validator';

const userRegistraionValidator = () => {
  console.log("userregister");
  
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLowercase()
      .withMessage("Username must be lowercase")
      .isLength({ min: 3 })
      .withMessage("Username must be at lease 3 characters long"),
    body("password").trim().notEmpty().withMessage("Password is required"),
    body("fullName")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Full name is required"),
  ];
};

const userLoginValidator = () => {
  return [
    body('email').isEmail().withMessage('email is not valid'),
    body('password').notEmpty().withMessage("password can't be empty"),
  ];
};

export { userRegistraionValidator, userLoginValidator };
