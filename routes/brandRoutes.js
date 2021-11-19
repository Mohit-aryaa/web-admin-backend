var express = require('express');
var router = express.Router();
var brandController = require('../controllers/brandController.js');
//const upload = require('../middleware/upload');
const upload = require("../middleware/upload-image");
/*
 * GET
 */
router.get('/', brandController.list);

/*
 * GET
 */
router.get('/:id', brandController.show);

/*
 * POST
 */
router.post('/', brandController.create);

//router.post('/store', upload.single('images'), brandController.store);

router.post('/upload',  upload.single("banner"), brandController.upload);

router.get("/file/:id", brandController.getFile)

router.post('/bulkDelete', brandController.bulkDelete);

/*
 * PUT
 */
router.put('/:id', brandController.update);

/*
 * DELETE
 */
router.delete('/:id', brandController.remove);

module.exports = router;
