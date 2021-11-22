var express = require('express');
var router = express.Router();
var couponController = require('../controllers/couponController.js');

/*
 * GET
 */
router.get('/', couponController.list);

/*
 * GET
 */
router.get('/:id', couponController.show);

/*
 * POST
 */
router.post('/', couponController.create);

/*
 * PUT
 */
router.put('/:id', couponController.update);

/*
 * DELETE
 */
router.delete('/:id', couponController.remove);

router.post('/setPublish', couponController.setPublish);

router.post('/bulkPublish', couponController.bulkPublish);

router.post('/bulkUnpublish', couponController.bulkUnpublish);

router.post('/bulkDelete', couponController.bulkDelete);

module.exports = router;
