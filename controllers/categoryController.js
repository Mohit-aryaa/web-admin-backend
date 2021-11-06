var CategoryModel = require('../models/categoryModel.js');

/**
 * categoryController.js
 *
 * @description :: Server-side logic for managing categorys.
 */
module.exports = {

    /**
     * categoryController.list()
     */
    list: function (req, res) {
        let offset = parseInt(req.query.offset) || 0;
        let size = parseInt(req.query.limit);
        let filter = req.query.filter

        let from = (offset * size) || 0;
        let to = (from + size) || 10;
        CategoryModel.find(function (err, categories) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting category.',
                    error: err
                });
            } else {
                if (filter) {
                    categories = categories.filter(el => {
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
                let Categories = categories.slice(from, to);
                res.status(200).json({
                    total: categories.length,
                    Categories
                });
            }
        }).sort({_id: -1 });
    },

    /**
     * categoryController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        CategoryModel.findOne({_id: id}, function (err, category) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting category.',
                    error: err
                });
            }

            if (!category) {
                return res.status(404).json({
                    message: 'No such category'
                });
            }

            return res.json(category);
        });
    },

    /**
     * categoryController.create()
     */
    create: function (req, res) {
        var category = new CategoryModel({
			categoryName : req.body.categoryName,
			categoryDescription : req.body.categoryDescription
        });

        category.save(function (err, category) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating category',
                    error: err
                });
            }

            return res.status(201).json(category);
        });
    },

    /**
     * categoryController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        CategoryModel.findOne({_id: id}, function (err, category) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting category',
                    error: err
                });
            }

            if (!category) {
                return res.status(404).json({
                    message: 'No such category'
                });
            }

            category.categoryName = req.body.categoryName ? req.body.categoryName : category.categoryName;
			category.categoryDescription = req.body.categoryDescription ? req.body.categoryDescription : category.categoryDescription;
			
            category.save(function (err, category) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating category.',
                        error: err
                    });
                }

                return res.json(category);
            });
        });
    },

    /**
     * categoryController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        CategoryModel.findByIdAndRemove(id, function (err, category) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the category.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
