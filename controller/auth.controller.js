import createError from 'http-errors';
import bcrypt from 'bcrypt';
import {
  getUserEmailFromDB,
  getUserFromDB,
  getUserIDFromDB,
  registerUser,
  resetPasswordById,
  updateVerificationStatus,
} from '../services/auth.services.js';
import { generateHashedPassword } from '../utilities/hashPassword.js';
import { sendAccountVerificationMail } from '../utilities/sendverificationmail.js';
import {
  signAccessToken,
  signForgotPasswordToken,
  signVerifyAccountToken,
  verifyAccountVerificationToken,
  verifyResetPasswordToken,
} from '../utilities/jwt.js';
import { sendPasswordResetMail } from '../utilities/sendresetmail.js';

// @desc - Signup User
//@route - POST /auth/signup
export const signUpUser = async (request, response, next) => {
  const { firstName, lastName, email, password } = request.body;

  try {
    // check if email exists in DB
    const userEmailFromDB = await getUserEmailFromDB(email);
    if (userEmailFromDB) throw createError.Conflict('Email already in use');

    // hashing Password
    const hashedPassword = await generateHashedPassword(password);
    if (!hashedPassword) throw createError.InternalServerError();

    // Registering user details
    const result = await registerUser({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      accountVerified: false,
    });
    if (!result) throw createError.InternalServerError();

    // signing jwt token
    const token = await signVerifyAccountToken(email);
    if (!token) throw createError.InternalServerError();

    // Sending Verification Email
    const sendVerificationMail = await sendAccountVerificationMail(
      email,
      token
    );
    if (sendVerificationMail) {
      response.send({
        message: 'Account Verification email sent.Please Check your email',
      });
    } else throw createError.InternalServerError();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// @desc - verify User
//@Route GET /auth/verify-user/:email/:token
export const verifyUser = async (request, response, next) => {
  const { email, token } = request.params;

  try {
    //to find by email address
    const userEmailFromDB = await getUserFromDB(email);
    const userEmail = userEmailFromDB.email; // to compare email from DB
    const storedDBPassword = userEmailFromDB.password;
    // If userEmail does not match , throws an error
    if (userEmail !== email) throw createError.NotFound('User does not exist');

    const verifyToken = await verifyAccountVerificationToken(token);
    if (!verifyToken) throw createError.InternalServerError();

    const isVerified = await updateVerificationStatus(email);
    if (isVerified) {
      response.send({
        message: `Account with email ${userEmail} is successfully verified. Please proceed to login`,
      });
    } else throw createError.InternalServerError();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// @desc - Login
// Route - POST /auth/login
export const loginUser = async (request, response, next) => {
  const { email, password } = request.body;

  try {
    const userEmailFromDB = await getUserEmailFromDB(email);
    if (!userEmailFromDB) throw createError.NotFound('Invalid credentials');

    const storedDBPassword = userEmailFromDB.password;
    const isPasswordMatch = await bcrypt.compare(password, storedDBPassword);
    if (!isPasswordMatch) throw createError.NotFound('Invalid credentials');

    const isVerified = userEmailFromDB.accountVerified;
    if (!isVerified)
      throw createError.Conflict('Please verify your account and try again');

    const userId = userEmailFromDB._id;
    const token = await signAccessToken(userId);
    if (!token) throw createError.InternalServerError();
    else response.send({ accessToken: token });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// @desc -  Forgot Password
// @route POST auth/forgot-password
export const forgotUserPassword = async (request, response, next) => {
  const { email } = request.body;

  try {
    //to find the uaer email
    const userEmailFromDB = await getUserEmailFromDB(email);
    if (!userEmailFromDB) throw createError.NotFound('Email not registered');

    const storedDBPassword = userEmailFromDB.password;
    const _id = userEmailFromDB._id;

    const resetToken = await signForgotPasswordToken(storedDBPassword);
    if (!resetToken) throw createError.InternalServerError();

    const sendMail = await sendPasswordResetMail(email, _id, resetToken);
    if (!sendMail) throw createError.InternalServerError();
    else {
      response.send({
        message: `Password reset mail has been sent successfully to ${email}. Kindly check your spam folder also.`,
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// @desc - Reset Password
// @route - POST /auth/reset-password/:_id/:token
export const resetUserPassword = async (request, response, next) => {
  const { _id, token } = request.params;
  const { password } = request.body;
  try {
    // link verification using _id in params
    const user = await getUserIDFromDB(_id);
    if (!user) throw createError.Conflict('Invalid Link');

    const storedDBPassword = user.password;
    const userId = user._id;

    const isVerified = await verifyResetPasswordToken(token, storedDBPassword);
    if (!isVerified) throw createError.Conflict('Invalid link');

    //hashing the password provided
    const hashedPassword = await generateHashedPassword(password);
    const updatedResult = await resetPasswordById({
      userId,
      password: hashedPassword,
    });
    if (updatedResult) {
      response.send({ message: 'Reset password successfull.Please Login' });
    } else throw createError.InternalServerError();
  } catch (error) {
    console.error(error);
    next(error);
  }
};
