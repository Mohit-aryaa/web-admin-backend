const { json } = require('body-parser');
var ProductsModel = require('../models/productsModel.js');
const fs = require('fs');
const productsModel = require('../models/productsModel.js');
const { any } = require('../middleware/upload.js');
/**
 * productsController.js
 *
 * @description :: Server-side logic for managing productss.
 */
module.exports = {

    /**
     * productsController.list()
     */
    list: function (req, res) {
        let offset = parseInt(req.query.offset) || 0;
        let size = parseInt(req.query.limit);
        let filter = req.query.filter

        let from = (offset * size) || 0;
        let to = (from + size) || 10;
        
        ProductsModel.find(function (err, products) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting products.',
                    error: err
                });
            } else {
                if (filter) {
                    products = products.filter(el => {
                        let el2 = JSON.parse(JSON.stringify(el))
                        for(let key in el2) {
                            let setProducts = el[key]?.toString().toLowerCase().includes(filter.toLowerCase())
                            if(setProducts) {
                                return true;
                            }
                        }
                        return false;
                    })
                }
                let Products = products.slice(from, to);
                res.status(200).json({
                    total: products.length,
                    Products
                });
            }

            
        }).populate('productCategory').populate('productBrand').sort({_id:-1});
    },

    /**
     * productsController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        ProductsModel.findOne({_id: id}, function (err, products) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting products.',
                    error: err
                });
            }

            if (!products) {
                return res.status(404).json({
                    message: 'No such products'
                });
            }

            return res.json(products);
        });
    },

    /**
     * productsController.create()
     */
    create: function (req, res) {
        var products = new ProductsModel({
			productName : req.body.productName,
            productDescription: req.body.productDescription,
			productImage : req.body.productImage,
            productCode: req.body.productCode,
            productModel: req.body.productModel,
			productCategory : req.body.productCategory,
			productBrand : req.body.productBrand,
            vendor: req.body.vendor,
            tags: req.body.tags,
            productCountry: req.body.productCountry,
            manfactureDate: req.body.manfactureDate,
			todaysDeal : req.body.todaysDeal,
			publish : req.body.publish,
			featured : req.body.featured,
			price : req.body.price
        });


         
        ProductsModel.countDocuments({productCode: req.body.productCode}, function(err, count) {
            if(count>0) {
                return res.status(500).json({
                    message: 'Product code already exist'
                });
            }
            else {
                products.save(function (err, products) {
           
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when creating products',
                            error: err
                        });
                    }          
        
                    return res.status(201).json({
                        message: 'Product Added Successfully',
                        products
                    });
                });
            }
        });
        
    },

    store: function (req, res) {
        //console.log(req)
        if(req) {  
            //console.log( req.file.path )
            return res.json({
                path: req.file.path 
            })
            
        }
    },

    /**
     * productsController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        ProductsModel.findOne({_id: id}, function (err, products) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting products',
                    error: err
                });
            }

            if (!products) {
                return res.status(404).json({
                    message: 'No such products'
                });
            } else {
                fs.unlink(products.productImage, (err) => {
                    if (err) {
                        console.log("failed to delete local image:"+err);
                    } else {
                        console.log('successfully deleted local image');                                
                    }
                });
            }


            products.productName = req.body.productName ? req.body.productName : products.productName;
			products.productImage = req.body.productImage ? req.body.productImage : products.productImage;
            products.productDescription = req.body.productDescription ? req.body.productDescription : products.productDescription;
            products.productCode = req.body.productCode ? req.body.productCode : products.productCode;
            products.productModel = req.body.productModel ? req.body.productModel : products.productModel;
            products.productCategory = req.body.productCategory ? req.body.productCategory : products.productCategory;
			products.productBrand = req.body.productBrand ? req.body.productBrand : products.productBrand;
            products.vendor = req.body.vendor ? req.body.vendor : products.vendor;
            products.tags = req.body.tags ? req.body.tags : products.tags;
            products.productCountry = req.body.productCountry ? req.body.productCountry : products.productCountry;
            products.manfactureDate = req.body.manfactureDate ? req.body.manfactureDate : products.manfactureDate;
			products.todaysDeal = req.body.todaysDeal ? req.body.todaysDeal : products.todaysDeal;
			products.publish = req.body.publish ? req.body.publish : products.publish;
			products.featured = req.body.featured ? req.body.featured : products.featured;
			products.price = req.body.price ? req.body.price : products.price;

           
            ProductsModel.countDocuments({productCode: req.body.productCode}, function(err, count) {
                if(count>1) {
                    return res.status(500).json({
                        message: 'Product code already exist'
                    });
                } else {
                    products.save(function (err, products) {
                        if (err) {
                            return res.status(500).json({
                                message: 'Error when updating products.',
                                error: err
                            });
                        } 
        
                        return res.json({message:'Product Updated successfully',products});
                    });
                }
            })
			
        });
    },

    /**
     * productsController.remove()
     */
   

    remove: function (req, res) {
        var id = req.params.id;
        ProductsModel.findByIdAndRemove(id, function (err, products) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the products.',
                    error: err
                });
            } else {
                fs.unlink(products.productImage, (err) => {
                    if (err) {
                        console.log("failed to delete local image:"+err);
                    } else {
                        console.log('successfully deleted local image');                                
                    }
                });
            }

            return res.status(204).json();
        });
    },

    bulkDelete: function (req, res) {
        var getProduct = any;
        const getId = req.body
        const query = { _id: { $in: getId} };
        console.log(query)
        productsModel.find(query, function(err, products) {
            if(err) {
                return res.status(500).json({
                    message: 'Error when fetcching the products.',
                    error: err
                });
            }
            getProduct = products
        })
        
        ProductsModel.deleteMany(query, function (err) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the products.',
                    error: err
                });
            } else {
                for (let index = 0; index < getProduct.length; index++) {
                    fs.unlink(getProduct[index].productImage, (err) => {
                        if (err) {
                            console.log("failed to delete local image:"+err);
                        } else {
                            console.log('successfully deleted local image');                                
                        }
                    });
                }
            }
            
            return res.status(200).json({
                message: 'Products deleted successfully'
            });

        });
    }
};
