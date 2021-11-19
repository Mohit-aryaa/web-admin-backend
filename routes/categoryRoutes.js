var express = require('express');
var router = express.Router();
var categoryController = require('../controllers/categoryController.js');
// const upload = require('../middleware/upload');
const upload = require("../middleware/upload-image");
/*
 * GET
 */
router.get('/', categoryController.list);

/*
 * GET
 */
router.get('/:id', categoryController.show);

/*
 * POST
 */
router.post('/', categoryController.create);

// router.post('/store', upload.single('images'), categoryController.store);
router.post('/upload',  upload.single("banner"), categoryController.upload);

router.get("/file/:id", categoryController.getFile)

router.post('/bulkDelete', categoryController.bulkDelete);
/*
 * PUT
 */
router.put('/:id', categoryController.update);

/*
 * DELETE
 */
router.delete('/:id', categoryController.remove);

module.exports = router;
