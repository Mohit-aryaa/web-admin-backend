var express = require('express');
var router = express.Router();
var ClientController = require('../controllers/ClientController.js');

/*
 * GET
 */
router.get('/', ClientController.list);

/*
 * GET
 */
router.get('/:id', ClientController.show);

/*
 * POST
 */
router.post('/', ClientController.create);

/*
 * PUT
 */
router.put('/:id', ClientController.update);

/*
 * DELETE
 */
router.delete('/:id', ClientController.remove);

module.exports = router;
