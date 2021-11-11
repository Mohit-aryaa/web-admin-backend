const { json } = require('body-parser');
var ProductsModel = require('../models/productsModel.js');
const fs = require('fs');
const { any } = require('../middleware/upload.js');
var BundleProductsModel = require('../models/bundleProductModel.js');
var StocklogsModel = require('../models/stockLogsModel.js');
var entryType = '';
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
                        for (let key in el2) {
                            let setProducts = el[key]?.toString().toLowerCase().includes(filter.toLowerCase())
                            if (setProducts) {
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
        }).populate('productCategory').populate('productSubCategory').populate('productBrand').populate('vendor').sort({ _id: -1 });
    },


    listStock: async function (req, res) {
        try {
            let offset = parseInt(req.query.offset) || 0;
            let size = parseInt(req.query.limit);
            let filter = req.query.filter
            let from = (offset * size) || 0;
            let to = (from + size) || 10;
            let getJoindata = [];
            let query = { 'stock': 0 }
            let stocks = await ProductsModel.find(query).lean();
            let bundleStocks = await BundleProductsModel.find(query).lean()
            // stocks.forEach(el => { el.isBundle = false })
            // bundleStocks.forEach(el => { el.isBundle = true })
            getJoindata = [...stocks, ...bundleStocks].sort((a, b) => {
                return a._id < b._id ? 1 : -1;
            });
            if (filter) {
                getJoindata = getJoindata.filter(el => {
                    let el2 = JSON.parse(JSON.stringify(el))
                    for(let key in el2) {
                        let checkJoinData = el[key]?.toString().toLowerCase().includes(filter.toLowerCase())
                        if(checkJoinData) {
                            return true;
                        }
                    }
                    return false;
                })
            }
            let data = getJoindata.slice(from, to);
            res.status(200).json({
                total: getJoindata.length,
                Stocks: data
            });
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                message: 'Error when getting stocks.',
                error: err.message
            });
        }
    },

    /**
     * productsController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        ProductsModel.findOne({ _id: id }, function (err, products) {
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
            productName: req.body.productName,
            productDescription: req.body.productDescription,
            productImages: req.body.productImages,
            productCode: req.body.productCode,
            productModel: req.body.productModel,
            productCategory: req.body.productCategory,
			productSubCategory : req.body.productSubCategory,
            productBrand: req.body.productBrand,
            vendor: req.body.vendor,
            tags: req.body.tags,
            productCountry: req.body.productCountry,
            manfactureDate: req.body.manfactureDate,
            stock: req.body.stock,
            isBundle: false,
            todaysDeal: req.body.todaysDeal,
            publish: req.body.publish,
            featured: req.body.featured,
            price: req.body.price,
            created_at : new Date(),
            updated_at: 'none'
        });

        ProductsModel.countDocuments({ productCode: req.body.productCode }, function (err, count) {
            if (count > 0) {
                return res.status(500).json({
                    message: 'Product code already exist'
                });
            }
            else {
                products.save(function (err, products) {

                    if (err) {
                        return res.status(500).json({
                            message: 'Error when creating products',
                            error: err.message
                        });
                    } else {
                        var Stocklogs = new StocklogsModel({
                            productName: req.body.productName,
                            logType: 'product Created',
                            productType: 'normal',
                            entryType: 'created',
                            productId: products._id,
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
                        message: 'Product Added Successfully',
                        products
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
     * productsController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        ProductsModel.findOne({ _id: id }, function (err, products) {
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
            } 

            const getStock = products.stock;  
            console.log(req.body.productImages)
            products.productName = req.body.productName ? req.body.productName : products.productName;
            products.productImages = req.body.productImages ? products.productImages.concat(req.body.productImages) :  products.productImages;
            products.productDescription = req.body.productDescription ? req.body.productDescription : products.productDescription;
            products.productCode = req.body.productCode ? req.body.productCode : products.productCode;
            products.productModel = req.body.productModel ? req.body.productModel : products.productModel;
            products.productCategory = req.body.productCategory ? req.body.productCategory : products.productCategory;
            products.productSubCategory = req.body.productSubCategory ? req.body.productSubCategory : products.productSubCategory;
            products.productBrand = req.body.productBrand ? req.body.productBrand : products.productBrand;
            products.vendor = req.body.vendor ? req.body.vendor : products.vendor;
            products.tags = req.body.tags ? req.body.tags : products.tags;
            products.productCountry = req.body.productCountry ? req.body.productCountry : products.productCountry;
            products.manfactureDate = req.body.manfactureDate ? req.body.manfactureDate : products.manfactureDate;
            products.stock = req.body.stock ? req.body.stock : products.stock;
            products.isBundle = false;
            products.todaysDeal = req.body.todaysDeal ? req.body.todaysDeal : products.todaysDeal;
            products.publish = req.body.publish ? req.body.publish : products.publish;
            products.featured = req.body.featured ? req.body.featured : products.featured;
            products.price = req.body.price ? req.body.price : products.price;
            products.updated_at = new Date();

            if(req.body.stock > getStock) {
                entryType = 'Added'
            } else if (req.body.stock < getStock) {
                entryType = 'Subtracted'
            } 

            var Stocklogs = new StocklogsModel({
                productName: req.body.productName,
                logType: 'product Updated',
                productType: 'normal',
                entryType: entryType,
                productId: req.params.id,
                quantity:req.body.stock
            })


            ProductsModel.countDocuments({ productCode: req.body.productCode }, function (err, count) {
                if (count > 1) {
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
                            message: 'Product Updated successfully', 
                            products 
                        });
                    });
                }
            })
        });
    },

    updateStock: function (req, res) {
        var id = req.params.id;

        ProductsModel.findOne({ _id: id }, function (err, products) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting products',
                    error: err
                });
            } else {
                const getStock = products.stock;
                if(req.body.stock > getStock) {
                    entryType = 'Added'
                } else if (req.body.stock < getStock) {
                    entryType = 'Subtracted'
                }

                var Stocklogs = new StocklogsModel({
                    productName: req.body.productName,
                    logType: 'product stock updated',
                    productType: 'normal',
                    entryType: entryType,
                    productId: req.params.id,
                    quantity:req.body.stock
                })
                const stock = req.body.stock;
                const data = { stock: stock };
                console.log(stock)
                ProductsModel.findByIdAndUpdate(id, data, function (err, data) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when updating stocks',
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
                    return res.status(200).json({
                        message: 'Stocks updated successfully'
                    })
                });
            }
        }) 

    },

    updateBundleStock: function (req, res) {
        var id = req.params.id;

        BundleProductsModel.findOne({ _id: id }, function (err, products) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting products',
                    error: err
                });
            } else {
                if(req.body.stock > products.stock) {
                    entryType = 'Added'
                } else if (req.body.stock < products.stock) {
                    entryType = 'Subtracted'
                } else  {
                    entryType = 'Equal'
                }

                var Stocklogs = new StocklogsModel({
                    productName: req.body.productName,
                    logType: 'Bundle Products stock updated',
                    productType: 'bundle',
                    entryType: entryType,
                    productId: req.params.id,
                    quantity:req.body.stock
                })
                const getStock = products.stock;
                const stock = req.body.stock;
                const data = { stock: stock };
                console.log('updateBundleStock',stock)
                BundleProductsModel.findByIdAndUpdate(id, data, function (err, data) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when updating stocks',
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
                    return res.status(200).json({
                        message: 'Bundle Stocks updated successfully'
                    })
                });
            }
        })

    },

    /**
     * productsController.remove()
     */

     removeImage: function (req, res) {
         ProductsModel.findOne({_id: req.body.id}, function(err, product) {
             if(err) {
                return res.status(500).json({
                    message: 'Error when deleting the products.',
                    error: err
                });
             }
             if (!product) {
                return res.status(404).json({
                    message: 'No such products'
                });
            } else {
                const ImagesArray = product.productImages
                const productImageIndex= product.productImages.indexOf(req.body.image)
                console.log(productImageIndex)
                ImagesArray.splice(productImageIndex, 1);
                fs.unlink(req.body.image, (err) => {
                    if (err) {
                        console.log("failed to delete local image:" + err);
                    } else {
                        console.log('successfully deleted local image');
                    }
                });
                product.save(function(err, SavedProducts) {
                    if(err) {
                       return res.status(500).json({
                           message: 'Error when deleting the products.',
                           error: err
                       });
                    }
                    return res.json({
                        message: 'success', 
                        images: SavedProducts.productImages
                    })
                });
            }
         })
         
     },


    remove:  function (req, res) {
        const id = req.params.id;
        //console.log(id)
        ProductsModel.findByIdAndRemove(id, function (err, products) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the products.',
                    error: err
                });
            } 
            let getProductsImages = products.productImages;
            if (getProductsImages == null) {
                console.log('product has no images')
            } else {
                for (let index = 0; index < getProductsImages.length; index++) {
                    fs.unlink(getProductsImages[index], (err) => {
                        if (err) {
                            console.log("failed to delete local image:" + err);
                        } else {
                            console.log('successfully deleted local image');
                        }
                    });
                }
            }
            
            return res.status(200).json({
                message: 'product deleted successfully'
            });
        });
    },

    bulkDelete: function (req, res) {
        var getProduct = any;
        const getId = req.body
        const query = { _id: { $in: getId } };
        console.log(query)
        ProductsModel.find(query, function (err, products) {
            if (err) {
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
            }
               for (let index = 0; index < getProduct.length; index++) {
                   let getProductsImages = getProduct[index].productImages
                    for (let i = 0; i < getProductsImages.length; i++) {
                        fs.unlink(getProductsImages[i], (err) => {
                            if (err) {
                                console.log("failed to delete local image:" + err);
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
