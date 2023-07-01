import express from 'express';
import dotenv from 'dotenv';
import {
  forgotUserPassword,
  loginUser,
  resetUserPassword,
  signUpUser,
  verifyUser,
} from '../controller/auth.controller.js';
import {
  forgotPasswordvalidation,
  loginValidation,
  resetPasswordValidation,
  signUpValidation,
} from '../middleware/inputValidation.js';
dotenv.config();

const router = express.Router();

router.post('/signup', signUpValidation(), express.json(), signUpUser);
router.get('/verify-user/:email/:token', verifyUser);
router.post('/login', loginValidation(), express.json(), loginUser);
router.post(
  '/forgot-password',
  express.json(),
  forgotPasswordvalidation(),
  forgotUserPassword
);
router.post(
  '/reset-password/:_id/:token',
  express.json(),
  resetPasswordValidation(),
  resetUserPassword
);

export default router;
