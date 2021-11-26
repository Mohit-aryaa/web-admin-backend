var CategoryModel = require('../models/categoryModel.js');
const fs = require('fs');
const connection = require("../db");
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
let gfs;
connection();
const conn = mongoose.connection;
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
			categoryBanner: req.body.categoryBanner,
            categoryDescription: req.body.categoryDescription,
            metaTitle: req.body.metaTitle,
            metaDescription: req.body.metaDescription,
            seoUrl: req.body.seoUrl,
            created_at : new Date(),
            updated_at: 'none'
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

        CategoryModel.findOne({_id: id}, async function (err, category) {
            gfs = await Grid(conn.db,  mongoose.mongo);
            gfs.collection("uploads");
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

            const getData = category.categoryBanner.split('/');
            const last = getData[getData.length - 1]
            const getCategoryBanner = last.toString();
            category.categoryName = req.body.categoryName ? req.body.categoryName : category.categoryName;
			category.categoryDescription = req.body.categoryDescription ? req.body.categoryDescription : category.categoryDescription;
			category.categoryBanner = req.body.categoryBanner ?  req.body.categoryBanner : category.categoryBanner;
            category.categoryDescription = req.body.categoryDescription ? req.body.categoryDescription : category.categoryDescription;
            category.metaTitle = req.body.metaTitle ? req.body.metaTitle : category.metaTitle;
            category.metaDescription = req.body.metaDescription ? req.body.metaDescription : category.metaDescription;
            category.seoUrl = req.body.seoUrl ? req.body.seoUrl : category.seoUrl;
            category.updated_at = new Date();
            category.save(async function (err, category) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating category.',
                        error: err
                    });
                } else {
                    if(req.body.categoryBanner !== undefined) {
                        try {
                            await gfs.remove({_id: getCategoryBanner, root: 'uploads'});
                        } catch (error) {
                            console.log(error);
                            res.send("An error occured.");
                        }
                    }
                }

                return res.json(category);
            });
        });
    },


    upload: function(req, res) {
        if (req.file === undefined) 
        return res.send("you must select a file.");
        //console.log(req.file)
        
        const imgUrl = `http://localhost:3000/categories/file/${req.file.id}`;
        return res.json({
            imagePath: imgUrl
        })
    },

    getFile: async function(req, res) {
        gfs = await Grid(conn.db,  mongoose.mongo);
        gfs.collection("uploads");
        try {
            //console.log('req.params.id', req.params.id)
            const file = await gfs.files.find(new mongoose.Types.ObjectId(req.params.id)).toArray();
            //console.log('file', file[0])
            const readStream = gfs.createReadStream(file[0].filename);
            readStream.pipe(res);
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message:"not found" , 
                error: error.message
            }) ;
        }
    },

    /**
     * categoryController.remove()
     */
    remove: function (req, res) {
        let getCategoryBanner = '';
        var id = req.params.id;
        CategoryModel.findOne({_id: id} ,function (err, category) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the category.',
                    error: err
                });
            }
            const getData = category.categoryBanner.split('/');
            const last = getData[getData.length - 1]
            getCategoryBanner = last.toString();
        });
        CategoryModel.findByIdAndRemove(id, async function (err, category) {
            gfs = await Grid(conn.db,  mongoose.mongo);
            gfs.collection("uploads");
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the category.',
                    error: err
                });
            }
            else {
                try {
                    await gfs.remove({_id: getCategoryBanner, root: 'uploads'});
                } catch (error) {
                    console.log(error);
                    res.send("An error occured.");
                }
            }
            return res.status(200).json({
                message: "Category deleted successfully"
            });

        });
    },

    bulkDelete: function (req, res) {
        var getCategory = [];
        const getId = req.body;
        const query = { _id: { $in: getId } };
        console.log(query)
        CategoryModel.find(query, async function (err, categories) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when fetcching the products.',
                    error: err
                });
            }
            getCategory = await categories
        })

        CategoryModel.deleteMany(query, async function (err) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the products.',
                    error: err
                });
            } 
            if(getCategory == null) {
                console.log('Category has no banner');
            } 
            else {
                gfs = await Grid(conn.db,  mongoose.mongo);
                gfs.collection("uploads");
                try {
                    for (let index = 0; index < getCategory.length; index++) {
                        const getData = getCategory[index].categoryBanner.split('/');
                        const last = getData[getData.length - 1]
                        let getCategoryBanner = last.toString();
                        console.log(getCategoryBanner)
                        await gfs.remove({_id: getCategoryBanner, root: 'uploads'});   
                     }
                    
                 } catch (error) {
                     console.log(error);
                     return res.status(500).json({message: "An error occured"});
                 }
               
            }
            
            return res.status(200).json({
                message: 'Category deleted successfully'
            });

        });
    }

};
