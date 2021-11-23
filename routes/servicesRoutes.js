var express = require('express');
var router = express.Router();
var servicesController = require('../controllers/servicesController.js');
//const upload = require('../middleware/upload');
const upload = require("../middleware/upload-image");
/*
 * GET
 */
router.get('/', servicesController.list);

router.get('/stock', servicesController.listStock);

/*
 * GET
 */
router.get('/:id', servicesController.show);

router.post('/removeImage/', servicesController.removeImage);

/*
 * POST
 */
router.post('/',  servicesController.create);

router.post('/upload',  upload.array("images[]"), servicesController.upload);

router.get("/file/:id", servicesController.getFile)

router.post('/bulkPublish', servicesController.bulkPublish);

router.post('/bulkUnpublish', servicesController.bulkUnpublish);

router.post('/bulkDelete', servicesController.bulkDelete);

router.post('/setPublish', servicesController.setPublish);

router.post('/setTodaysDeal', servicesController.setTodaysDeal);

router.post('/setFeatured', servicesController.setFeatured);

/*
 * PUT
 */
router.put('/:id', servicesController.update);

router.put('/stock/:id', servicesController.updateStock);

router.put('/stock/bundle/:id', servicesController.updateBundleStock);

/*
 * DELETE
 */
router.delete('/:id', servicesController.remove);

module.exports = router;
