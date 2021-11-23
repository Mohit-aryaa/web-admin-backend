var express = require('express');
var router = express.Router();
var servicesController = require('../controllers/servicesController');
//const upload = require('../middleware/upload');
const upload = require("../middleware/upload-image");
/*
 * GET
 */
router.get('/', servicesController.list);


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


/*
 * DELETE
 */
router.delete('/:id', servicesController.remove);

module.exports = router;
