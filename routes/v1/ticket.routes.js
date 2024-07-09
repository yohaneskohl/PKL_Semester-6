const { Router } = require('express');
const ticket = require('../../controllers/ticket.controller');
const router = Router();

router.get('/', ticket.getAll);
router.get('/search', ticket.search);
router.get('/:id', ticket.getById);

module.exports = router;
