var ShippingModel = require('../models/shippingModel.js');

/**
 * shippingController.js
 *
 * @description :: Server-side logic for managing shippings.
 */
module.exports = {

    /**
     * shippingController.list()
     */
    list: function (req, res) {
        let offset = parseInt(req.query.offset) || 0;
        let size = parseInt(req.query.limit);
        let filter = req.query.filter
        let from = (offset * size) || 0;
        let to = (from + size) || 10;
        ShippingModel.find(function (err, shippings) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting shipping.',
                    error: err
                });
            } else {
                if (filter) {
                    shippings = shippings.filter(el => {
                        let el2 = JSON.parse(JSON.stringify(el))
                        for (let key in el2) {
                            let setProducts = el[key]?.toString().toLowerCase().includes(filter.toLowerCase())
                            if (setProducts) {
                                return true;
                            }
                        }
                        return false;
                    })
                }
                let Shippings = shippings.slice(from, to);
                res.status(200).json({
                    total: shippings.length,
                    Shippings
                });
            }
        }).sort({_id:-1});
    },

    /**
     * shippingController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        ShippingModel.findOne({_id: id}, function (err, shipping) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting shipping.',
                    error: err
                });
            }

            if (!shipping) {
                return res.status(404).json({
                    message: 'No such shipping'
                });
            }

            return res.json(shipping);
        });
    },

    /**
     * shippingController.create()
     */
    create: function (req, res) {
        var shipping = new ShippingModel({
			shippingCost : req.body.shippingCost,
			shippingFrom : req.body.shippingFrom,
			shippingTo : req.body.shippingTo,
			shippingTime : req.body.shippingTime,
			minimumOrder : req.body.minimumOrder,
			prePaid : req.body.prePaid,
			postPaid : req.body.postPaid,
            created_at : new Date(),
            updated_at: 'none'
        });

        shipping.save(function (err, shipping) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating shipping',
                    error: err
                });
            }

            return res.status(201).json(shipping);
        });
    },

    /**
     * shippingController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        ShippingModel.findOne({_id: id}, function (err, shipping) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting shipping',
                    error: err
                });
            }

            if (!shipping) {
                return res.status(404).json({
                    message: 'No such shipping'
                });
            }

            shipping.shippingCost = req.body.shippingCost ? req.body.shippingCost : shipping.shippingCost;
			shipping.shippingFrom = req.body.shippingFrom ? req.body.shippingFrom : shipping.shippingFrom;
			shipping.shippingTo = req.body.shippingTo ? req.body.shippingTo : shipping.shippingTo;
			shipping.shippingTime = req.body.shippingTime ? req.body.shippingTime : shipping.shippingTime;
			shipping.minimumOrder = req.body.minimumOrder ? req.body.minimumOrder : shipping.minimumOrder;
			shipping.prePaid = req.body.prePaid ? req.body.prePaid : shipping.prePaid;
			shipping.postPaid = req.body.postPaid ? req.body.postPaid : shipping.postPaid;
            shipping.updated_at = new Date();
			
            shipping.save(function (err, shipping) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating shipping.',
                        error: err
                    });
                }

                return res.json(shipping);
            });
        });
    },

    /**
     * shippingController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        ShippingModel.findByIdAndRemove(id, function (err, shipping) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the shipping.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    bulkDelete: function (req, res) {
        const getId = req.body
        const query = { _id: { $in: getId} };
        console.log(query)
        
        
        ShippingModel.deleteMany(query, function (err) {
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
