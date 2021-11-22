var express = require('express');
var router = express.Router();
var productsController = require('../controllers/productsController.js');
//const upload = require('../middleware/upload');
const upload = require("../middleware/upload-image");
/*
 * GET
 */
router.get('/', productsController.list);

router.get('/stock', productsController.listStock);

/*
 * GET
 */
router.get('/:id', productsController.show);

router.post('/removeImage/', productsController.removeImage);

/*
 * POST
 */
router.post('/',  productsController.create);

// router.post('/stock', productsController.createStock);


//router.post('/store', upload.array('images[]'), productsController.store);

router.post('/upload',  upload.array("images[]"), productsController.upload);

router.get("/file/:id", productsController.getFile)

router.post('/bulkPublish', productsController.bulkPublish);

router.post('/bulkUnpublish', productsController.bulkUnpublish);

router.post('/bulkDelete', productsController.bulkDelete);

router.post('/setPublish', productsController.setPublish);

router.post('/setTodaysDeal', productsController.setTodaysDeal);

router.post('/setFeatured', productsController.setFeatured);

/*
 * PUT
 */
router.put('/:id', productsController.update);

router.put('/stock/:id', productsController.updateStock);

router.put('/stock/bundle/:id', productsController.updateBundleStock);

/*
 * DELETE
 */
router.delete('/:id', productsController.remove);

module.exports = router;
