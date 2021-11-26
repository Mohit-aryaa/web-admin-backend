var express = require('express');
var router = express.Router();
var notificationController = require('../controllers/notificationController');
// const upload = require('../middleware/upload');
const upload = require("../middleware/upload-image");


router.get('/', notificationController.list);


router.get('/:id', notificationController.show);


router.post('/', notificationController.create);

// router.post('/store', upload.single('images'), categoryController.store);
router.post('/upload',  upload.single("banner"), notificationController.upload);

router.get("/file/:id", notificationController.getFile)


router.get("/file/:id", notificationController.getFile)

router.post('/bulkDelete', notificationController.bulkDelete);
/*
 * PUT
 */

/*
 * DELETE
 */
router.delete('/:id', notificationController.remove);

module.exports = router;