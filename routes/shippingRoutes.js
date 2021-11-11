var express = require('express');
var router = express.Router();
var shippingController = require('../controllers/shippingController.js');

/*
 * GET
 */
router.get('/', shippingController.list);

/*
 * GET
 */
router.get('/:id', shippingController.show);

/*
 * POST
 */
router.post('/', shippingController.create);

router.post('/bulkDelete', shippingController.bulkDelete);

/*
 * PUT
 */
router.put('/:id', shippingController.update);

/*
 * DELETE
 */
router.delete('/:id', shippingController.remove);

module.exports = router;
