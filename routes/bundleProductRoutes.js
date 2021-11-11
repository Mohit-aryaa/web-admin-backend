var express = require('express');
var router = express.Router();
var bundleProductController = require('../controllers/bundleProductController.js');
const upload = require('../middleware/upload');

/*
 * GET
 */
router.get('/', bundleProductController.list);

/*
 * GET
 */
router.get('/:id', bundleProductController.show);

/*
 * POST
 */
router.post('/', bundleProductController.create);

router.post('/store', upload.single('productImage'), bundleProductController.store);


router.post('/bulkDelete', bundleProductController.bulkDelete);
/*
 * PUT
 */
router.put('/:id', bundleProductController.update);

/*
 * DELETE
 */
router.delete('/:id', bundleProductController.remove);

module.exports = router;
