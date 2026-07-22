import { body, validationResult } from 'express-validator';
import logger from '../utils/logger.js';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn({ message: 'Validation errors', errors: errors.array() });
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

export const validateTelegramAuth = [
  body('telegramId').isInt().notEmpty(),
  body('username').optional().isString(),
  body('firstName').isString().notEmpty(),
  body('lastName').optional().isString(),
  body('photoUrl').optional().isString(),
  body('hash').isString().notEmpty(),
  handleValidationErrors
];

export const validateDeposit = [
  body('amount').isDecimal({ decimal_digits: '1,2' }).notEmpty(),
  body('paymentMethod').isString().notEmpty(),
  handleValidationErrors
];

export const validateWithdrawal = [
  body('amount').isDecimal({ decimal_digits: '1,2' }).notEmpty(),
  body('withdrawalMethod').isString().notEmpty(),
  body('accountNumber').optional().isString(),
  handleValidationErrors
];

export const validateInvestment = [
  body('planId').isUUID().notEmpty(),
  body('amount').isDecimal({ decimal_digits: '1,2' }).notEmpty(),
  handleValidationErrors
];
