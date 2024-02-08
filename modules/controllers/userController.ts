import { User } from "../models/user";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

import {
  successMessage,
  catchMessage,
  validationMessage,
} from "../utils/apiReturns";

import { RegisterTypes } from "../types/auth";
import { sendEmail, sendSMSIR } from "./controller";
import { Types } from "mongoose";
import { UserRequestParams } from "../types/user";

export const vRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstName, lastName, phoneNumber, password }: RegisterTypes =
    req.body;
  const schema = Joi.object({
    firstName: Joi.string()
      .pattern(/^[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی ]+$/)
      .required()
      .min(3)
      .max(256)
      .messages({
        "string.min": `"نام" حداقل {#limit} حرف وارد شود  `,
        "string.max": `"نام" حداکثر {#limit} حرف وارد شود  `,
        "any.required": `"نام" وارد شود`,
        "string.empty": "نام وارد شود",
        "string.pattern.base": "نام به حروف فارسی وارد شود",
      }),
    lastName: Joi.string()
      .pattern(/^[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی ]+$/)
      .required()
      .min(3)
      .max(256)
      .messages({
        "string.min": `"نام خانوادگی" حداقل {#limit} حرف وارد شود  `,
        "string.max": `"نام خانوادگی" حداکثر {#limit} حرف وارد شود  `,
        "any.required": `"نام خانوادگی" وارد شود`,
        "string.empty": "نام خانوادگی وارد شود",
        "string.pattern.base": "نام خانوادگی به حروف فارسی وارد شود",
      }),
    phoneNumber: Joi.string().pattern(/^0/).length(11).required().messages({
      "any.required": `"شماره موبایل" وارد شود`,
      "string.empty": `"شماره موبایل" وارد شود`,
      "string.length": `"شماره موبایل " 11 رقم وارد شود`,
      "string.pattern.base": `"شماره موبایل" استاندارد وارد شود  `,
    }),
    password: Joi.string().required().min(8).max(256).messages({
      "string.min": `"رمز عبور" حداقل {#limit} کاراکتر وارد شود  `,
      "string.max": `"رمز عبور" حداکثر {#limit} کاراکتر وارد شود  `,
      "any.required": `"رمز عبور" وارد شود`,
      "string.empty": "رمز عبور وارد شود",
    }),
  });
  const { error } = schema.validate({
    firstName,
    lastName,
    password,
    phoneNumber,
  });
  if (error) {
    validationMessage(res, error.details[0].message);
    return;
  }

  const existPhoneNumber = await User.find({ phoneNumber }).countDocuments();
  if (existPhoneNumber > 0) {
    validationMessage(res, "شماره موبایل تکراری می باشد");
    return;
  }
  next();
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, phoneNumber, password }: RegisterTypes =
      req.body;

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      phoneNumber,
      role: "customer",
      password: hashPassword,
    });
    const savedUser = await newUser.save();
    if (!savedUser) {
      catchMessage(res);
    } else {
      successMessage(res, "حساب کاربری شما با موفقیت ایجاد گردید");
    }
  } catch (err) {
    catchMessage(res);
  }
};

