var SubchildcategoryModel = require('../models/subChildCategoryModel.js');
const fs = require('fs');
//const { any } = require('../middleware/upload.js');
const connection = require("../db");
//const { any } = require('../middleware/upload.js');
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
let gfs;
connection();
const conn = mongoose.connection;
/**
 * subChildCategoryController.js
 *
 * @description :: Server-side logic for managing subChildCategorys.
 */
module.exports = {

    /**
     * subChildCategoryController.list()
     */
    list: function (req, res) {
        let offset = parseInt(req.query.offset) || 0;
        let size = parseInt(req.query.limit);
        let filter = req.query.filter

        let from = (offset * size) || 0;
        let to = (from + size) || 10;
        SubchildcategoryModel.find(function (err, subChildCategories) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting subChildCategory.',
                    error: err
                });
            } else {
                    if (filter) {
                        subChildCategories = subChildCategories.filter(el => {
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
                    let SubChildCategories = subChildCategories.slice(from, to);
                    res.status(200).json({
                        total: subChildCategories.length,
                        SubChildCategories
                    });
                }
        }).populate('category').populate('subCategory').sort({_id:-1});
    },

    listDataBySubCategoryId: function (req, res) {
        var id = req.params.id;

        SubchildcategoryModel.find({subCategory: id}, function (err, subChildCategory) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting subCategory.',
                    error: err
                });
            }

            
            let total = subChildCategory.length;
            return res.json({
                total: total,
                SubChildCategory: subChildCategory
            });
        });
    },

    

    /**
     * subChildCategoryController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        SubchildcategoryModel.findOne({_id: id}, function (err, subChildCategory) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting subChildCategory.',
                    error: err
                });
            }

            if (!subChildCategory) {
                return res.status(404).json({
                    message: 'No such subChildCategory'
                });
            }

            return res.json(subChildCategory);
        });
    },

    /**
     * subChildCategoryController.create()
     */
    create: function (req, res) {
        var subChildCategory = new SubchildcategoryModel({
			subChildCategoryName : req.body.subChildCategoryName,
            category: req.body.category,
            subCategory:  req.body.subCategory,
            subChildCategoryBanner : req.body.subChildCategoryBanner,
            metaTitle: req.body.metaTitle,
            metaDescription:  req.body.metaDescription,
            seoUrl: req.body.metaDescription.seoUrl,
			subChildCategoryDescription : req.body.subChildCategoryDescription,
            created_at : new Date(),
            updated_at: 'none'
        });

        subChildCategory.save(function (err, subChildCategory) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating subChildCategory',
                    error: err
                });
            }

            return res.status(201).json(subChildCategory);
        });
    },

    /**
     * subChildCategoryController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        SubchildcategoryModel.findOne({_id: id}, async function (err, subChildCategory) {
            gfs = await Grid(conn.db,  mongoose.mongo);
            gfs.collection("uploads");
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting subChildCategory',
                    error: err
                });
            }

            if (!subChildCategory) {
                return res.status(404).json({
                    message: 'No such subChildCategory'
                });
            }

            const getData = subChildCategory.subChildCategoryBanner.split('/');
            const last = getData[getData.length - 1]
            const getSubChildCategoryBanner = last.toString();
            console.log(req.body.subChildCategoryBanner)
            subChildCategory.subChildCategoryName = req.body.subChildCategoryName ? req.body.subChildCategoryName : subChildCategory.subChildCategoryName;
			subChildCategory.category = req.body.category ? req.body.category : subChildCategory.category;
            subChildCategory.subCategory =  req.body.subCategory ? req.body.subCategory : subChildCategory.subCategory;
            subChildCategory.category = req.body.category ? req.body.category : subChildCategory.category;
            subChildCategory.subCategory =  req.body.subCategory ?  req.body.subCategory : subChildCategory.subCategory;
            subChildCategory.subChildCategoryBanner  = req.body.subChildCategoryBanner ? req.body.subChildCategoryBanner : subChildCategory.subChildCategoryBanner;
            subChildCategory.metaTitle = req.body.metaTitle ? req.body.metaTitle : subChildCategory.metaTitle;
            subChildCategory.metaDescription =  req.body.metaDescription ? req.body.metaDescription : subChildCategory.metaDescription;
            subChildCategory.seoUrl = req.body.seoUrl ? req.body.seoUrl: subChildCategory.seoUrl;
			subChildCategory.subChildCategoryDescription = req.body.subChildCategoryDescription ? req.body.subChildCategoryDescription : subChildCategory.subChildCategoryDescription;
            subChildCategory.updated_at = new Date()
            subChildCategory.save(async function (err, subChildCategory) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating subChildCategory.',
                        error: err
                    });
                } else {
                     if(req.body.SubchildcategoryBanner !== undefined) {
                        try {
                            await gfs.remove({_id: getSubChildCategoryBanner, root: 'uploads'})
                        } catch (error) {
                            console.log(error);
                            res.send("An error occured.");
                        }
                    }
                }

                return res.json(subChildCategory);
            });
        });
    },

    upload: function(req, res) {
        if (req.file === undefined) 
        return res.send("you must select a file.");
        //console.log(req.file)
        
        const imgUrl = `http://localhost:3000/subChildCategories/file/${req.file.id}`;
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
     * subChildCategoryController.remove()
     */
    remove: function (req, res) {
        let getSubChildCategoryBanner = '';
        var id = req.params.id;
        SubchildcategoryModel.findOne({_id: id} ,function (err, subCategory) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the brand.',
                    error: err
                });
            }
            const getData = SubchildcategoryModel.SubchildcategoryModelBanner.split('/');
            const last = getData[getData.length - 1]
            getSubChildCategoryBanner = last.toString();
        });

        SubchildcategoryModel.findByIdAndRemove(id, async function (err, subChildCategory) {
            gfs = await Grid(conn.db,  mongoose.mongo);
            gfs.collection("uploads");
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the subChildCategory.',
                    error: err
                });
            }  
            if(subChildCategory.subChildCategoryBanner == null) {
                console.log('sub Category has no banner');
            } 
            else {
                try {
                    await gfs.remove({_id: getSubChildCategoryBanner, root: 'uploads'});
                } catch (error) {
                    console.log(error);
                    res.send("An error occured.");
                }
            }

            return res.status(200).json({
                message: "Sub Child Category Deleted Successfully"
            });
        });
    },

    bulkDelete: function (req, res) {
        var getSubChildCategory = [];
        const getId = req.body;
        const query = { _id: { $in: getId } };
        console.log(query)
        SubchildcategoryModel.find(query, function (err, subChildCategories) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when fetcching the products.',
                    error: err
                });
            }
            getSubChildCategory = subChildCategories;
        })

        SubchildcategoryModel.deleteMany(query, async function (err) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the sub child Categories.',
                    error: err
                });
            } 
            if(getSubChildCategory == null) {
                console.log('Sub Child Category has no banner');
            } 
            else {
                gfs = await Grid(conn.db,  mongoose.mongo);
                gfs.collection("uploads");
                try {
                    for (let index = 0; index < getSubChildCategory.length; index++) {
                        const getData = getSubChildCategory[index].getSubChildCategoryBanner.split('/');
                        const last = getData[getData.length - 1]
                        let getSubChildCategoryBanner = last.toString();
                        console.log(getSubCategoryBanner)
                        await gfs.remove({_id: getSubChildCategoryBanner, root: 'uploads'});   
                     }
                    
                 } catch (error) {
                     console.log(error);
                     return res.status(500).json({message: "An error occured"});
                 }
               
            }
            
            return res.status(200).json({
                message: 'Sub child Categories deleted successfully'
            });

        });
    }
};
