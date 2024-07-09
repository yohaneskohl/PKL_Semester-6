const router = require('express').Router();
const { getAll} = require('../../controllers/notification.controllers');
const {
  restrict,
} = require('../../middlewares/auth.middleware');

router.get('/', restrict, getAll);


module.exports = router;