export const vUpdateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    email,
    address,
    id,
  }: RegisterTypes = req.body;
  const schema = Joi.object({
    firstName: Joi.string()
      .pattern(/^[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی ]+$/)
      .required()
      .min(3)
      .max(256)
      .messages({
        "string.min": `"نام" حداقل {#limit} حرف وارد شود  `,
        "string.max": `"نام" حداکثر {#limit} حرف وارد شود  `,
        "any.required": `"نام" وارد شود`,
        "string.empty": "نام وارد شود",
        "string.pattern.base": "نام به حروف فارسی وارد شود",
      }),
    lastName: Joi.string()
      .pattern(/^[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی ]+$/)
      .required()
      .min(3)
      .max(256)
      .messages({
        "string.min": `"نام خانوادگی" حداقل {#limit} حرف وارد شود  `,
        "string.max": `"نام خانوادگی" حداکثر {#limit} حرف وارد شود  `,
        "any.required": `"نام خانوادگی" وارد شود`,
        "string.empty": "نام خانوادگی وارد شود",
        "string.pattern.base": "نام خانوادگی به حروف فارسی وارد شود",
      }),
    phoneNumber: Joi.string().pattern(/^0/).length(11).required().messages({
      "any.required": `"شماره موبایل" وارد شود`,
      "string.empty": `"شماره موبایل" وارد شود`,
      "string.length": `"شماره موبایل " 11 رقم وارد شود`,
      "string.pattern.base": `"شماره موبایل" استاندارد وارد شود  `,
    }),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .messages({
        "string.email": `"ایمیل" استاندارد وارد شود  `,
      }),
    address: Joi.objectId().required().messages({
      "any.required": `"  آدرس" وارد شود`,
      "objectId.empty": `"  آدرس" وارد شود`,
      "string.empty": `" آدرس" وارد شود`,
    }),
  });
  const { error } = schema.validate({
    firstName,
    lastName,
    phoneNumber,
    email,
    address,
  });
  if (error) {
    validationMessage(res, error.details[0].message);
  }

  const existPhoneNumber = await User.find({
    phoneNumber,
    _id: { $ne: id },
  }).countDocuments();
  if (existPhoneNumber > 0) {
    validationMessage(res, "شماره موبایل تکراری می باشد");
  }
  next();
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      address,
      id,
    }: RegisterTypes = req.body;

    const updateUser = await User.findByIdAndUpdate(id, {
      firstName,
      lastName,
      phoneNumber,
      email,
      address,
    });
    if (!updateUser) {
      catchMessage(res);
    } else {
      successMessage(res, "اطلاعات شما با موفقیت ویرایش گردید");
    }
  } catch (err) {
    catchMessage(res);
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId: string = req.query.userId as string;

    let user = await User.findById(userId).populate({
      path: "address",
    });
    if (!user) {
      return validationMessage(res, "کاربری یافت نشد");
    }
    successMessage(res, "", user);
  } catch (error) {
    catchMessage(res);
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    let users = await User.find({ isDeleted: { $ne: true } }).sort({
      createdAt: 1,
    });
    if (!users) {
      return validationMessage(res, "کاربری یافت نشد");
    }
    successMessage(res, "", users);
  } catch (error) {
    catchMessage(res);
  }
};

export const getUsersPage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { rowsPerPage, page, search }: UserRequestParams = {
      rowsPerPage: Number(req.query.rowsPerPage),
      page: Number(req.query.page),
      search: req.query.search as string,
    };
    if (typeof rowsPerPage !== "number" || typeof page !== "number") {
      return validationMessage(res, "مقادیر ارسالی نامعتبر می باشد");
    }
    const conditions: any = { isDeleted: { $ne: true } };
    const searchRegex = new RegExp(search, "i");
    const searchClauses = [
      { phoneNumber: { $regex: searchRegex } },
      { firstName: { $regex: searchRegex } },
      { lastName: { $regex: searchRegex } },
      { email: { $regex: searchRegex } },
    ];
    if (search && search !== "") {
      conditions.$or = searchClauses;
    }

    let pipeline = [
      {
        $match: conditions,
      },
      {
        $facet: {
          datas: [
            { $skip: rowsPerPage * page - rowsPerPage },
            { $limit: rowsPerPage },
          ],
          count: [
            {
              $count: "count",
            },
          ],
        },
      },
    ];
    let result = await User.aggregate(pipeline);
    const count = result[0]?.count?.[0]?.count ?? 0;
    const users = result[0]?.datas ?? [];
    if (!users.length) {
      return validationMessage(res, "کاربری یافت نشد");
    }
    successMessage(res, "", { users, count });
  } catch (error) {
    return catchMessage(res);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId: string = req.query.userId as string;

    let user = await User.findByIdAndUpdate(userId, { isDeleted: true });
    if (!user) {
      return validationMessage(res, "خطایی رخ داده است مجددا تلاش نمایید");
    }
    successMessage(res, "کاربر مورد نظر با موفقیت حذف گردید", user);
  } catch (error) {
    catchMessage(res);
  }
};

