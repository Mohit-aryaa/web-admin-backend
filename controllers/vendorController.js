var VendorModel = require('../models/vendorModel.js');
var md5 = require('md5');
/**
 * vendorController.js
 *
 * @description :: Server-side logic for managing vendors.
 */
module.exports = {

    /**
     * vendorController.list()
     */
    list: function (req, res) {
        let offset = parseInt(req.query.offset) || 0;
        let size = parseInt(req.query.limit);
        let filter = req.query.filter

        let from = (offset * size) || 0;
        let to = (from + size) || 10;
        VendorModel.find(function (err, vendors) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting vendor.',
                    error: err
                });
            } else {
                if (filter) {
                    vendors = vendors.filter(el => {
                        let el2 = JSON.parse(JSON.stringify(el))
                        for(let key in el2) {
                            let checkVendor = el[key]?.toString().toLowerCase().includes(filter.toLowerCase())
                            if(checkVendor) {
                                return true;
                            }
                        }
                        return false;
                    })
                }
                let Vendors = vendors.slice(from, to);
                res.status(200).json({
                    total: Vendors.length,
                    Vendors
                });
            }
        }).sort({_id:-1});
    },

    /**
     * vendorController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        VendorModel.findOne({_id: id}, function (err, vendor) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting vendor.',
                    error: err
                });
            }

            if (!vendor) {
                return res.status(404).json({
                    message: 'No such vendor'
                });
            }

            return res.json(vendor);
        });
    },

    /**
     * vendorController.create()
     */
    create: function (req, res) {
        var vendor = new VendorModel({
			name : req.body.name,
            addressLine1:  req.body.addressLine1,
            addressLine2:  req.body.addressLine2,
            city:  req.body.city,
            state:  req.body.state,
            country:  req.body.country,
            zip:  req.body.zip,
            company:  req.body.company,
            bankAccountType:  req.body.bankAccountType,
            bankAccountName :  req.body.bankAccountName,
            bankAccountDetails:  req.body.bankAccountDetails,
            panNumber:  req.body.panNumber,
            gstNumber:  req.body.gstNumber,
            memberShip:  req.body.memberShip,
            email:  req.body.email,
            phone: req.body.phone,
            password: md5(req.body.password),
			active : req.body.active,
            created_at : new Date(),
            updated_at: 'none'
        });

        
        VendorModel.countDocuments({ email: req.body.email }, function (err, count) {
            if (count > 0) {
                return res.status(500).json({
                    message: 'Vendor with this email already exists'
                });
            } else {
                vendor.save(function (err, vendor) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when creating vendor',
                            error: err
                        });
                    }
        
                    return res.status(201).json({
                        message: 'Vendor Created Successfully',    
                        vendor
                    });
                });
            }
            
        });



       
    },

    /**
     * vendorController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        VendorModel.findOne({_id: id}, function (err, vendor) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting vendor',
                    error: err
                });
            }

            if (!vendor) {
                return res.status(404).json({
                    message: 'No such vendor'
                });
            }
            const password= md5(req.body.password);
            vendor.name = req.body.name ? req.body.name : vendor.name;
            vendor.addressLine1 =  req.body.addressLine1,
            vendor.addressLine2 = req.body.addressLine2,
            vendor.city =  req.body.city ? req.body.city : vendor.city;
            vendor.state =  req.body.state ?  req.body.state : vendor.state;
            vendor.country =  req.body.country ? req.body.country : vendor.country;
            vendor.zip = req.body.zip ? req.body.zip : vendor.zip;
            vendor.company =  req.body.company ? req.body.company : vendor.company;
            vendor.bankAccountType =  req.body.bankAccountType ? req.body.bankAccountType : vendor.bankAccountType;
            vendor.bankAccountName =  req.body.bankAccountName ?  req.body.bankAccountName : vendor.bankAccountName;
            vendor.bankAccountDetails =  req.body.bankAccountDetails ? req.body.bankAccountDetails : vendor.bankAccountDetails;
            vendor.panNumber =  req.body.panNumber ?  req.body.panNumber : vendor.panNumber;
            vendor.gstNumber =  req.body.gstNumber ? req.body.gstNumber : vendor.gstNumber;
            vendor.memberShip =  req.body.memberShip ? req.body.memberShip : vendor.memberShip;
            vendor.account =  req.body.account ? req.body.account : vendor.account;
            vendor.email =  req.body.email ? req.body.email :  vendor.email;
            vendor.phone = req.body.phone ? req.body.phone :  vendor.phone;
            vendor.password = password ? password : vendor.password;
			vendor.active = req.body.active ? req.body.active : vendor.active;
            vendor.updated_at = new Date();
			
            VendorModel.countDocuments({ email: req.body.email }, function (err, count) {
                if (count > 1) {
                    return res.status(500).json({
                        message: 'Vendor with this email already exists'
                    });
                } else {
                    vendor.save(function (err, vendor) {
                        if (err) {
                            return res.status(500).json({
                                message: 'Error when updating vendor.',
                                error: err
                            });
                        }

                        return res.json({
                            message: 'Vendor Updated Successfully',    
                            vendor
                        });
                    });
                }
            })
        });
    },

    /**
     * vendorController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        VendorModel.findByIdAndRemove(id, function (err, vendor) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the vendor.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    bulkDelete: function (req, res) {
        const getId = req.body
        const query = { _id: { $in: getId} };
        console.log(query)
        
        
        VendorModel.deleteMany(query, function (err) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the products.',
                    error: err
                });
            }
            
            return res.status(200).json({
                message: 'Vendors deleted successfully'
            });

        });
    }
};
