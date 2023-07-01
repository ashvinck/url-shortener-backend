import jwt from 'jsonwebtoken';
import createError from 'http-errors';

// @desc  Validation of AccessToken for authorization
export const authValidation = (request, response, next) => {
  try {
    const authHeader =
      request.headers.authorization || request.headers.Authorization;

    if (!authHeader.startsWith('Bearer ')) {
      throw createError.Unauthorized();
    }
    const accessToken = authHeader.split(' ')[1];

    const verify = jwt.verify(accessToken, process.env.SECRET_KEY);
    next();
  } catch (err) {
    console.error(err);
    throw createError.Unauthorized();
  }
};
