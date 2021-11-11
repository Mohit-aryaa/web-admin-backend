var StocklogsModel = require('../models/stockLogsModel.js');

/**
 * stockLogsController.js
 *
 * @description :: Server-side logic for managing stockLogss.
 */
module.exports = {

    /**
     * stockLogsController.list()
     */
    list: function (req, res) {
        let offset = parseInt(req.query.offset) || 0;
        let size = parseInt(req.query.limit);
        let filter = req.query.filter || '';

        let from = (offset * size) || 0;
        let to = (from + size) || 10;

        StocklogsModel.find(function (err, stockLogs) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting stockLogs.',
                    error: err
                });
            }

            if (filter) {
                stockLogs = stockLogs.filter(el => {
                    let el2 = JSON.parse(JSON.stringify(el))
                    for(let key in el2) {
                        let checkStockLogs = el[key]?.toString().toLowerCase().includes(filter.toLowerCase())
                        if(checkStockLogs) {
                            return true;
                        }
                    }
                    return false;
                })
            }

            let data = stockLogs.slice(from, to);
            res.status(200).json({
                total: stockLogs.length,
                StockLogs: data
            });
        }).sort({_id:-1});
    },

    /**
     * stockLogsController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        StocklogsModel.findOne({_id: id}, function (err, stockLogs) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting stockLogs.',
                    error: err
                });
            }

            if (!stockLogs) {
                return res.status(404).json({
                    message: 'No such stockLogs'
                });
            }

            return res.json(stockLogs);
        });
    },

    /**
     * stockLogsController.create()
     */
    // create: function (req, res) {
    //     var stockLogs = new StocklogsModel({
	// 		name : req.body.name,
	// 		entryType : req.body.entryType,
	// 		quantity : req.body.quantity
    //     });

    //     stockLogs.save(function (err, stockLogs) {
    //         if (err) {
    //             return res.status(500).json({
    //                 message: 'Error when creating stockLogs',
    //                 error: err
    //             });
    //         }

    //         return res.status(201).json(stockLogs);
    //     });
    // },

    /**
     * stockLogsController.update()
     */
    // update: function (req, res) {
    //     var id = req.params.id;

    //     StocklogsModel.findOne({_id: id}, function (err, stockLogs) {
    //         if (err) {
    //             return res.status(500).json({
    //                 message: 'Error when getting stockLogs',
    //                 error: err
    //             });
    //         }

    //         if (!stockLogs) {
    //             return res.status(404).json({
    //                 message: 'No such stockLogs'
    //             });
    //         }

    //         stockLogs.name = req.body.name ? req.body.name : stockLogs.name;
	// 		stockLogs.entryType = req.body.entryType ? req.body.entryType : stockLogs.entryType;
	// 		stockLogs.quantity = req.body.quantity ? req.body.quantity : stockLogs.quantity;
			
    //         stockLogs.save(function (err, stockLogs) {
    //             if (err) {
    //                 return res.status(500).json({
    //                     message: 'Error when updating stockLogs.',
    //                     error: err
    //                 });
    //             }

    //             return res.json(stockLogs);
    //         });
    //     });
    // },

    /**
     * stockLogsController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        StocklogsModel.findByIdAndRemove(id, function (err, stockLogs) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the stockLogs.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    bulkDelete: function (req, res) {
        const getId = req.body
        const query = { _id: { $in: getId } };
        console.log(query)
        
        StocklogsModel.deleteMany(query, function (err) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the products.',
                    error: err
                });
            } 

            return res.status(200).json({
                message: 'Products deleted successfully'
            });

        });
    }
};
