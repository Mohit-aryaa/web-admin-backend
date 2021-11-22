var express = require('express');
var router = express.Router();
var consultantController = require('../controllers/consultantController.js');
const upload = require("../middleware/upload-image");
/*
 * GET
 */
router.get('/', consultantController.list);

/*
 * GET
 */
router.get('/:id', consultantController.show);

/*
 * POST
 */
router.post('/', consultantController.create);

/*
 * PUT
 */
router.put('/:id', consultantController.update);

/*
 * DELETE
 */
router.delete('/:id', consultantController.remove);

router.post('/bulkDelete', consultantController.bulkDelete);

router.post('/upload',  upload.single("logo"), consultantController.upload);

router.get("/file/:id", consultantController.getFile);

module.exports = router;
