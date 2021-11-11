var SubcategoryModel = require('../models/subCategoryModel.js');
var CategoryModel = require('../models/categoryModel.js');

/**
 * subCategoryController.js
 *
 * @description :: Server-side logic for managing subCategorys.
 */
module.exports = {

    /**
     * subCategoryController.list()
     */
    list: function (req, res) {
        let offset = parseInt(req.query.offset) || 0;
        let size = parseInt(req.query.limit);
        let filter = req.query.filter

        let from = (offset * size) || 0;
        let to = (from + size) || 10;
        SubcategoryModel.find(function (err, subCategories) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting subCategory.',
                    error: err
                });
            } else {
                if (filter) {
                    subCategories = subCategories.filter(el => {
                        let el2 = JSON.parse(JSON.stringify(el))
                        for(let key in el2) {
                            let test = el[key]?.toString().toLowerCase().includes(filter.toLowerCase())
                            if(test) {
                                return true;
                            }
                        }
                        return false;
                    })
                }
                let SubCategories = subCategories.slice(from, to);
                res.status(200).json({
                    total: subCategories.length,
                    SubCategories
                });
            }
        }).populate('category').sort({_id:-1});
    },

    listCategoryData: function (req, res) {
        var id = req.params.id;

        SubcategoryModel.find({category: id}, function (err, subCategory) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting subCategory.',
                    error: err
                });
            }

            
            let total = subCategory.length;
            return res.json({
                total: total,
                SubCategory: subCategory
            });
        });
    },

    /**
     * subCategoryController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        SubcategoryModel.findOne({_id: id}, function (err, subCategory) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting subCategory.',
                    error: err
                });
            }

            if (!subCategory) {
                return res.status(404).json({
                    message: 'No such subCategory'
                });
            }

            return res.json(subCategory);
        });
    },

    /**
     * subCategoryController.create()
     */
    create: function (req, res) {
        var subCategory = new SubcategoryModel({
			subCategoryName : req.body.subCategoryName,
			subCategoryDescription : req.body.subCategoryDescription,
            category: req.body.category,
            created_at : new Date(),
            updated_at: 'none'
        });

        subCategory.save(function (err, subCategory) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating subCategory',
                    error: err
                });
            }

            return res.status(201).json(subCategory);
        });
    },

    /**
     * subCategoryController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        SubcategoryModel.findOne({_id: id}, function (err, subCategory) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting subCategory',
                    error: err
                });
            }

            if (!subCategory) {
                return res.status(404).json({
                    message: 'No such subCategory'
                });
            }

            subCategory.subCategoryName = req.body.subCategoryName ? req.body.subCategoryName : subCategory.subCategoryName;
			subCategory.subCategoryDescription = req.body.subCategoryDescription ? req.body.subCategoryDescription : subCategory.subCategoryDescription;
			subCategory.category = req.body.category ? req.body.category : subCategory.category;
            subCategory.updated_at = new Date()
            subCategory.save(function (err, subCategory) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating subCategory.',
                        error: err
                    });
                }

                return res.json(subCategory);
            });
        });
    },

    /**
     * subCategoryController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        SubcategoryModel.findByIdAndRemove(id, function (err, subCategory) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the subCategory.',
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
        
        
        SubcategoryModel.deleteMany(query, function (err) {
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
