var express = require('express');
var router = express.Router();
var subChildCategoryController = require('../controllers/subChildCategoryController.js');
//const upload = require('../middleware/upload');
const upload = require("../middleware/upload-image");
/*
 * GET
 */
router.get('/', subChildCategoryController.list);

router.get('/getDataBySubCategoryId/:id', subChildCategoryController.listDataBySubCategoryId)

// router.get('/getDataBySubCategoryId/:id', subChildCategoryController.listSubCategoryData)
/*
 * GET
 */
router.get('/:id', subChildCategoryController.show);

/*
 * POST
 */
router.post('/', subChildCategoryController.create);

//router.post('/store', upload.single('images'), subChildCategoryController.store);
router.post('/upload',  upload.single("banner"), subChildCategoryController.upload);

router.get("/file/:id", subChildCategoryController.getFile)
/*
 * PUT
 */
router.put('/:id', subChildCategoryController.update);


router.post('/bulkDelete', subChildCategoryController.bulkDelete);
/*
 * DELETE
 */
router.delete('/:id', subChildCategoryController.remove);

module.exports = router;
