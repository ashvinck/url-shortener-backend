import jwt from 'jsonwebtoken';

export const signVerifyAccountToken = async (email) => {
  const payload = {
    email: email,
  };
  const secret = process.env.SECRET_KEY;
  try {
    const token = jwt.sign(payload, secret);
    return token;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const verifyAccountVerificationToken = async (token) => {
  try {
    const secret = process.env.SECRET_KEY;
    const result = jwt.verify(token, secret);
    return result;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const signAccessToken = async (userId) => {
  try {
    const payload = {
      id: userId,
    };
    const secret = process.env.SECRET_KEY;
    const result = jwt.sign(payload, secret, { expiresIn: '2h' });
    return result;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const signForgotPasswordToken = async (storedDBPassword, id) => {
  try {
    const payload = {
      id: id,
    };
    const secret = process.env.SECRET_KEY + storedDBPassword;
    const result = jwt.sign(payload, secret, { expiresIn: '10m' });
    return result;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const verifyResetPasswordToken = async (token, storedDBPassword) => {
  try {
    const secret = process.env.SECRET_KEY + storedDBPassword;
    const result = jwt.verify(token, secret);
    return result;
  } catch (err) {
    console.log(err);
    return;
  }
};
