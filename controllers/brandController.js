var BrandModel = require('../models/brandModel.js');
const fs = require('fs');
const connection = require("../db");
//const { any } = require('../middleware/upload.js');
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
let gfs;
connection();
const conn = mongoose.connection;

/**
 * brandController.js
 *
 * @description :: Server-side logic for managing brands.
 */
module.exports = {

    /**
     * brandController.list()
     */
    list: function (req, res) {
        let offset = parseInt(req.query.offset) || 0;
        let size = parseInt(req.query.limit);
        let filter = req.query.filter

        let from = (offset * size) || 0;
        let to = (from + size) || 10;
        BrandModel.find(function (err, brands) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting brand.',
                    error: err
                });
            } else {
                if (filter) {
                    brands = brands.filter(el => {
                        let el2 = JSON.parse(JSON.stringify(el))
                        for (let key in el2) {
                            let setBrands = el[key]?.toString().toLowerCase().includes(filter.toLowerCase())
                            if (setBrands) {
                                return true;
                            }
                        }
                        return false;
                    })
                }
                let Brands = brands.slice(from, to);
                res.status(200).json({
                    total: brands.length,
                    Brands
                });
            }
        }).sort({ _id: -1 });
    },

    /**
     * brandController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        BrandModel.findOne({ _id: id }, function (err, brand) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting brand.',
                    error: err
                });
            }

            if (!brand) {
                return res.status(404).json({
                    message: 'No such brand'
                });
            }

            return res.json(brand);
        });
    },

    /**
     * brandController.create()
     */
    create: function (req, res) {
        var brand = new BrandModel({
            brandName: req.body.brandName,
            brandDescription: req.body.brandDescription,
            brandBanner: req.body.brandBanner,
            metaTitle: req.body.metaTitle,
            metaDescription: req.body.metaDescription,
            seoUrl: req.body.seoUrl,
            created_at: new Date(),
            updated_at: 'none'
        });

        brand.save(function (err, brand) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating brand',
                    error: err
                });
            }

            return res.status(201).json(brand);
        });
    },

    /**
     * brandController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        BrandModel.findOne({ _id: id }, async function (err, brand) {
            gfs = await Grid(conn.db, mongoose.mongo);
            gfs.collection("uploads");
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting brand',
                    error: err
                });
            }

            if (!brand) {
                return res.status(404).json({
                    message: 'No such brand'
                });
            }
            const getData = brand.brandBanner.split('/');
            const last = getData[getData.length - 1]
            const getBrandBanner = last.toString();
            brand.brandName = req.body.brandName ? req.body.brandName : brand.brandName;
            brand.brandDescription = req.body.brandDescription ? req.body.brandDescription : brand.brandDescription;
            brand.brandBanner = req.body.brandBanner ? req.body.brandBanner : brand.brandBanner;
            brand.metaTitle = req.body.metaTitle ? req.body.metaTitle : brand.metaTitle;
            brand.metaDescription = req.body.metaDescription ? req.body.metaDescription : brand.metaDescription;
            brand.seoUrl = req.body.seoUrl ? req.body.seoUrl : brand.seoUrl;
            brand.updated_at = new Date();
            brand.save(async function (err, brand) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating brand.',
                        error: err
                    });
                } else {
                    if (req.body.brandBanner !== undefined) {
                        try {
                            await gfs.remove({ _id: getBrandBanner, root: 'uploads' });
                        } catch (error) {
                            console.log(error);
                            res.send("An error occured.");
                        }
                    }
                }

                return res.json(brand);
            });
        });
    },

    // store:  function (req, res) {
    //     //console.log('req', req.files)
    //     if (req.file) {
    //         return res.json({
    //             imagePath: req.file.path
    //         })
    //     } 
    // },

    upload: function (req, res) {
        if (req.file === undefined)
            return res.send("you must select a file.");
        //console.log(req.file)

        const imgUrl = `http://localhost:3000/brands/file/${req.file.id}`;
        return res.json({
            imagePath: imgUrl
        })
    },

    getFile: async function (req, res) {
        gfs = await Grid(conn.db, mongoose.mongo);
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
                message: "not found",
                error: error.message
            });
        }
    },

    /**
     * brandController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        let getBrandBanner = '';
        BrandModel.findOne({ _id: id }, function (err, brand) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the brand.',
                    error: err
                });
            }
            const getData = brand.brandBanner.split('/');
            const last = getData[getData.length - 1]
            getBrandBanner = last.toString();
        });
        BrandModel.findByIdAndRemove(id, async function (err, brand) {
            gfs = await Grid(conn.db, mongoose.mongo);
            gfs.collection("uploads");
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the brand.',
                    error: err
                });
            }
            else {
                try {
                    await gfs.remove({ _id: getBrandBanner, root: 'uploads' });
                    //await gfs.files.deleteOne({_id: new mongoose.Types.ObjectId(getBrandBanner)});

                } catch (error) {
                    console.log(error);
                    res.send("An error occured.");
                }
            }
            return res.status(200).json({
                message: "Group deleted successfully"
            });
        });
    },

    bulkDelete: function (req, res) {
        var getBrands = [];
        const getId = req.body
        const query = { _id: { $in: getId } };
        console.log(query)
        BrandModel.find(query, async function (err, brands) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when fetcching the products.',
                    error: err
                });
            }
            getBrands = await brands
        })

        BrandModel.deleteMany(query, async function (err) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Brand.',
                    error: err
                });
            }
            if (getBrands == null) {
                console.log('Brand has no banner');
            }
            else {
                gfs = await Grid(conn.db, mongoose.mongo);
                gfs.collection("uploads");
                try {
                    for (let index = 0; index < getBrands.length; index++) {
                        const getData = getBrands[index].brandBanner.split('/');
                        const last = getData[getData.length - 1]
                        let getBrandBanner = last.toString();
                        console.log(getBrandBanner)
                        await gfs.remove({ _id: getBrandBanner, root: 'uploads' });
                        //await gfs.files.deleteOne({_id: new mongoose.Types.ObjectId(getBrandBanner)});
                    }

                } catch (error) {
                    console.log(error);
                    return res.status(500).json({ message: "An error occured" });
                }

            }

            return res.status(200).json({
                message: 'Groups deleted successfully'
            });

        });
    }
};
