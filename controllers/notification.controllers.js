const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const getPagination = require('../utils/getPagination');
const { convertDate } = require('../utils/formatedDate');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const {
        page = req.query.page || 1,
        limit = req.query.limit || 10,
        search,
        type,
      } = req.query;

      let whereClause = {
        userId: Number(req.user.id),
        title: { contains: search, mode: 'insensitive' },
      };

      if (type) {
        if (type === 'transaction') {
          whereClause.type = 'transaction';
        } else if (type === 'promo') {
          whereClause.type = 'promo';
        } else {
          whereClause.type = 'general';
        }
      }

      const notifications = await prisma.notification.findMany({
        where: whereClause,
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      });

      const count = await prisma.notification.count({
        where: whereClause,
      });

      const pagination = getPagination(req, page, limit, count);

      return res.status(200).json({
        status: true,
        message: 'Notifications retrieved successfully',
        data: notifications,
        pagination: pagination,
      });
    } catch (error) {
      next(error);
    }
  },
};
