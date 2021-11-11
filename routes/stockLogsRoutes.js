var express = require('express');
var router = express.Router();
var stockLogsController = require('../controllers/stockLogsController.js');

/*
 * GET
 */
router.get('/', stockLogsController.list);

/*
 * GET
 */
router.get('/:id', stockLogsController.show);

/*
 * POST
 */
// router.post('/', stockLogsController.create);

/*
 * PUT
 */
// router.put('/:id', stockLogsController.update);

/*
 * DELETE
 */
router.delete('/:id', stockLogsController.remove);

router.post('/bulkDelete', stockLogsController.bulkDelete);


module.exports = router;
