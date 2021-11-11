var BrandModel = require('../models/brandModel.js');

/**
 * brandController.js
 *
 * @description :: Server-side logic for managing brands.
 */
module.exports = {

    /**
     * brandController.list()
     */
    list: function (req, res) {
        let offset = parseInt(req.query.offset) || 0;
        let size = parseInt(req.query.limit);
        let filter = req.query.filter

        let from = (offset * size) || 0;
        let to = (from + size) || 10;
        BrandModel.find(function (err, brands) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting brand.',
                    error: err
                });
            } else {
                if (filter) {
                    brands = brands.filter(el => {
                        let el2 = JSON.parse(JSON.stringify(el))
                        for(let key in el2) {
                            let setBrands = el[key]?.toString().toLowerCase().includes(filter.toLowerCase())
                            if(setBrands) {
                                return true;
                            }
                        }
                        return false;
                    })
                }
                let Brands = brands.slice(from, to);
                res.status(200).json({
                    total: brands.length,
                    Brands
                });
            }
        }).sort({_id: -1});
    },

    /**
     * brandController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        BrandModel.findOne({_id: id}, function (err, brand) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting brand.',
                    error: err
                });
            }

            if (!brand) {
                return res.status(404).json({
                    message: 'No such brand'
                });
            }

            return res.json(brand);
        });
    },

    /**
     * brandController.create()
     */
    create: function (req, res) {
        var brand = new BrandModel({
			brandName : req.body.brandName,
			brandDescription : req.body.brandDescription,
            created_at : new Date(),
            updated_at: 'none'
        });

        brand.save(function (err, brand) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating brand',
                    error: err
                });
            }

            return res.status(201).json(brand);
        });
    },

    /**
     * brandController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        BrandModel.findOne({_id: id}, function (err, brand) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting brand',
                    error: err
                });
            }

            if (!brand) {
                return res.status(404).json({
                    message: 'No such brand'
                });
            }

            brand.brandName = req.body.brandName ? req.body.brandName : brand.brandName;
			brand.brandDescription = req.body.brandDescription ? req.body.brandDescription : brand.brandDescription;
			brand.updated_at = new Date();
            brand.save(function (err, brand) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating brand.',
                        error: err
                    });
                }

                return res.json(brand);
            });
        });
    },

    /**
     * brandController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        BrandModel.findByIdAndRemove(id, function (err, brand) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the brand.',
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
        
        
        BrandModel.deleteMany(query, function (err) {
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
