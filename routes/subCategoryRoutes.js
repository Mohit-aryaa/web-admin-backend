var express = require('express');
var router = express.Router();
var subCategoryController = require('../controllers/subCategoryController.js');
//const upload = require('../middleware/upload');
const upload = require("../middleware/upload-image");
/*
 * GET
 */
router.get('/', subCategoryController.list);

router.get('/getDataByCategoryId/:id', subCategoryController.listDataByCategoryId)

/*
 * GET
 */
router.get('/:id', subCategoryController.show);

//router.post('/store', upload.single('images'), subCategoryController.store);
router.post('/upload',  upload.single("banner"), subCategoryController.upload);

router.get("/file/:id", subCategoryController.getFile)
/*
 * POST
 */
router.post('/', subCategoryController.create);

router.post('/bulkDelete', subCategoryController.bulkDelete);

/*
 * PUT
 */
router.put('/:id', subCategoryController.update);

/*
 * DELETE
 */
router.delete('/:id', subCategoryController.remove);

module.exports = router;
