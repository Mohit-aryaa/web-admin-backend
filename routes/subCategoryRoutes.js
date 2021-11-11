var express = require('express');
var router = express.Router();
var subCategoryController = require('../controllers/subCategoryController.js');

/*
 * GET
 */
router.get('/', subCategoryController.list);

router.get('/getDataByCategoryId/:id', subCategoryController.listCategoryData)

/*
 * GET
 */
router.get('/:id', subCategoryController.show);

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
