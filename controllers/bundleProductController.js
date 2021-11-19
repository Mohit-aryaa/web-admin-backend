var BundleproductModel = require('../models/bundleProductModel.js');
const fs = require('fs');
//const { any } = require('../middleware/upload.js');
var StocklogsModel = require('../models/stockLogsModel.js');
const connection = require("../db");
//const { any } = require('../middleware/upload.js');
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
let gfs;
connection();
const conn = mongoose.connection;
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
        }).populate('productCategory').populate('productSubCategory').populate('productSubChildCategory').populate('productBrand').populate('vendor').populate('products').sort({_id:-1});
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
            productSubChildCategory: req.body.productSubChildCategory,
			productBrand : req.body.productBrand,
            vendor: req.body.vendor,
            price : req.body.price,
            stock : req.body.stock,
			productModel : req.body.productModel,
			productSku : req.body.productSku,
			productImages : req.body.productImages,
			tags : req.body.tags, 
            productCountry: req.body.productCountry,
            manfactureDate: req.body.manfactureDate,
            isBundle: true,
            todaysDeal : req.body.todaysDeal,
            publish : req.body.publish,
            featured : req.body.faetured,
            mrp : req.body.mrp,
            purchasePrice: req.body.purchasePrice,
            shippingCost: req.body.shippingCost,
            productTax: req.body.productTax,
            productDiscount: req.body.productDiscount,
            maxQuantity: req.body.maxQuantity,
            minimumQuantity: req.body.minimumQuantity,
            customersOptions: req.body.customersOptions,
            seoKeyWords: req.body.seoKeyWords,
            metaTagKeywords: req.body.metaTagKeywords,
            metaTagDescription: req.body.metaTagDescription,
            metaTagTitle: req.body.metaTagTitle,
            imageAltTag: req.body.imageAltTag,
            seoUrl : req.body.seoUrl,
            youtubeVideoId : req.body.youtubeVideoId,
            question: req.body.question,
            blogPost: req.body.blogPost,
            similarProduct: req.body.similarProduct,
            delivery:  req.body.delivery,
            bulkDiscount : req.body.bulkDiscount,
            cashBack :req.body.cashBack,
            variant : req.body.variant,
            created_at : new Date(),
            updated_at: 'none'
        });

        BundleproductModel.countDocuments({productSku: req.body.productSku}, function(err, count) {
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

    upload: function(req, res) {
        let path = '';
        let setpath = 'http://localhost:3000/bundle-products/file/'
        if (req.files === undefined) 
        return res.send("you must select a file.");

        req.files.forEach(function(files,index, arr) {
            path = path + setpath+ files.id + ',';
        })
        path = path.substring(0, path.lastIndexOf(",")) 
        
        return res.json({
            imagePath: path.split(',')
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
			bundleProduct.productSubChildCategory = req.body.productSubChildCategory ? req.body.productSubChildCategory : bundleProduct.productSubChildCategory;
            bundleProduct.productBrand = req.body.productBrand ? req.body.productBrand : bundleProduct.productBrand;
            bundleProduct.vendor = req.body.vendor ? req.body.vendor : bundleProduct.vendor;
			bundleProduct.stock = req.body.stock ? req.body.stock : bundleProduct.stock;
			bundleProduct.price = req.body.price ? req.body.price : bundleProduct.price;
			bundleProduct.productModel = req.body.productModel ? req.body.productModel : bundleProduct.productModel;
			bundleProduct.productSku = req.body.productSku ? req.body.productSku : bundleProduct.productSku;
			bundleProduct.productImages = req.body.productImages ? bundleProduct.productImages.concat(req.body.productImages) :  bundleProduct.productImages;
			bundleProduct.tags = req.body.tags ? req.body.tags : bundleProduct.tags;
            bundleProduct.productCountry = req.body.productCountry ? req.body.productCountry : bundleProduct.productCountry; 
            bundleProduct.manfactureDate = req.body.manfactureDate ? req.body.manfactureDate : bundleProduct.manfactureDate;
            bundleProduct.isBundle = true;
            bundleProduct.todaysDeal = req.body.todaysDeal ? req.body.todaysDeal : bundleProduct.todaysDeal;
            bundleProduct.publish = req.body.publish ? req.body.publish : bundleProduct.publish;
            bundleProduct.featured = req.body.featured ? req.body.featured : bundleProduct.featured;
            bundleProduct.mrp = req.body.mrp ? req.body.mrp : bundleProduct.mrp;
            bundleProduct.purchasePrice  = req.body.purchasePrice ? req.body.purchasePrice : bundleProduct.purchasePrice;
            bundleProduct.shippingCost = req.body.shippingCost ? req.body.shippingCost : bundleProduct.shippingCost;
            bundleProduct.productTax = req.body.productTax ? req.body.productTax : bundleProduct.productTax;
            bundleProduct.productDiscount = req.body.productDiscount ? req.body.productDiscount : bundleProduct.productDiscount;
            bundleProduct.maxQuantity = req.body.maxQuantity ? req.body.maxQuantity : bundleProduct.maxQuantity;
            bundleProduct.minimumQuantity = req.body.minimumQuantity ? req.body.minimumQuantity : bundleProducty.minimumQuantity;
            bundleProduct.customersOptions = req.body.customersOptions ? req.body.customersOptions : bundleProduct.customersOptions;
            bundleProduct.seoKeyWords =  req.body.seoKeyWords ? req.body.seoKeyWords : bundleProduct.seoKeyWords;
            bundleProduct.metaTagKeywords = req.body.metaTagKeywords ? req.body.metaTagKeywords : bundleProduct.metaTagKeywords;
            bundleProduct.metaTagDescription = req.body.metaTagDescription ? req.body.metaTagDescription : bundleProduct.metaTagDescription;
            bundleProduct.metaTagTitle = req.body.metaTagTitle ? req.body.metaTagTitle : bundleProduct.metaTagTitle ;
            bundleProduct.imageAltTag = req.body.imageAltTag ? req.body.imageAltTag : bundleProduct.imageAltTag;
            bundleProduct.seoUrl  = req.body.seoUrl ? req.body.seoUrl : bundleProduct.seoUrl;
            bundleProduct.youtubeVideoId = req.body.youtubeVideoId ? req.body.youtubeVideoId : bundleProduct.youtubeVideoId;
            bundleProduct.question = req.body.question ? req.body.question : bundleProduct.question;
            bundleProduct.blogPost = req.body.blogPost ? req.body.blogPost : bundleProduct.blogPost;
            bundleProduct.similarProduct = req.body.similarProduct ? req.body.similarProduct : bundleProduct.similarProduct;
            bundleProduct.delivery =  req.body.delivery ? req.body.delivery : bundleProduct.delivery;
            bundleProduct.bulkDiscount = req.body.bulkDiscount ? req.body.bulkDiscount : bundleProduct.bulkDiscount;
            bundleProduct.cashBack = req.body.cashBack ? req.body.cashBack :  bundleProduct.cashBack;
            bundleProduct.variant = req.body.variant ? req.body.variant : bundleProduct.variant;
            bundleProduct.updated_at = new Date();

            console.log(bundleProduct.isBundle)
            let entryType = '';
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

			BundleproductModel.countDocuments({productSku: req.body.productSku}, function(err, count) {
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
        BundleproductModel.findOne({_id: req.body.id}, async function(err, bundleProduct) {
            gfs = await Grid(conn.db,  mongoose.mongo);
            gfs.collection("uploads");
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
               //remove image from collection entry
               const ImagesArray = bundleProduct.productImages
               const productImageIndex= bundleProduct.productImages.indexOf(req.body.image)
               console.log(productImageIndex)
               ImagesArray.splice(productImageIndex, 1);
               
               //remove image from grid storage
               const getData = req.body.image.split('/');
                const last = getData[getData.length - 1]
                let getImage = last.toString();
                console.log(getImage)
                try {
                    await gfs.remove({_id: getImage, root: 'uploads'});
                } catch (error) {
                    console.log(error);
                    return res.status(500).json({
                        message: "An error occured."
                    });
                }
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

        BundleproductModel.findByIdAndRemove(id, async function (err, bundleProduct) {
            gfs = await Grid(conn.db,  mongoose.mongo);
            gfs.collection("uploads");
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the bundleProduct.',
                    error: err
                });
            }
            let getBundleProductsImages = bundleProduct.productImages;
             if (bundleProduct.productImage == null) {
                console.log('Product has no image')
            } else {
                try {
                    for (let index = 0; index < getBundleProductsImages.length; index++) {
                        const getData = getBundleProductsImages[index].split('/');
                        const last = getData[getData.length - 1]
                        let getProductImage = last.toString();
                        console.log(getProductImage)
                        await gfs.remove({_id: getProductImage, root: 'uploads'});   
                        }
                    
                } catch (error) {
                    console.log(error);
                    return res.status(500).json({message: "An error occured"});
                }
            }

            return res.status(204).json();
        });
    },

    bulkDelete: function (req, res) {
        var getbundleProduct = any;
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

        BundleproductModel.deleteMany(query, async function (err) {
            gfs = await Grid(conn.db,  mongoose.mongo);
            gfs.collection("uploads");
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the products.',
                    error: err
                });
            }
            if(getbundleProduct.productImages = null) {
                console.log('product has no image');
            }
            try {
                for (let index = 0; index < getbundleProduct.length; index++) {
                    let getBundleProductsImages = getbundleProduct[index].productImages
                    for (let i = 0; i < getBundleProductsImages.length; i++) {
                        const getData = getBundleProductsImages[index].split('/');
                        const last = getData[getData.length - 1]
                        let getImage = last.toString();
                        console.log(getImage)
                        await gfs.remove({_id: getImage, root: 'uploads'});   
                    }
                 }
                
             } catch (error) {
                 console.log(error);
                 return res.status(500).json({message: "An error occured"});
             }
            

            return res.status(200).json({
                message: 'Bundle Products deleted successfully'
            });

        });
    }
};
