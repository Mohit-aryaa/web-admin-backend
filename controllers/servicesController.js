const { json } = require('body-parser');
var ServicesModal = require('../models/servicesModel.js');
const fs = require('fs');
//var BundleProductsModel = require('../models/bundleProductModel.js');
var StocklogsModel = require('../models/stockLogsModel.js');
const connection = require("../db");
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
let gfs;
connection();
const conn = mongoose.connection;

module.exports = {


    /**
     * servicesController.create()
     */
    create: function (req, res) {
        var products = new ServicesModal({
            productTitle: req.body.productTitle,
            productImagepicture: req.body.productImagepicture,
            productImages: req.body.productImages,
            productDescription: req.body.productDescription,
            productCategory: req.body.productCategory,
            productConsultant: req.body.productConsultant,
            productBrand: req.body.productBrand,
            tags:  req.body.tags,
            salePrice: req.body.salePrice,
            servicesDiscount: req.body.servicesDiscount,
            purchasePrice: req.body.purchasePrice,
            shippingCost: req.body.shippingCost,
            testName: req.body.testName,
            seoKeyWords: req.body.seoKeyWords,
            metaTagKeywords: req.body.metaTagKeywords,
            metaTagDescription: req.body.metaTagDescription,
            metaTagTitle: req.body.metaTagTitle,
});

        ServicesModal.countDocuments({ productSku: req.body.productSku }, function (_err, count) {
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
                        Stocklogs.save(function (err, _stockLogs) {
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

    upload: function(req, res) {
        let path = '';
        let setpath = 'http://localhost:3000/services/'
        if (req.files === undefined) 
        return res.send("you must select a file.");

        req.files.forEach(function(files,_index, _arr) {
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

    setPublish: function(req, res) {
        const id = req.body.id;
        let setMessage = '';
        console.log('publish',req.body.publish)
        ServicesModal.findOne({ _id: id }, async function (err, setProducts) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting products',
                    error: err
                });
            }
            setProducts.publish = req.body.publish;
            await setProducts.save(function (err, savedProducts) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating products.',
                        error: err
                    });
                }
                console.log('afterResult', savedProducts.publish)
                if(savedProducts.publish == true) {
                    setMessage = 'product published'
                } else {
                    setMessage = 'Product Unpublished'
                }
                return res.status(200).json({
                    message: setMessage
                })
            });
        });
    },

    setTodaysDeal: function(req, res) {
        const id = req.body.id;
        let setMessage = '';
        console.log('todaysDeal',req.body.todaysDeal)
        ServicesModal.findOne({ _id: id }, async function (err, setProducts) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting products',
                    error: err
                });
            }
            setProducts.todaysDeal = req.body.todaysDeal;
            await setProducts.save(function (err, savedProducts) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating products.',
                        error: err
                    });
                }
                console.log('afterResult', savedProducts.todaysDeal)
                if(savedProducts.todaysDeal == true) {
                    setMessage = 'Added to Today\'s deal'
                } else {
                    setMessage = 'Removed from Today\'s deal'
                }
                return res.status(200).json({
                    message: setMessage
                })
            });
        });
    },

    setFeatured: function(req, res) {
        const id = req.body.id;
        let setMessage = '';
        console.log('feature',req.body.featured)
        ServicesModal.findOne({ _id: id }, async function (err, setService) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting products',
                    error: err
                });
            }
            setService.featured = req.body.featured;
            await setService.save(function (err, savedProducts) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating products.',
                        error: err
                    });
                }
                console.log('afterResult', savedProducts.publish)
                if(savedProducts.featured == true) {
                    setMessage = 'service featured'
                } else {
                    setMessage = 'service unFeatured'
                }
                return res.status(200).json({
                    message: setMessage
                })
            });
        });
    },

    /**
     * productsController.update()
     */
    // update: function (req, res) {
    //     var id = req.params.id;
    //     ServicesModal.findOne({ _id: id }, function (err, products) {
    //         if (err) {
    //             return res.status(500).json({
    //                 message: 'Error when getting products',
    //                 error: err
    //             });
    //         }
    //         if (!products) {
    //             return res.status(404).json({
    //                 message: 'No such products'
    //             });
    //         } 

            
    //         const getStock = products.stock;  
    //         console.log(req.body.productImages)
    //         products.productName = req.body.productName ? req.body.productName : products.productName;
    //         products.productImages = req.body.productImages ? products.productImages.concat(req.body.productImages) :  products.productImages;
    //         products.productDescription = req.body.productDescription ? req.body.productDescription : products.productDescription;
    //         products.productSku = req.body.productSku ? req.body.productSku : products.productSku;
    //         products.productModel = req.body.productModel ? req.body.productModel : products.productModel;
    //         products.productCategory = req.body.productCategory ? req.body.productCategory : products.productCategory;
    //         products.productSubCategory = req.body.productSubCategory ? req.body.productSubCategory : products.productSubCategory;
    //         products.productSubChildCategory = req.body.productSubChildCategory ? req.body.productSubChildCategory : products.productSubChildCategory
    //         products.productBrand = req.body.productBrand ? req.body.productBrand : products.productBrand;
    //         products.vendor = req.body.vendor ? req.body.vendor : products.vendor;
    //         products.unit = req.body.unit ?  req.body.unit : products.unit;
    //         products.dimensions = req.body.dimensions ? req.body.dimensions : products.dimensions;
    //         products.weight = req.body.weight ? req.body.weight : products.weight;
    //         products.tags = req.body.tags ? req.body.tags : products.tags;
    //         products.productCountry = req.body.productCountry ? req.body.productCountry : products.productCountry;
    //         products.manfactureDate = req.body.manfactureDate ? req.body.manfactureDate : products.manfactureDate;
    //         products.stock = req.body.stock ? req.body.stock : products.stock;
    //         products.isBundle = false;
    //         products.todaysDeal = req.body.todaysDeal ? req.body.todaysDeal : products.todaysDeal;
    //         products.publish = req.body.publish ? req.body.publish : products.publish;
    //         products.featured = req.body.featured ? req.body.featured : products.featured;
    //         products.price = req.body.price ? req.body.price : products.price;
    //         products.mrp = req.body.mrp ? req.body.mrp : products.mrp;
    //         products.purchasePrice  = req.body.purchasePrice ? req.body.purchasePrice : products.purchasePrice;
    //         products.shippingCost = req.body.shippingCost ? req.body.shippingCost : products.shippingCost;
    //         products.productTax = req.body.productTax ? req.body.productTax : products.productTax;
    //         products.productDiscount = req.body.productDiscount ? req.body.productDiscount : products.productDiscount;
    //         products.maxQuantity = req.body.maxQuantity ? req.body.maxQuantity : products.maxQuantity;
    //         products.minimumQuantity = req.body.minimumQuantity ? req.body.minimumQuantity : req.body.minimumQuantity;
    //         products.customersOptions = req.body.customersOptions ? req.body.customersOptions : products.customersOptions;
    //         products.seoKeyWords =  req.body.seoKeyWords ? req.body.seoKeyWords : products.seoKeyWords;
    //         products.metaTagKeywords = req.body.metaTagKeywords ? req.body.metaTagKeywords : products.metaTagKeywords;
    //         products.metaTagDescription = req.body.metaTagDescription ? req.body.metaTagDescription : products.metaTagDescription;
    //         products.metaTagTitle = req.body.metaTagTitle ? req.body.metaTagTitle : products.metaTagTitle ;
    //         products.imageAltTag = req.body.imageAltTag ? req.body.imageAltTag : products.imageAltTag;
    //         products.seoUrl  = req.body.seoUrl ? req.body.seoUrl : products.seoUrl;
    //         products.youtubeVideoId = req.body.youtubeVideoId ? req.body.youtubeVideoId : products.youtubeVideoId;
    //         products.question = req.body.question ? req.body.question : products.question;
    //         products.blogPost = req.body.blogPost ? req.body.blogPost : products.blogPost;
    //         products.similarProduct = req.body.similarProduct ? req.body.similarProduct : products.similarProduct;
    //         products.delivery =  req.body.delivery ? req.body.delivery : products.delivery;
    //         products.bulkDiscount = req.body.bulkDiscount ? req.body.bulkDiscount : products.bulkDiscount;
    //         products.cashBack = req.body.cashBack ? req.body.cashBack :  products.cashBack;
    //         products.variant = req.body.variant ? req.body.variant : products.variant;
    //         products.updated_at = new Date();

    //         let entryType = '';
    //         if(req.body.stock > getStock) {
    //             entryType = 'Added'
    //         } else if (req.body.stock < getStock) {
    //             entryType = 'Subtracted'
    //         } 

    //         console.log(entryType)

    //         var Stocklogs = new StocklogsModel({
    //             productName: req.body.productName,
    //             logType: 'product Updated',
    //             productType: 'normal',
    //             entryType: entryType,
    //             productId: req.params.id,
    //             quantity:req.body.stock
    //         })


    //         ServicesModal.countDocuments({ productSku: req.body.productSku }, function (err, count) {
    //             if (count > 1) {
    //                 return res.status(500).json({
    //                     message: 'Product code already exist'
    //                 });
    //             } else {
    //                 products.save(function (err, products) {
    //                     if (err) {
    //                         return res.status(500).json({
    //                             message: 'Error when updating products.',
    //                             error: err
    //                         });
    //                     } else {
    //                         if(req.body.stock < getStock || req.body.stock > getStock) {
    //                             Stocklogs.save(function (err, stockLogs) {
    //                                 if (err) {
    //                                     return res.status(500).json({
    //                                         message: 'Error when creating Stocklogs',
    //                                         error: err
    //                                     });
    //                                 }                               
    //                             })
    //                         }
    //                     }
    //                     return res.json({ 
    //                         message: 'Product Updated successfully', 
    //                         products 
    //                     });
    //                 });
    //             }
    //         })
    //     });
    // },

    // updateStock: function (req, res) {
    //     var id = req.params.id;

    //     ServicesModal.findOne({ _id: id }, function (err, products) {
    //         if (err) {
    //             return res.status(500).json({
    //                 message: 'Error when getting products',
    //                 error: err
    //             });
    //         } else {
    //             const getStock = products.stock;
    //             if(req.body.stock > getStock) {
    //                 entryType = 'Added'
    //             } else if (req.body.stock < getStock) {
    //                 entryType = 'Subtracted'
    //             }

    //             var Stocklogs = new StocklogsModel({
    //                 productName: req.body.productName,
    //                 logType: 'product stock updated',
    //                 productType: 'normal',
    //                 entryType: entryType,
    //                 productId: req.params.id,
    //                 quantity:req.body.stock
    //             })
    //             const stock = req.body.stock;
    //             const data = { stock: stock };
    //             console.log(stock)
    //             ServicesModal.findByIdAndUpdate(id, data, function (err, data) {
    //                 if (err) {
    //                     return res.status(500).json({
    //                         message: 'Error when updating stocks',
    //                         error: err
    //                     });
    //                 } else { 
    //                     if(req.body.stock < getStock || req.body.stock > getStock) {
    //                         Stocklogs.save(function (err, stockLogs) {
    //                             if (err) {
    //                                 return res.status(500).json({
    //                                     message: 'Error when creating Stocklogs',
    //                                     error: err
    //                                 });
    //                             }                               
    //                         })
    //                     }
    //                 }
    //                 return res.status(200).json({
    //                     message: 'Stocks updated successfully'
    //                 })
    //             });
    //         }
    //     }) 

    // },

    // updateBundleStock: function (req, res) {
    //     var id = req.params.id;

    //     BundleProductsModel.findOne({ _id: id }, function (err, products) {
    //         if (err) {
    //             return res.status(500).json({
    //                 message: 'Error when getting products',
    //                 error: err
    //             });
    //         } else {
    //             if(req.body.stock > products.stock) {
    //                 entryType = 'Added'
    //             } else if (req.body.stock < products.stock) {
    //                 entryType = 'Subtracted'
    //             } else  {
    //                 entryType = 'Equal'
    //             }

    //             var Stocklogs = new StocklogsModel({
    //                 productName: req.body.productName,
    //                 logType: 'Bundle Products stock updated',
    //                 productType: 'bundle',
    //                 entryType: entryType,
    //                 productId: req.params.id,
    //                 quantity:req.body.stock
    //             })
    //             const getStock = products.stock;
    //             const stock = req.body.stock;
    //             const data = { stock: stock };
    //             console.log('updateBundleStock',stock)
    //             BundleProductsModel.findByIdAndUpdate(id, data, function (err, data) {
    //                 if (err) {
    //                     return res.status(500).json({
    //                         message: 'Error when updating stocks',
    //                         error: err
    //                     });
    //                 } else {
    //                     if(req.body.stock < getStock || req.body.stock > getStock) {
    //                         Stocklogs.save(function (err, stockLogs) {
    //                             if (err) {
    //                                 return res.status(500).json({
    //                                     message: 'Error when creating Stocklogs',
    //                                     error: err
    //                                 });
    //                             }                               
    //                         })
    //                     }
    //                 }
    //                 return res.status(200).json({
    //                     message: 'Bundle Stocks updated successfully'
    //                 })
    //             });
    //         }
    //     })

    // },

    /**
     * productsController.remove()
     */

     removeImage: function (req, res) {
        ServicesModal.findOne({_id: req.body.id}, async function(err, product) {
            gfs = await Grid(conn.db,  mongoose.mongo);
            gfs.collection("uploads");
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

                //remove image from collection entry
                const ImagesArray = product.productImages
                const productImageIndex = product.productImages.indexOf(req.body.image)
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
        ServicesModal.findByIdAndRemove(id, async  function (err, products) {
            gfs = await Grid(conn.db,  mongoose.mongo);
            gfs.collection("uploads");
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the products.',
                    error: err
                });
            } 
            let getProductsImages = products.productImages;
            if (getProductsImages == null) {
                console.log('product has no images')
            }
            try {
                for (let index = 0; index < getProductsImages.length; index++) {
                    const getData = getProductsImages[index].split('/');
                    const last = getData[getData.length - 1]
                    let getProductImage = last.toString();
                    console.log(getProductImage)
                    await gfs.remove({_id: getProductImage, root: 'uploads'});   
                    }
                
            } catch (error) {
                console.log(error);
                return res.status(500).json({message: "An error occured"});
            }
               
            
            return res.status(200).json({
                message: 'product deleted successfully'
            });
        });
    },

    bulkPublish: function (req, res) {
        var getId = req.body;
        const query = { _id: { $in: getId } };
        const setQuery = {$set : { publish: true} };
        console.log(getId.length)
        ServicesModal.updateMany(query,setQuery , {
            multi: true
        }, function (err, _products) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when Unpublishing products',
                    error: err
                });
            }
            
        });
        
        return res.status(200).json({
            message: 'Products Published successfully'
        });
    },


    bulkUnpublish : function (req, res) {
        var getId = req.body;
        const query = { _id: { $in: getId } };
        const setQuery = {$set : { publish: false} };
        console.log(getId.length)
        ServicesModal.updateMany(query,setQuery , {
            multi: true
        }, function (err, _products) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when Unpublishing products',
                    error: err
                });
            }
            
        });
                
        
        return res.status(200).json({
            message: 'Products Unpublished successfully'
        });
    },
    bulkDelete: function (req, res) {
        var getProduct = [];
        const getId = req.body
        const query = { _id: { $in: getId } };
        console.log(query)
        ServicesModal.find(query, function (err, products) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when fetcching the products.',
                    error: err
                });
            }
            getProduct = products
        })

        ServicesModal.deleteMany(query, async function (err) {
            gfs = await Grid(conn.db,  mongoose.mongo);
            gfs.collection("uploads");
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the products.',
                    error: err
                });
            }

            try {
                for (let index = 0; index < getProduct.length; index++) {
                    let getProductsImages = getProduct[index].productImages
                    for (let i = 0; i < getProductsImages.length; i++) {
                        const getData = getProductsImages[index].split('/');
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
                message: 'Products deleted successfully'
            });

        });
    }
};
