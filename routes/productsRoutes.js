var express = require('express');
var router = express.Router();
var productsController = require('../controllers/productsController.js');
const upload = require('../middleware/upload');
/*
 * GET
 */
router.get('/', productsController.list);

/*
 * GET
 */
router.get('/:id', productsController.show);

/*
 * POST
 */
router.post('/',  productsController.create);


router.post('/store', upload.single('productImage'), productsController.store);

router.post('/bulkDelete', productsController.bulkDelete);

/*
 * PUT
 */
router.put('/:id', productsController.update);

/*
 * DELETE
 */
router.delete('/:id', productsController.remove);

module.exports = router;
