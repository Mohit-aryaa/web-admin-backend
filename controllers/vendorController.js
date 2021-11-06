var VendorModel = require('../models/vendorModel.js');

/**
 * vendorController.js
 *
 * @description :: Server-side logic for managing vendors.
 */
module.exports = {

    /**
     * vendorController.list()
     */
    list: function (req, res) {
        let offset = parseInt(req.query.offset) || 0;
        let size = parseInt(req.query.limit);
        let filter = req.query.filter

        let from = (offset * size) || 0;
        let to = (from + size) || 10;
        VendorModel.find(function (err, vendors) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting vendor.',
                    error: err
                });
            } else {
                if (filter) {
                    vendors = vendors.filter(el => {
                        let el2 = JSON.parse(JSON.stringify(el))
                        for(let key in el2) {
                            let checkVendor = el[key]?.toString().toLowerCase().includes(filter.toLowerCase())
                            if(checkVendor) {
                                return true;
                            }
                        }
                        return false;
                    })
                }
                let Vendors = vendors.slice(from, to);
                res.status(200).json({
                    total: Vendors.length,
                    Vendors
                });
            }
        }).sort({_id:-1});
    },

    /**
     * vendorController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        VendorModel.findOne({_id: id}, function (err, vendor) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting vendor.',
                    error: err
                });
            }

            if (!vendor) {
                return res.status(404).json({
                    message: 'No such vendor'
                });
            }

            return res.json(vendor);
        });
    },

    /**
     * vendorController.create()
     */
    create: function (req, res) {
        var vendor = new VendorModel({
			name : req.body.name,
			status : req.body.status
        });

        vendor.save(function (err, vendor) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating vendor',
                    error: err
                });
            }

            return res.status(201).json(vendor);
        });
    },

    /**
     * vendorController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        VendorModel.findOne({_id: id}, function (err, vendor) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting vendor',
                    error: err
                });
            }

            if (!vendor) {
                return res.status(404).json({
                    message: 'No such vendor'
                });
            }

            vendor.name = req.body.name ? req.body.name : vendor.name;
			vendor.status = req.body.status ? req.body.status : vendor.status;
			
            vendor.save(function (err, vendor) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating vendor.',
                        error: err
                    });
                }

                return res.json(vendor);
            });
        });
    },

    /**
     * vendorController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        VendorModel.findByIdAndRemove(id, function (err, vendor) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the vendor.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
