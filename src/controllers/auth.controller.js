import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import { User } from '../models/user.model.js';
import nodemailer from 'nodemailer';
import Mailgen from "mailgen"
import { ApiResponse } from '../utils/api-response.js';

const registerUser = asyncHandler(async (req, res) => {
  
  
  const { fullName, username, email, password } = req.body;

  
  if (!fullName || !username || !email || !password) {
  throw new ApiError(400, "Invalid data")
  }
  
  try {
    const exitingUser = await User.findOne({ email });
    
    if (exitingUser) {
      throw new ApiError(400, "User already exisist")
    }
    
    
    const user = await User.create({
      fullName,
      email,
      username,
      password,
    });
   const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporyToken();

    if (!user) {
      throw new ApiError(400, "User not created")
    }

    user.emailVerificationToken = unHashedToken;

    await user.save();

    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    var mailGenerator = new Mailgen({
      theme: 'default',
      product: {
          // Appears in header & footer of e-mails
          name: 'MegaProject',
          link: 'https://mailgen.js/'
  
      }
  });

   

    const link = `${process.env.BASE_URL}/api/v1/users/verify/${user.emailVerificationToken}`

    var emailSetup = {
      body: {
          name: user.fullName,
          intro: 'Welcome onboard buddy...',
          action: {
              instructions: 'Please verify your email',
              button: {
                  color: '#22BC66', // Optional action button color
                  text: 'Confirm your account',
                  link: link
              }
          },
          outro: 'Computer generated email please do not reply'
      }
  };
  
  var emailBody = mailGenerator.generate(emailSetup);

  const options = {
    from: process.env.MAILTRAP_SENDEREMAIL,
    to: user.email, // list of receivers
    subject: 'verfify your email', // Subject line
    text: 'Hello world?', // plain text body
    html: emailBody, // html body
  };

  await transporter.sendMail(options)

  return res.status(201).json(
    new ApiResponse(201,user, "User is created")
  )

  } catch (error) {
    console.error("Error in registerUser:", error); // <-- super helpful!
    throw new ApiError(400, "User not created", error)

  }
  
});


const loginUser = asyncHandler(async (req, res) => {

  const {email, password} = req.body;

  try {
    if(!email || !password){
      throw new ApiError(40, "Invalid Data")
    }

    const ifExisit = await User.findOne({email})

    if(!ifExisit){
      throw new ApiError(400, "User not exisit")
    }

    


  } catch (error) {
    throw new ApiError(500, "Cannot loging server problem", error)
    
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  //validation
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  //validation
});

const resendEmailVerification = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  //validation
});
const resetForgottenPassword = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  //validation
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  //validation
});

const forgotPasswordRequest = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  //validation
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  //validation
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  //validation
});


export { registerUser };