export const generateActivationCode = (length: number): string => {
  const chars = "0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const sendPhoneActivationCode = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { phoneNumber }: { phoneNumber: string } = req.body;
    const schema = Joi.object({
      phoneNumber: Joi.string().pattern(/^0/).length(11).required().messages({
        "any.required": `"شماره موبایل" وارد شود`,
        "string.empty": `"شماره موبایل" وارد شود`,
        "string.length": `"شماره موبایل " 11 رقم وارد شود`,
        "string.pattern.base": `"شماره موبایل" استاندارد وارد شود  `,
      }),
    });
    const { error } = schema.validate({
      phoneNumber,
    });
    if (error) {
      return validationMessage(res, error.details[0].message);
    }
    const phoneActivationCode: string = generateActivationCode(6);
    User.findOneAndUpdate(
      {
        phoneNumber,
      },
      {
        phoneActivationCode,
      },
      (err: any, doc: any) => {
        if (err || !doc) {
          validationMessage(res, "شماره تلفن نامعتبر است");
        } else {
          successMessage(
            res,
            "کد فعاسازی برای شما ارسال شد \nلطفا با کد فعالسازی مربوطه رمز جدید خود را تنظیم کنید"
          );
          sendSMSIR(
            `کد فعالسازی جهت تغییر رمز عبور : ${phoneActivationCode}`,
            doc.phone
          );
        }
      }
    );
  } catch (error) {
    return catchMessage(res);
  }
};

export const phoneActivation = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    const { phoneActivationCode }: { phoneActivationCode: string } = req.body;

    const schema = Joi.object({
      phoneActivationCode: Joi.string().required().messages({
        "any.required": `"کد فعالسازی موبایل" وارد شود`,
        "string.empty": `"کد فعالسازی موبایل" وارد شود`,
      }),
    });
    const { error } = schema.validate({
      phoneActivationCode,
    });
    if (error) {
      return validationMessage(res, error.details[0].message);
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      catchMessage(res);
      return;
    } else if (user.phoneActivationCode !== phoneActivationCode) {
      validationMessage(res, "کد نامعتر می باشد");
      return;
    } else if (
      user.phoneActivationExpiresAt &&
      user.phoneActivationExpiresAt < new Date()
    ) {
      validationMessage(res, "کد منقضی شده است، مجددا تلاش نمایید");
      return;
    } else {
      User.findOneAndUpdate(
        {
          _id: user._id,
        },
        {
          isPhoneActivated: true,
        },
        (err: any, doc: any) => {
          if (err || !doc) {
            catchMessage(res);
            return;
          } else {
            successMessage(res, "شماره موبایل شما با موفقیت تایید شد");
          }
        }
      );
    }
  } catch (error) {
    catchMessage(res);
    return;
  }
};

export const sendEmailActivationCode = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email }: { email: string } = req.body;
    const schema = Joi.object({
      email: Joi.string()
        .required()
        .email({ tlds: { allow: false } })
        .messages({
          "string.email": `"ایمیل" استاندارد وارد شود  `,
          "any.required": `"ایمیل" وارد شود`,
          "string.empty": `"ایمیل" وارد شود`,
        }),
    });
    const { error } = schema.validate({
      email,
    });
    if (error) {
      return validationMessage(res, error.details[0].message);
    }
    const emailActivationCode: string = generateActivationCode(6);
    User.findOneAndUpdate(
      {
        email,
      },
      {
        emailActivationCode,
      },
      (err: any, doc: any) => {
        if (err || !doc) {
          validationMessage(res, "ایمیل نامعتبر است");
        } else {
          successMessage(
            res,
            "کد فعاسازی برای شما ارسال شد \nلطفا با کد فعالسازی مربوطه رمز جدید خود را تنظیم کنید"
          );
          sendEmail(
            `کد فعالسازی جهت تغییر رمز عبور : ${emailActivationCode}`,
            email,
            "تایید ایمیل"
          );
        }
      }
    );
  } catch (error) {
    return catchMessage(res);
  }
};

export const emailActivation = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    const { emailActivationCode }: { emailActivationCode: string } = req.body;

    const schema = Joi.object({
      phoneActivationCode: Joi.string().required().messages({
        "any.required": `"کد فعالسازی ایمیل" وارد شود`,
        "string.empty": `"کد فعالسازی ایمیل" وارد شود`,
      }),
    });
    const { error } = schema.validate({
      emailActivationCode,
    });
    if (error) {
      return validationMessage(res, error.details[0].message);
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      catchMessage(res);
      return;
    } else if (user.emailActivationCode !== emailActivationCode) {
      validationMessage(res, "کد نامعتر می باشد");
      return;
    } else if (
      user.emailActivationExpiresAt &&
      user.emailActivationExpiresAt < new Date()
    ) {
      validationMessage(res, "کد منقضی شده است، مجددا تلاش نمایید");
      return;
    } else {
      User.findOneAndUpdate(
        {
          _id: user._id,
        },
        {
          isEmailActivated: true,
        },
        (err: any, doc: any) => {
          if (err || !doc) {
            catchMessage(res);
            return;
          } else {
            successMessage(res, "ایمیل شما با موفقیت تایید شد");
          }
        }
      );
    }
  } catch (error) {
    catchMessage(res);
    return;
  }
};

