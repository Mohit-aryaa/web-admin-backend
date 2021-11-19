var express = require('express');
var router = express.Router();
var vendorController = require('../controllers/vendorController.js');

/*
 * GET
 */
router.get('/', vendorController.list);

/*
 * GET
 */
router.get('/:id', vendorController.show);

/*
 * POST
 */
router.post('/', vendorController.create);

router.post('/bulkDelete', vendorController.bulkDelete);



/*
 * PUT
 */
router.put('/:id', vendorController.update);

/*
 * DELETE
 */
router.delete('/:id', vendorController.remove);

module.exports = router;
