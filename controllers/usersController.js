var UsersModel = require('../models/usersModel.js');
var md5 = require('md5');
//const mongoOp = require("./mongo")
/**
 * usersController.js
 *
 * @description :: Server-side logic for managing userss.
 */
module.exports = {

    /**
     * usersController.list()
     */
    list: function (req, res, next) {
        let offset = parseInt(req.query.offset) || 0;
        let size = parseInt(req.query.limit);
        let filter = req.query.filter

        let from = (offset * size) || 0;
        let to = (from + size) || 10;

        let dbQuery = {};
        let dbCheck = '';
        if (filter) {
            //dbQuery['**'] = {$regex: filter, $options: "i" };
            // dbQuery = { $text : { $search : filter }};
        }
        // console.log(dbCheck)
        UsersModel.find(dbQuery, function (err, users) {
            if (err) {
                response = { "error": true, "message": "Error fetching data", errors: err };
                res.status(400).json(response);
            } else {
                if (filter) {
                    users = users.filter(el => {
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
                let Users = users.slice(from, to);
                res.status(200).json({
                    total: users.length,
                    Users
                });
            }
        }).sort({_id: -1});
    },

    /**
     * usersController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        UsersModel.findOne({ _id: id }, function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting users.',
                    error: err
                });
            }

            if (!users) {
                return res.status(404).json({
                    message: 'No such users'
                });
            }

            return res.json(users);
        });
    },

    /**
     * usersController.create()
     */
    create: function (req, res) {

        var users = new UsersModel({
            name: req.body.name,
            email: req.body.email,
            roleType: req.body.roleType
        });

        users.save(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating users',
                    error: err
                });
            }

            return res.status(201).json({
                msg: 'User added Successfully'
            });
        });
    },

    /**
     * usersController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        UsersModel.findOne({ _id: id }, function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting users',
                    error: err
                });
            }

            if (!users) {
                return res.status(404).json({
                    message: 'No such users'
                });
            }

            users.name = req.body.name ? req.body.name : users.name;
            users.email = req.body.email ? req.body.email : users.email;
            users.roleType = req.body.roleType ? req.body.roleType : users.roleType;

            users.save(function (err, users) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating users.',
                        error: err
                    });
                }

                return res.json(users);
            });
        });
    },

    /**
     * usersController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        UsersModel.findByIdAndRemove(id, function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the users.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
