var notificationModel = require('../models/notificationsModel.js');
const fs = require('fs');
const connection = require("../db");
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
        notificationModel.find(function (err, _notifications) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting category.',
                    error: err
                });
            } else {
                if (filter) {
                    notifications = notifications.filter(el => {
                        let el2 = JSON.parse(JSON.stringify(el))
                        for (let key in el2) {
                            let test = el[key]?.toString().toLowerCase().includes(filter.toLowerCase())
                            if (test) {
                                return true;
                            }
                        }
                        return false;
                    })
                }
                let notifications = notifications.slice(from, to);
                res.status(200).json({
                    total: notifications.length,
                    notifications
                });
            }
        }).sort({ _id: -1 });
    },



    show: function (req, res) {
        var id = req.params.id;

        notificationModel.findOne({ _id: id }, function (err, notifications) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting notifications.',
                    error: err
                });
            }

            if (!notifications) {
                return res.status(404).json({
                    message: 'No such notifications'
                });
            }

            return res.json(notifications);
        });
    },




    create: function (req, res) {
        var notifications = new notificationModel({
            notificationTitle: req.body.notificationTitle,
            notificationContent: req.body.notificationContent,
            image: req.body.image,
            created_at: new Date(),
            updated_at: 'none'
        });

        notifications.save(function (err, notifications) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating category',
                    error: err
                });
            }

            return res.status(201).json(notifications);
        });
    },


    upload: function (req, res) {
        if (req.file === undefined)
            return res.send("you must select a file.");
        //console.log(req.file)

        const imgUrl = `http://localhost:3000/notifications/file/${req.file.id}`;
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

    remove: function (req, res) {
        let getImage = '';
        var id = req.params.id;
        notificationModel.findOne({ _id: id }, function (err, category) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the category.',
                    error: err
                });
            }
            const getData = category.categoryBanner.split('/');
            const last = getData[getData.length - 1]
            getImage = last.toString();
        });
        notificationModel.findByIdAndRemove(id, async function (err, category) {
            gfs = await Grid(conn.db, mongoose.mongo);
            gfs.collection("uploads");
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the category.',
                    error: err
                });
            }
            else {
                try {
                    await gfs.remove({ _id: getImage, root: 'uploads' });
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
        var getNotification = [];
        const getId = req.body;
        const query = { _id: { $in: getId } };
        console.log(query)
        notificationModel.find(query, async function (err, notifications) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when fetcching the products.',
                    error: err
                });
            }
            getNotification = await notifications
        })

        notificationModel.deleteMany(query, async function (err) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the products.',
                    error: err
                });
            }
            if (getNotification == null) {
                console.log('Category has no banner');
            }
            else {
                gfs = await Grid(conn.db, mongoose.mongo);
                gfs.collection("uploads");
                try {
                    for (let index = 0; index < getNotification.length; index++) {
                        const getData = getNotification[index].categoryBanner.split('/');
                        const last = getData[getData.length - 1]
                        let getImage = last.toString();
                        console.log(getImage)
                        await gfs.remove({ _id: getImage, root: 'uploads' });
                    }

                } catch (error) {
                    console.log(error);
                    return res.status(500).json({ message: "An error occured" });
                }

            }

            return res.status(200).json({
                message: 'Category deleted successfully'
            });

        });
    }

};