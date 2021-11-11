var BundleproductModel = require('../models/bundleProductModel.js');
const fs = require('fs');
const { any } = require('../middleware/upload.js');
var StocklogsModel = require('../models/stockLogsModel.js');

/**
 * bundleProductController.js
 *
 * @description :: Server-side logic for managing bundleProducts.
 */
module.exports = {

    /**
     * bundleProductController.list()
     */
    list: function (req, res) {
        let offset = parseInt(req.query.offset) || 0;
        let size = parseInt(req.query.limit);
        let filter = req.query.filter
        let from = (offset * size) || 0;
        let to = (from + size) || 10;
        BundleproductModel.find(function (err, bundleProducts) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting bundleProduct.',
                    error: err
                });
            } else {
                if (filter) {
                    bundleProducts = bundleProducts.filter(el => {
                        let el2 = JSON.parse(JSON.stringify(el))
                        for(let key in el2) {
                            let checkBundleProducts = el[key]?.toString().toLowerCase().includes(filter.toLowerCase())
                            if(checkBundleProducts) {
                                return true;
                            }
                        }
                        return false;
                    })
                }
                let BundleProducts = bundleProducts.slice(from, to);
                res.status(200).json({
                    total: bundleProducts.length,
                    BundleProducts
                });
            }
        }).populate('productCategory').populate('productSubCategory').populate('productBrand').populate('vendor').populate('products').sort({_id:-1});
    },

    /**
     * bundleProductController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        BundleproductModel.findOne({_id: id}, function (err, bundleProduct) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting bundleProduct.',
                    error: err
                });
            }

            if (!bundleProduct) {
                return res.status(404).json({
                    message: 'No such bundleProduct'
                });
            }
            return res.json(bundleProduct);
        });
    },

    /**
     * bundleProductController.create()
     */
    create: function (req, res) {
        console.log(req.body.products)
        var bundleProduct = new BundleproductModel({
			productName : req.body.productName,
			products : req.body.products,
            productDescription: req.body.productDescription,
			productCategory : req.body.productCategory,
			productSubCategory : req.body.productSubCategory,
			productBrand : req.body.productBrand,
            vendor: req.body.vendor,
            price : req.body.price,
            stock : req.body.stock,
			productModel : req.body.productModel,
			productCode : req.body.productCode,
			productImages : req.body.productImages,
			tags : req.body.tags, 
            isBundle: true,
            todaysDeal : req.body.todaysDeal,
            publish : req.body.publish,
            featured : req.body.faetured,
            created_at : new Date(),
            updated_at: 'none'
        });

        BundleproductModel.countDocuments({productCode: req.body.productCode}, function(err, count) {
            if(count>0) {
                return res.status(500).json({
                    message: 'Product code already exist'
                });
            } else {
                bundleProduct.save(function (err, bundleProduct) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when creating bundleProduct',
                            error: err
                        });
                    } else {
                        var Stocklogs = new StocklogsModel({
                            productName: req.body.productName,
                            logType: 'Bundle proudcts created',
                            productType: 'bundle',
                            entryType: 'created',
                            productId: bundleProduct._id,
                            quantity:req.body.stock
                        })
                        Stocklogs.save(function (err, stockLogs) {
                            if (err) {
                                return res.status(500).json({
                                    message: 'Error when creating Stocklogs',
                                    error: err
                                });
                            }
                        })
                    }
    
                    return res.status(201).json({
                        message: 'Bundle product created successfully'
                    });
                });
            }
        });
       
    },

    store:  function (req, res) {
        //console.log('req', req.files)
        let path = '';
        if (req.files) {
            req.files.forEach(function(files,index, arr) {
                path = path + files.path + ',';
            })
            path = path.substring(0, path.lastIndexOf(",")) 
            //console.log(path)
            return res.json({
                imagePath: path.split(",")
            })
        } 
    },

    /**
     * bundleProductController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        BundleproductModel.findOne({_id: id}, function (err, bundleProduct) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting bundleProduct',
                    error: err
                });
            }

            if (!bundleProduct) {
                return res.status(404).json({
                    message: 'No such bundleProduct'
                });
            }   
            
            const getStock = bundleProduct.stock;

            bundleProduct.productName = req.body.productName ? req.body.productName : bundleProduct.productName;
			bundleProduct.products = req.body.products ? req.body.products : bundleProduct.products;
			bundleProduct.productDescription = req.body.productDescription ? req.body.productDescription : bundleProduct.productDescription;
			bundleProduct.productCategory = req.body.productCategory ? req.body.productCategory : bundleProduct.productCategory;
			bundleProduct.productSubCategory = req.body.productSubCategory ? req.body.productSubCategory : bundleProduct.productSubCategory;
			bundleProduct.productBrand = req.body.productBrand ? req.body.productBrand : bundleProduct.productBrand;
            bundleProduct.vendor = req.body.vendor ? req.body.vendor : bundleProduct.vendor;
			bundleProduct.stock = req.body.stock ? req.body.stock : bundleProduct.stock;
			bundleProduct.price = req.body.price ? req.body.price : bundleProduct.price;
			bundleProduct.productModel = req.body.productModel ? req.body.productModel : bundleProduct.productModel;
			bundleProduct.productCode = req.body.productCode ? req.body.productCode : bundleProduct.productCode;
			bundleProduct.productImages = req.body.productImages ? bundleProduct.productImages.concat(req.body.productImages) :  bundleProduct.productImages;
			bundleProduct.tags = req.body.tags ? req.body.tags : bundleProduct.tags;
            bundleProduct.isBundle = true;
            bundleProduct.todaysDeal = req.body.todaysDeal ? req.body.todaysDeal : bundleProduct.todaysDeal;
            bundleProduct.publish = req.body.publish ? req.body.publish : bundleProduct.publish;
            bundleProduct.featured = req.body.featured ? req.body.featured : bundleProduct.featured;
            bundleProduct.updated_at = new Date()

            console.log(bundleProduct.isBundle)
            if(req.body.stock > getStock) {
                entryType = 'Added'
            } else if (req.body.stock < getStock) {
                entryType = 'Subtracted'
            } 

            var Stocklogs = new StocklogsModel({
                productName: req.body.productName,
                logType: 'Bundle product updated',
                productType: 'bundle',
                entryType: 'Added',
                productId: req.params.id,
                quantity:req.body.stock
            })

			BundleproductModel.countDocuments({productCode: req.body.productCode}, function(err, count) {
                if(count>1) {
                    return res.status(500).json({
                        message: 'Product code already exist'
                    });
                } else {
                    bundleProduct.save(function (err, bundleProduct) {
                        if (err) {
                            return res.status(500).json({
                                message: 'Error when updating bundleProduct.',
                                error: err
                            });
                        } else {
                            if(req.body.stock < getStock || req.body.stock > getStock) {
                                Stocklogs.save(function (err, stockLogs) {
                                    if (err) {
                                        return res.status(500).json({
                                            message: 'Error when creating Stocklogs',
                                            error: err
                                        });
                                    }                               
                                })
                            }
                        }

                        return res.json({
                            message: 'Bundle products updated successfully'
                        });
                    });
                }
            })
        });
    },

    removeImage: function (req, res) {
        BundleproductModel.findOne({_id: req.body.id}, function(err, bundleProduct) {
            if(err) {
               return res.status(500).json({
                   message: 'Error when deleting the products.',
                   error: err
               });
            }
            if (!bundleProduct) {
               return res.status(404).json({
                   message: 'No such products'
               });
           } else {
               const ImagesArray = bundleProduct.productImages
               const productImageIndex= bundleProduct.productImages.indexOf(req.body.image)
               console.log(productImageIndex)
               ImagesArray.splice(productImageIndex, 1);
               fs.unlink(req.body.image, (err) => {
                   if (err) {
                       console.log("failed to delete local image:" + err);
                   } else {
                       console.log('successfully deleted local image');
                   }
               });
               bundleProduct.save(function(err, SavedBundleProducts) {
                   if(err) {
                      return res.status(500).json({
                          message: 'Error when deleting the products.',
                          error: err
                      });
                   }
                   return res.json({
                       message: 'success', 
                       images: SavedBundleProducts.productImages
                   })
               });
           }
        })
        
    },

    /**
     * bundleProductController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        BundleproductModel.findByIdAndRemove(id, function (err, bundleProduct) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the bundleProduct.',
                    error: err
                });
            } if (bundleProduct.productImage == null) {
                console.log('Product has no image')
            } else {
                fs.unlink(bundleProduct.productImage, (err) => {
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
        const query = { _id: { $in: getId } };
        console.log(query)
        BundleproductModel.find(query, function (err, bundleproducts) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when fetcching the products.',
                    error: err
                });
            }
            getbundleProduct = bundleproducts
        })

        BundleproductModel.deleteMany(query, function (err) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the products.',
                    error: err
                });
            }
            if(getbundleProduct.productImages = null) {
                console.log('product has no image');
            }
               for (let index = 0; index < getbundleProduct.length; index++) {
                   let getBundleProductsImages = getbundleProduct[index].productImages
                    for (let i = 0; i < getProductsImages.length; i++) {
                        fs.unlink(getBundleProductsImages[i], (err) => {
                            if (err) {
                                console.log("failed to delete local image:" + err);
                            } else {
                                console.log('successfully deleted local image');
                            }
                        });
                    }
                }
            

            return res.status(200).json({
                message: 'Bundle Products deleted successfully'
            });

        });
    }
};
