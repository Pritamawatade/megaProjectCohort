import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import { User } from '../models/user.model.js';
import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import { ApiResponse } from '../utils/api-response.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;

  if (!fullName || !username || !email || !password) {
    throw new ApiError(400, 'Invalid data');
  }

  try {
    const exitingUser = await User.findOne({ email });

    if (exitingUser) {
      throw new ApiError(400, 'User already exisist');
    }

    const user = await User.create({
      fullName,
      email,
      username,
      password,
    });
    const { unHashedToken, hashedToken, tokenExpiry } =
      user.generateTemporyToken();

    if (!user) {
      throw new ApiError(400, 'User not created');
    }

    user.emailVerificationToken = unHashedToken;
    user.accessToken = user.generateAccessToken();
    user.refreshToken = user.generateRefeshToken();

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
        link: 'https://mailgen.js/',
      },
    });

    const link = `${process.env.BASE_URL}/api/v1/users/verify/${user.emailVerificationToken}`;

    var emailSetup = {
      body: {
        name: user.fullName,
        intro: 'Welcome onboard buddy...',
        action: {
          instructions: 'Please verify your email',
          button: {
            color: '#22BC66', // Optional action button color
            text: 'Confirm your account',
            link: link,
          },
        },
        outro: 'Computer generated email please do not reply',
      },
    };

    var emailBody = mailGenerator.generate(emailSetup);

    const options = {
      from: process.env.MAILTRAP_SENDEREMAIL,
      to: user.email, // list of receivers
      subject: 'verfify your email', // Subject line
      text: 'Hello world?', // plain text body
      html: emailBody, // html body
    };

    await transporter.sendMail(options);

    return res.status(201).json(new ApiResponse(201, user, 'User is created'));
  } catch (error) {
    console.error('Error in registerUser:', error); // <-- super helpful!
    throw new ApiError(400, 'User not created', error);
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw new ApiError(40, 'Invalid Data');
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(400, 'User not exisit');
    }

    const isMatched = bcrypt.compare(password, user.password);

    if (!isMatched) {
      throw new ApiError(400, 'Invalid password');
    }

    if (user.isEmailVerified !== true) {
      throw new ApiError(400, 'Please verify your email');
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const cookieOption = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    };

    res.cookie('token', token, cookieOption);

    const sendUserData = {
      email: user.email,
      fullName: user.fullName,
      id: user._id,
      
    };
    return res
      .status(200)
      .json(new ApiResponse(200, sendUserData, 'User logged in successfully'));
  } catch (error) {
    throw new ApiError(500, 'Cannot loging server problem', error);
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  try {
    res.cookie('token', '', { msg: 'Cookie reset' });

    res.status(200).json(new ApiResponse(200, '', 'Logout successfully'));
  } catch (error) {
    throw new ApiError(500, 'somwthing went wrong at logout controller', error);
  }
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;
  try {
    if (!token) {
      throw new ApiError(400, 'Toekn not found');
    }

    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      throw new ApiError(400, 'Token is invalid');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    return res.status(200).json(new ApiResponse(200, {}, 'User is verified'));
  } catch (error) {
    throw new ApiError(
      500,
      'somwthing went wrong at verifyEmail controller',
      error
    );
  }
});

const resendEmailVerification = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(400, 'email is now valid');
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      throw new ApiError(400, 'User not found');
    }

    if (user.isEmailVerified == true) {
      return res
        .status(200)
        .json(new ApiResponse(200, email, 'User is already verified'));
    }

    if (!user.emailVerificationToken) {
      const { unHashedToken, hashedToken, tokenExpiry } =
        user.generateTemporyToken();

      user.emailVerificationToken = unHashedToken;
      await user.save();
    }

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
        link: 'https://mailgen.js/',
      },
    });

    const link = `${process.env.BASE_URL}/api/v1/users/verify/${user.emailVerificationToken}`;

    var emailSetup = {
      body: {
        name: user.fullName,
        intro: `Welcome back ${user.fullName}`,
        action: {
          instructions: 'Please verify your email',
          button: {
            color: '#22BC66', // Optional action button color
            text: 'Confirm your account',
            link: link,
          },
        },
        outro: 'Computer generated email please do not reply',
      },
    };

    var emailBody = mailGenerator.generate(emailSetup);

    const options = {
      from: process.env.MAILTRAP_SENDEREMAIL,
      to: user.email, // list of receivers
      subject: 'verfify your email', // Subject line
      text: 'Hello world?', // plain text body
      html: emailBody, // html body
    };

    await transporter.sendMail(options);

    return res
      .status(200)
      .json(new ApiResponse(200, email, 'Email send successfully'));
  } catch (error) {
    throw new ApiError(
      500,
      'somwthing went wrong at resendEmailVerification controller',
      error
    );
  }
});
const resetForgottenPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    if ((!email, !password)) {
      throw new ApiError(500, 'Invalid email or password');
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      throw new ApiError(500, 'User not found');
    }

    user.password = password;

    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, email, 'Password reset succussfully'));
  } catch (error) {
    throw new ApiError(
      500,
      'somwthing went wrong at resetForgottenPassword controller',
      error
    );
  }
});

const refreshAccessToken = asyncHandler(async (req, res) => {});

const forgotPasswordRequest = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  //validation
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  try {
    const { oldPassword, newPassword, email } = req.body;

    if ((!email, !newPassword, !oldPassword)) {
      throw new ApiError(400, 'Invalid Data');
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      throw new ApiError(400, 'User not found');
    }

    const isMatched = user.isPasswordCorrect(oldPassword);

    if (!isMatched) {
      throw new ApiError(400, 'Password is not valid');
    }

    user.password = newPassword;

    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, email, 'Password Changed successfully'));
  } catch (error) {
    throw new ApiError(
      500,
      'Somewthing went wrong at changeCurrentPassword controller',
      error
    );
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {

  const id = req.user.id;

  try {
    const user = await User.findById(id);

    if(!user){
         throw new ApiError(400, "User not found")
    }

    const userSend =  {
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      
    }

    return res.status(200).json(new ApiResponse(200, userSend, "user fetched succussfully"))
  } catch (error) {

       throw new ApiError(400, "something went wrong at getCurrentUser controller ", error)

  }
});

export { registerUser };
