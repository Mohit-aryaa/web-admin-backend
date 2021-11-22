var express = require('express');
var router = express.Router();
var bundleProductController = require('../controllers/bundleProductController.js');
//const upload = require('../middleware/upload');
const upload = require("../middleware/upload-image");
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

router.post('/removeImage/', bundleProductController.removeImage);

//router.post('/store', upload.array('images[]'), bundleProductController.store);

router.post('/upload',  upload.array("images[]"), bundleProductController.upload);

router.get("/file/:id", bundleProductController.getFile)

router.post('/bulkUnpublish', bundleProductController.bulkUnpublish);

router.post('/bulkDelete', bundleProductController.bulkDelete);

router.post('/bulkDelete', bundleProductController.bulkDelete);

router.post('/setPublish', bundleProductController.setPublish);

router.post('/setTodaysDeal', bundleProductController.setTodaysDeal);

router.post('/setFeatured', bundleProductController.setFeatured);
/*
 * PUT
 */
router.put('/:id', bundleProductController.update);

/*
 * DELETE
 */
router.delete('/:id', bundleProductController.remove);

module.exports = router;
