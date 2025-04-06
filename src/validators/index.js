import { body } from 'express-validator';

const userRegistraionValidator = () => {
  console.log("userregister");
  
  return [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('email is required')
      .isEmail()
      .withMessage('Invalid email'),
    body('username')
      .trim()
      .notEmpty()
      .withMessage('username is required')
      .isLength({ min: 3 })
      .withMessage('username must be 3 char long')
      .isLength({ max: 12 })
      .withMessage('username must be max 12 char'),
  ];
};

const userLoginValidator = () => {
  return [
    body('emali').isEmail().withMessage('email is not valid'),
    body('password').notEmpty().withMessage("password can't be empty"),
  ];
};

export { userRegistraionValidator, userLoginValidator };
