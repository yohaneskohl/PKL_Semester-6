const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const { generateHash, compareHash } = require('../libs/bcrypt');
const sendEmail = require('../utils/sendEmail');
const getRenderedHtml = require('../utils/getRenderedHtml');
const otp = require('../utils/generateOtp');
const separateName = require('../utils/separateName');
const axios = require('axios');
const prisma = new PrismaClient();
const { JWT_SECRET_KEY } = process.env;

module.exports = {
  register: async (req, res, next) => {
    try {
      let { fullName, email, phoneNumber, password } = req.body;

      if (!fullName || !email || !password || !phoneNumber) {
        return res.status(400).json({
          status: false,
          message: 'All required fields must be filled',
          data: null,
        });
      }

      const phoneRegex = /^0[2-9]\d{8,12}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({
          status: false,
          message: 'Phone number must start with 0 and be 10-14 digits long',
          data: null,
        });
      }

      let exist = await prisma.user.findUnique({ where: { email } });

      if (exist) {
        return res.status(401).json({
          status: false,
          message: 'Email already used!',
          data: null,
        });
      }

      const MIN_PASSWORD_LENGTH = 6;
      if (password.length < MIN_PASSWORD_LENGTH) {
        return res.status(400).json({
          status: false,
          message: `Password must have minimum of ${MIN_PASSWORD_LENGTH} characters`,
          data: null,
        });
      }

      let encryptedPassword = await generateHash(password);
      const { firstName, familyName } = separateName(fullName);

      let user = await prisma.user.create({
        data: {
          fullName: firstName,
          familyName,
          phoneNumber,
          email,
          password: encryptedPassword,
          emailIsVerified: false,
        },
      });

      const otpCode = otp.generateOTP().toString();

      const convertCreatedAt = new Date();
      const convertUTCCreatedAt = new Date(
        convertCreatedAt.getTime() + 7 * 60 * 60 * 1000
      ).toISOString();

      await prisma.otp.create({
        data: {
          userId: user.id,
          code: otpCode,
          createdAt: convertUTCCreatedAt,
        },
      });

      await prisma.notification.create({
        data: {
          title: 'Success Register',
          message: 'Akun berhasil dibuat!',
          type: 'general',
          userId: user.id,
          createdAt: convertUTCCreatedAt,
        },
      });

      try {
        const html = getRenderedHtml('otp-email', {
          fullName: user.fullName,
          otp: otpCode,
        });

        await sendEmail({ to: email, subject: 'Your OTP Code', html });
        console.log('Email sent successfully');
      } catch (error) {
        console.error('Failed to send email:', error);
      }

      res.status(200).json({
        status: true,
        message: 'User registered successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  updateUserProfile: async (req, res, next) => {
    try {
      const { id } = req.user;
      const {
        fullName,
        phoneNumber,
        identityType,
        identityNumber,
        nationality,
      } = req.body;

      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        return res.status(404).json({
          status: false,
          message: 'User not found',
          data: null,
        });
      }

      const phoneRegex = /^0[2-9]\d{8,12}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({
          status: false,
          message:
            'Nomor telepon harus dimulai dengan 0 dan memiliki panjang 10-13 digit',
          data: null,
        });
      }

      if (identityType === 'KTP' && !/^\d{16}$/.test(identityNumber)) {
        return res.status(400).json({
          status: false,
          message: 'Nomor KTP harus terdiri dari 16 digit',
          data: null,
        });
      }

      if (identityType === 'SIM' && !/^\d{16}$/.test(identityNumber)) {
        return res.status(400).json({
          status: false,
          message: 'Nomor SIM harus terdiri dari 16 digit',
          data: null,
        });
      }

      if (identityType === 'Paspor' && !/^[A-Z]\d{6}$/.test(identityNumber)) {
        return res.status(400).json({
          status: false,
          message:
            'Nomor paspor harus terdiri dari 1 huruf kapital diikuti oleh 6 digit',
          data: null,
        });
      }

      const { firstName, familyName } = separateName(fullName);
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          fullName: firstName,
          familyName,
          phoneNumber,
          identityType,
          identityNumber,
          nationality,
        },
      });

      return res.status(200).json({
        status: true,
        message: 'User profile updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const id = req.user.id;

      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        return res.status(404).json({
          status: false,
          message: 'User not found',
          data: null,
        });
      }

      await prisma.notification.deleteMany({
        where: { userId: id },
      });

      await prisma.otp.deleteMany({
        where: { userId: id },
      });

      const bookings = await prisma.booking.findMany({
        where: { userId: id },
      });

      for (const booking of bookings) {
        await prisma.payment.deleteMany({
          where: { bookingId: booking.id },
        });
        await prisma.passenger.deleteMany({
          where: { bookingId: booking.id },
        });
        await prisma.booking.delete({
          where: { id: booking.id },
        });
      }

      await prisma.user.delete({ where: { id } });

      return res.status(200).json({
        status: true,
        message: 'User deleted successfully',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },

  getAll: async (req, res, next) => {
    try {
      const users = await prisma.user.findMany();
      return res.status(200).json({
        status: true,
        message: 'Users fetched successfully',
        data: users,
      });
    } catch (error) {
      next(error);
    }
  },
};
