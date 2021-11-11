var express = require('express');
var router = express.Router();
var brandController = require('../controllers/brandController.js');

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
