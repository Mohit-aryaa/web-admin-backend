var SubcategoryModel = require('../models/subCategoryModel.js');
const fs = require('fs');
const connection = require("../db");
//const { any } = require('../middleware/upload.js');
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
let gfs;
connection();
const conn = mongoose.connection;

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

    listDataByCategoryId: function (req, res) {
        var id = req.params.id;

        SubcategoryModel.find({category: id}, function (err, subCategory) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting subCategory.',
                    error: err
                });
            }

            //console.log(subCategory)
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
            category: req.body.category,
            subCategoryBanner : req.body.subCategoryBanner,
            metaTitle: req.body.metaTitle,
            metaDescription:  req.body.metaDescription,
            seoUrl: req.body.seoUrl,
            subCategoryDescription: req.body.subCategoryDescription,
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

        SubcategoryModel.findOne({_id: id}, async function (err, subCategory) {
            gfs = await Grid(conn.db,  mongoose.mongo);
            gfs.collection("uploads");
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

            const getData = subCategory.subCategoryBanner.split('/');
            const last = getData[getData.length - 1]
            const getSubCategoryBanner = last.toString();
            subCategory.subCategoryName = req.body.subCategoryName ? req.body.subCategoryName : subCategory.subCategoryName;
			subCategory.category = req.body.category ? req.body.category : subCategory.category;
            subCategory.subCategoryBanner = req.body.subCategoryBanner ? req.body.subCategoryBanner : subCategory.subCategoryBanner;
            subCategory.metaTitle = req.body.metaTitle ? req.body.metaTitle : subCategory.metaTitle;
            subCategory.metaDescription =  req.body.metaDescription ? req.body.metaDescription : subCategory.metaDescription;
            subCategory.seoUrl = req.body.seoUrl ? req.body.seoUrl : subCategory.seoUrl;
            subCategory.subCategoryDescription = req.body.subCategoryDescription ? req.body.subCategoryDescription : subCategory.subCategoryDescription;
            subCategory.updated_at = new Date()
            subCategory.save(async function (err, subCategory) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating subCategory.',
                        error: err
                    });
                } else {
                     if(req.body.SubchildcategoryBanner !== undefined) {
                        try {
                            await gfs.remove({_id: getSubCategoryBanner, root: 'uploads'});;
                        } catch (error) {
                            console.log(error);
                            res.send("An error occured.");
                        }
                    }
                }

                return res.json(subCategory);
            });
        });
    },

    upload: function(req, res) {
        if (req.file === undefined) 
        return res.send("you must select a file.");
        //console.log(req.file)
        
        const imgUrl = `http://localhost:3000/subCategories/file/${req.file.id}`;
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
     * subCategoryController.remove()
     */
    remove: function (req, res) {
        let getSubCategoryBanner = '';
        var id = req.params.id;
        SubcategoryModel.findOne({_id: id} ,function (err, subCategory) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the brand.',
                    error: err
                });
            }
            const getData = subCategory.subCategoryBanner.split('/');
            const last = getData[getData.length - 1]
            getSubCategoryBanner = last.toString();
        });
        SubcategoryModel.findByIdAndRemove(id, async function (err, subCategory) {
            gfs = await Grid(conn.db,  mongoose.mongo);
            gfs.collection("uploads");
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the subCategory.',
                    error: err
                });
            }  
            if(subCategory.subCategoryBanner == null) {
                console.log('sub Category has no banner');
            } 
            else {
                try {
                    await gfs.remove({_id: getSubCategoryBanner, root: 'uploads'});
                } catch (error) {
                    console.log(error);
                    res.send("An error occured.");
                }
            }

            return res.status(200).json({
                message: "Subcategory deleted successfully"
            });
        });
    },

    bulkDelete: function (req, res) {
        var getSubCategory = [];
        const getId = req.body
        const query = { _id: { $in: getId } };
        console.log(query)
        SubcategoryModel.find(query, function (err, subCategories) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when fetcching the products.',
                    error: err
                });
            }
            getSubCategory = subCategories;
        })

        SubcategoryModel.deleteMany(query, async function (err) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the products.',
                    error: err
                });
            } 
            if(getSubCategory == null) {
                console.log('Sub Category has no banner');
            } 
            else {
                gfs = await Grid(conn.db,  mongoose.mongo);
                gfs.collection("uploads");
                try {
                    for (let index = 0; index < getSubCategory.length; index++) {
                        const getData = getSubCategory[index].subCategoryBanner.split('/');
                        const last = getData[getData.length - 1]
                        let getSubCategoryBanner = last.toString();
                        console.log(getSubCategoryBanner)
                        await gfs.remove({_id: getSubCategoryBanner, root: 'uploads'});;   
                     }
                    
                 } catch (error) {
                     console.log(error);
                     return res.status(500).json({message: "An error occured"});
                 }
               
            }
            
            return res.status(200).json({
                message: 'Sub Categories deleted successfully'
            });

        });
    }

};
