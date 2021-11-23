var express = require('express');
var router = express.Router();
var adminController = require('../controllers/adminController.js');

/*
 * GET
 */
router.get('/', adminController.list);

/*
 * GET
 */
router.get('/:id', adminController.show);

router.post('/vendorSignIn/', adminController.vendorSignIn)

/*
 * POST
 */
router.post('/', adminController.create);

/*
 * PUT
 */
router.put('/:id', adminController.update);

/*
 * DELETE
 */
router.delete('/:id', adminController.remove);

module.exports = router;