// Function to generate a reset token based on user's phone number and user ID with expiration time
const generateResetToken = async (
  phoneNumber: string,
  userId: Types.ObjectId,
  expirationMinutes: number
): Promise<string> => {
  const expirationTime = Date.now() + expirationMinutes * 60 * 1000;
  const tokenData = `${phoneNumber}${userId}${expirationTime}`;

  // Hash token data using bcrypt
  const hashedToken = await bcrypt.hash(tokenData, 10);
  return hashedToken;
};

// Request Password Reset
export const requestPasswordReset = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    const { phoneNumber }: { phoneNumber: string } = req.body;
    const schema = Joi.object({
      phoneNumber: Joi.string().pattern(/^0/).length(11).required().messages({
        "any.required": `"شماره موبایل" وارد شود`,
        "string.empty": `"شماره موبایل" وارد شود`,
        "string.length": `"شماره موبایل " 11 رقم وارد شود`,
        "string.pattern.base": `"شماره موبایل" استاندارد وارد شود  `,
      }),
    });
    const { error } = schema.validate({
      phoneNumber,
    });
    if (error) {
      return validationMessage(res, error.details[0].message);
    }
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return validationMessage(res, "ایمیل نامعتبر است");
    } else {
      const resetToken = generateResetToken(phoneNumber, req.user.id, 15); // Generate reset token

      sendSMSIR(`${resetToken}`, phoneNumber);
      successMessage(res, "لینک بازیابی رمز عبور به موبایل شما ارسال شد");
    }
  } catch (error) {
    return catchMessage(res);
  }
};

// Reset Password
export const resetPassword = async (req: any, res: Response): Promise<void> => {
  try {
    const {
      resetToken,
      newPassword,
      phoneNumber,
      userId,
    }: {
      resetToken: string;
      newPassword: string;
      phoneNumber: string;
      userId: Types.ObjectId;
    } = req.body;
    const schema = Joi.object({
      phoneNumber: Joi.string().pattern(/^0/).length(11).required().messages({
        "any.required": `"شماره موبایل" وارد شود`,
        "string.empty": `"شماره موبایل" وارد شود`,
        "string.length": `"شماره موبایل " 11 رقم وارد شود`,
        "string.pattern.base": `"شماره موبایل" استاندارد وارد شود  `,
      }),
      newPassword: Joi.string().required().min(8).max(256).messages({
        "string.min": `"رمز عبور" حداقل {#limit} کاراکتر وارد شود  `,
        "string.max": `"رمز عبور" حداکثر {#limit} کاراکتر وارد شود  `,
        "any.required": `"رمز عبور" وارد شود`,
        "string.empty": "رمز عبور وارد شود",
      }),
      userId: Joi.objectId().required().messages({
        "any.required": `"کاربر لاگین نمی باشد"`,
        "objectId.empty": `"کاربر لاگین نمی باشد" `,
        "string.empty": `"کاربر لاگین نمی باشد" `,
      }),
    });
    const { error } = schema.validate({
      phoneNumber,
      newPassword,
      userId,
    });
    if (error) {
      return validationMessage(res, error.details[0].message);
    }
    const expectedToken = await generateResetToken(phoneNumber, userId, 15);

    // Compare the expected token with the provided token
    const isValidToken = await bcrypt.compare(expectedToken, resetToken);

    if (!isValidToken) {
      return validationMessage(
        res,
        "لینک بازیابی رمز عبور نامعتبر است یا منقضی شده است"
      );
    }

    const expirationTimeIndex = phoneNumber.length + userId.toString().length;
    const expirationTime = parseInt(resetToken.slice(expirationTimeIndex), 10);

    if (expirationTime >= Date.now()) {
      const hashPassword = await bcrypt.hash(newPassword, 10);
      const updateUser = await User.findByIdAndUpdate(userId, {
        password: hashPassword,
      });
      if (!updateUser) {
        return catchMessage(res);
      } else {
        return successMessage(res, "رمز عبور با موفقیت تغییر یافت");
      }
    } else {
      return validationMessage(
        res,
        "لینک بازیابی رمز عبور نامعتبر است یا منقضی شده است"
      );
    }
  } catch (error) {
    return catchMessage(res);
  }
};
