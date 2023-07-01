import { check, validationResult } from 'express-validator';

// Validation using Express-validator for Signup,Login,Resetpassword
export const signUpValidation = () => {
  return [
    check('firstName')
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage('the name must have minimum length of 2'),
    check('lastName').notEmpty(),
    check('email', 'Please enter a valid email address')
      .isEmail()
      .normalizeEmail(),
    check('password')
      .notEmpty()
      .withMessage('Password should not be empty')
      .isLength({ min: 8, max: 15 })
      .withMessage('Your password should have min and max length between 8-15')
      .matches(/\d/)
      .withMessage('Your password should have atleast one number')
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage('Your password should have atleast one special character'),
    check('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

    (request, response, next) => {
      const errors = validationResult(request);
      if (errors.isEmpty()) {
        return next();
      }
      const extractedErrors = [];
      errors
        .array()
        .map((err) => extractedErrors.push({ [err.param]: err.msg }));

      return response.status(422).json({ errors: extractedErrors });
    },
  ];
};

export const loginValidation = () => {
  return [
    check('email', 'Please enter a valid email address')
      .isEmail()
      .normalizeEmail(),
    check('password').notEmpty().withMessage('Password should not be empty'),
    (request, response, next) => {
      const errors = validationResult(request);
      if (errors.isEmpty()) {
        return next();
      }
      const extractedErrors = [];
      errors
        .array()
        .map((err) => extractedErrors.push({ [err.param]: err.msg }));

      return response.status(401).json({ errors: extractedErrors });
    },
  ];
};

export const forgotPasswordvalidation = () => {
  return [
    check('email', 'Please enter a valid email address')
      .isEmail()
      .normalizeEmail(),
    (request, response, next) => {
      const errors = validationResult(request);
      if (errors.isEmpty()) {
        return next();
      }
      console.log(errors);
      return response
        .status(404)
        .json({ message: 'Please enter a valid email address' });
    },
  ];
};

export const resetPasswordValidation = () => {
  return [
    check('password')
      .notEmpty()
      .withMessage('Password should not be empty')
      .isLength({ min: 8, max: 15 })
      .withMessage('Your password should have min and max length between 8-15')
      .matches(/\d/)
      .withMessage('Your password should have atleast one number')
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage('Your password should have atleast one special character'),
    check('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

    (request, response, next) => {
      const errors = validationResult(request);

      if (errors.isEmpty()) {
        return next();
      } else {
        const extractedErrors = [];
        errors
          .array()
          .map((err) => extractedErrors.push({ [err.param]: err.msg }));
        return response.status(422).json({ errors: extractedErrors });
      }
    },
  ];
};
