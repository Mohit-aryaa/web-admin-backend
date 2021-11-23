var AdminModel = require('../models/adminModel.js');
const md5 = require('md5');
/**
 * adminController.js
 *
 * @description :: Server-side logic for managing admins.
 */
module.exports = {

    /**
     * adminController.list()
     */
    list: function (req, res) {
        AdminModel.find(function (err, admins) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting admin.',
                    error: err
                });
            }

            return res.json(admins);
        });
    },

    /**
     * adminController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        AdminModel.findOne({_id: id}, function (err, admin) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting admin.',
                    error: err
                });
            }

            if (!admin) {
                return res.status(404).json({
                    message: 'No such admin'
                });
            }

            return res.json(admin);
        });
    },

    vendorSignIn: async function(req, res) {
        var email = req.body.email;
        var password = md5(req.body.password);
        //console.log(email, password)
        //const query = {'email' : email, 'password': password} 
        try {
            let user = await AdminModel.findOne({email: email});

            if(!user) {
                return res.status(404).json({
                    message: 'user does not exist'
                })
            }

            let result = user.verifyPassword(password);
            if(!result) {
                return res.status(404).json({
                    message: 'incorrect password'
                })
            }

            let token = await user.createToken();

            return res.status(200).json({
                message : 'Sign in successfully',
                accessToken: token
            })
        } catch (error) {
            return res.status(500).json({
                message: error
            })
        }
    },

    /**
     * adminController.create()
     */
    create: function (req, res) {
        var admin = new AdminModel({
			fullName : req.body.fullName,
			email : req.body.email,
			password : md5(req.body.password),
			company : req.body.company
        });

        AdminModel.countDocuments({email: req.body.email}, function(err, count) {
            if(count>1) {
                return res.status(500).json({
                    message: 'Vendor with email already exists'
                });
            } else { 
                admin.save(function (err, admin) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when Signing up',
                            error: err
                        });
                    }
        
                    return res.status(201).json({
                        message: 'Signup successfully'
                    });
                });
            }
        });

        
    },

    /**
     * adminController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        AdminModel.findOne({_id: id}, function (err, admin) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting admin',
                    error: err
                });
            }

            if (!admin) {
                return res.status(404).json({
                    message: 'No such admin'
                });
            }

            admin.fullName = req.body.fullName ? req.body.fullName : admin.fullName;
			admin.email = req.body.email ? req.body.email : admin.email;
			admin.password = req.body.password ? req.body.password : admin.password;
			admin.company = req.body.company ? req.body.company : admin.company;
			
            admin.save(function (err, admin) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating admin.',
                        error: err
                    });
                }

                return res.json(admin);
            });
        });
    },

    /**
     * adminController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        AdminModel.findByIdAndRemove(id, function (err, admin) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the admin.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
