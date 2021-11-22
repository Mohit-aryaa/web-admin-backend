var express = require('express');
var router = express.Router();
var questionsController = require('../controllers/questionsController.js');
const { route } = require('./consultantRoutes.js');

/*
 * GET
 */
router.get('/', questionsController.list);

/*
 * GET
 */
router.get('/:id', questionsController.show);

/*
 * POST
 */
router.post('/', questionsController.create);

router.post('/bulkDelete', questionsController.bulkDelete);



/*
 * PUT
 */
router.put('/:id', questionsController.update);

/*
 * DELETE
 */
router.delete('/:id', questionsController.remove);

module.exports = router;
