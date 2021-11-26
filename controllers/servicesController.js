const { json } = require('body-parser');
const ServicesModal = require('../models/servicesModel.js');
const fs = require('fs');
const connection = require("../db");
//const { any } = require('../middleware/upload.js');
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
let gfs;
connection();
const conn = mongoose.connection;

module.exports = {


    list: function (req, res) {
        let offset = parseInt(req.query.offset) || 0;
        let size = parseInt(req.query.limit);
        let filter = req.query.filter

        let from = (offset * size) || 0;
        let to = (from + size) || 10;
        ServicesModal.find(function (err, services) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting coupon.',
                    error: err
                });
            } else {
                if (filter) {
                    coupons = coupons.filter(el => {
                        let el2 = JSON.parse(JSON.stringify(el))
                        for(let key in el2) {
                            let checkServices = el[key]?.toString().toLowerCase().includes(filter.toLowerCase())
                            if(checkServices) {
                                return true;
                            }
                        }
                        return false;
                    })
                }
                let Services = services.slice(from, to);
                res.status(200).json({
                    total: services.length,
                    Services
                });
            }
        }).sort({_id:-1});
    },

    /**
     * couponController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        ServicesModal.findOne({_id: id}, function (err, service) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting coupon.',
                    error: err
                });
            }

            if (!service) {
                return res.status(404).json({
                    message: 'No such coupon'
                });
            }

            return res.json(service);
        });
    },
    /**
     * servicesController.create()
     */
    create: function (req, res) {
        var products = new ServicesModal({
            productTitle: req.body.productTitle,
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
        let setpath = 'http://localhost:3000/services/file/'
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
    update: function (req, res) {
        var id = req.params.id;
        ServicesModal.findOne({ _id: id }, function (err, services) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting products',
                    error: err
                });
            }
            if (!services) {
                return res.status(404).json({
                    message: 'No such products'
                });
            } 

             
            console.log(req.body.productImages)
            services.productTitle = req.body.productTitle ? req.body.productTitle : services.productTitle;
            services.productImages = req.body.productImages ? products.productImages.concat(req.body.productImages) :  products.productImages;
            services.productDescription = req.body.productDescription ? req.body.productDescription :  services.productDescription;
            services.productCategory = req.body.productCategory ?  req.body.productCategory : services.productCategory;
            services.productConsultant = req.body.productConsultant ? req.body.productConsultant : services.productConsultant;
            services.productBrand = req.body.productBrand ? req.body.productBrand : services.productBrand;
            services.tags =  req.body.tags ? req.body.tags : services.tags;
            services.salePrice = req.body.salePrice ? req.body.salePrice : services.salePrice;
            services.servicesDiscount = req.body.servicesDiscount ? req.body.servicesDiscount : services.servicesDiscount;
            services.purchasePrice = req.body.purchasePrice ? req.body.purchasePrice : services.purchasePrice;
            services.shippingCost = req.body.shippingCost ? req.body.shippingCost : services.shippingCost;
            services.testName = req.body.testName ? req.body.testName : services.testName;
            services.seoKeyWords = req.body.seoKeyWords ? req.body.seoKeyWords : services.seoKeyWords;
            services.metaTagKeywords = req.body.metaTagKeywords ? req.body.metaTagKeywords : services.metaTagKeywords;
            services.metaTagDescription = req.body.metaTagDescription ? req.body.metaTagDescription : services.metaTagDescription;
            services.metaTagTitle = req.body.metaTagTitle,services ? req.body.metaTagTitle : services.metaTagTitle;

            
            products.save(function (err, products) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating products.',
                        error: err
                    });
                }
                return res.json({ 
                    message: 'Product Updated successfully', 
                    products 
                });
            });
            
        });
    },

   

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
