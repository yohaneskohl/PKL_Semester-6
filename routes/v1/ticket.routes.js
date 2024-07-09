const { Router } = require('express');
const ticket = require('../../controllers/ticket.controller');
const flight = require('../../controllers/flight.controllers');
const router = Router();

router.get('/', ticket.getAll);
router.get('/search', ticket.search);
router.get('/:id', ticket.getById);
router.get('/favorite', flight.favoriteDestinations);

module.exports = router;
