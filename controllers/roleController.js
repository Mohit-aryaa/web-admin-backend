var RoleModel = require('../models/roleModel');

/**
 * roleController.js
 *
 * @description :: Server-side logic for managing roles.
 */
module.exports = {

    /**
     * roleController.list()
     */
    list: function (req, res) {
        let offset = parseInt(req.query.offset) || 0;
        let size = parseInt(req.query.limit);
        let filter = req.query.filter || '';

        let from = (offset * size) || 0;
        let to = (from + size) || 10;
        let dbQuery = {roleName: {'$regex': filter, $options: "i" }};
        RoleModel.find(dbQuery, function (err, roles) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting role.',
                    error: err
                });
            }  
          
                let Roles = roles.slice(from, to);
                res.status(200).json({
                    total: roles.length,
                    Roles
                });
        }).sort({_id:-1});
    },

    /**
     * roleController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        RoleModel.findOne({_id: id}, function (err, role) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting role.',
                    error: err
                });
            }

            if (!role) {
                return res.status(404).json({
                    message: 'No such role'
                });
            }

            return res.json(role);
        });
    },

    /**
     * roleController.create()
     */
    create: function (req, res) {
        var role = new RoleModel({
			roleName : req.body.roleName,
			permissions : req.body.permissions
        });

        console.log(role);
        role.save(function (err, role) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating role',
                    error: err
                });
            }

            return res.status(201).json({msg:"Role Added Successfully"});
        });
    },

    /**
     * roleController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        RoleModel.findOne({_id: id}, function (err, role) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting role',
                    error: err
                });
            }

            if (!role) {
                return res.status(404).json({
                    message: 'No such role'
                });
            }

            role.roleName = req.body.roleName ? req.body.roleName : role.roleName;
			role.permissions = req.body.permissions ? req.body.permissions : role.permissions;
			
            role.save(function (err, role) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating role.',
                        error: err
                    });
                }

                return res.json({
                    msg: "Role Updated Successfully"
                });
            });
        });
    },

    /**
     * roleController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        RoleModel.findByIdAndRemove(id, function (err, role) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the role.',
                    error: err
                });
            }

            return res.status(204).json({
                msg: "Role Deleted Successfully"
            });
        });
    }
};
