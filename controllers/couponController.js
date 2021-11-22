var CouponModel = require('../models/couponModel.js');

/**
 * couponController.js
 *
 * @description :: Server-side logic for managing coupons.
 */
module.exports = {

    /**
     * couponController.list()
     */
    list: function (req, res) {
        let offset = parseInt(req.query.offset) || 0;
        let size = parseInt(req.query.limit);
        let filter = req.query.filter

        let from = (offset * size) || 0;
        let to = (from + size) || 10;
        CouponModel.find(function (err, coupons) {
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
                            let checkCoupons = el[key]?.toString().toLowerCase().includes(filter.toLowerCase())
                            if(checkCoupons) {
                                return true;
                            }
                        }
                        return false;
                    })
                }
                let Coupons = coupons.slice(from, to);
                res.status(200).json({
                    total: coupons.length,
                    Coupons
                });
            }
        }).sort({_id:-1});
    },

    /**
     * couponController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        CouponModel.findOne({_id: id}, function (err, coupon) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting coupon.',
                    error: err
                });
            }

            if (!coupon) {
                return res.status(404).json({
                    message: 'No such coupon'
                });
            }

            return res.json(coupon);
        });
    },

    /**
     * couponController.create()
     */
    create: function (req, res) {
        var coupon = new CouponModel({
			title : req.body.title,
			validFrom : req.body.validFrom,
			validTill : req.body.validTill,
			discountOn : req.body.discountOn,
			discountOnField : req.body.discountOnField,
			couponCode : req.body.couponCode,
			discountType : req.body.discountType,
			discountValue : req.body.discountValue,
			customerGroup : req.body.customerGroup,
			deviceType : req.body.deviceType,
			paymentType : req.body.paymentType,
			cartAmount : req.body.cartAmount,
			maxDiscount : req.body.maxDiscount,
			usePerCoupon : req.body.usePerCoupon,
			couponDescription : req.body.couponDescription,
            publish: req.body.publish,
            created_at : new Date(),
            updated_at: 'none'
        });

        coupon.save(function (err, coupon) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating coupon',
                    error: err
                });
            }

            return res.status(201).json(coupon);
        });
    },

    /**
     * couponController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        CouponModel.findOne({_id: id}, function (err, coupon) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting coupon',
                    error: err
                });
            }

            if (!coupon) {
                return res.status(404).json({
                    message: 'No such coupon'
                });
            }

            coupon.title = req.body.title ? req.body.title : coupon.title;
			coupon.validFrom = req.body.validFrom ? req.body.validFrom : coupon.validFrom;
			coupon.validTill = req.body.validTill ? req.body.validTill : coupon.validTill;
			coupon.discountOn = req.body.discountOn ? req.body.discountOn : coupon.discountOn;
			coupon.discountOnField = req.body.discountOnField ? req.body.discountOnField : coupon.discountOnField;
			coupon.couponCode = req.body.couponCode ? req.body.couponCode : coupon.couponCode;
			coupon.discountType = req.body.discountType ? req.body.discountType : coupon.discountType;
			coupon.discountValue = req.body.discountValue ? req.body.discountValue : coupon.discountValue;
			coupon.customerGroup = req.body.customerGroup ? req.body.customerGroup : coupon.customerGroup;
			coupon.deviceType = req.body.deviceType ? req.body.deviceType : coupon.deviceType;
			coupon.paymentType = req.body.paymentType ? req.body.paymentType : coupon.paymentType;
			coupon.cartAmount = req.body.cartAmount ? req.body.cartAmount : coupon.cartAmount;
			coupon.maxDiscount = req.body.maxDiscount ? req.body.maxDiscount : coupon.maxDiscount;
			coupon.usePerCoupon = req.body.usePerCoupon ? req.body.usePerCoupon : coupon.usePerCoupon;
			coupon.couponDescription = req.body.couponDescription ? req.body.couponDescription : coupon.couponDescription;
            coupon.publish = req.body.publish ? req.body.publish : coupon.publish;
            coupon.updated_at = new Date();
            coupon.save(function (err, coupon) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating coupon.',
                        error: err
                    });
                }

                return res.json(coupon);
            });
        });
    },

    setPublish: function(req, res) {
        const id = req.body.id;
        let setMessage = '';
        console.log('publish',req.body.publish)
        CouponModel.findOne({ _id: id }, async function (err, coupons) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting products',
                    error: err
                });
            }
            coupons.publish = req.body.publish;
            await coupons.save(function (err, setCoupons) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating products.',
                        error: err
                    });
                }
                console.log('afterResult', setCoupons.publish)
                if(setCoupons.publish == true) {
                    setMessage = 'Coupon published'
                } else {
                    setMessage = 'Coupons Unpublished'
                }
                return res.status(200).json({
                    message: setMessage
                })
            });
        });
    },

    /**
     * couponController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        CouponModel.findByIdAndRemove(id, function (err, coupon) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the coupon.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    bulkPublish: function (req, res) {
        var getId = req.body;
        const query = { _id: { $in: getId } };
        const setQuery = {$set : { publish: true} };
        console.log(getId.length)
        CouponModel.updateMany(query,setQuery , {
            multi: true
        }, function (err, products) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when Unpublishing products',
                    error: err
                });
            }
            
        });
        
        return res.status(200).json({
            message: 'Coupons Published successfully'
        });
    },


    bulkUnpublish : function (req, res) {
        var getId = req.body;
        const query = { _id: { $in: getId } };
        const setQuery = {$set : { publish: false} };
        console.log(getId.length)
        CouponModel.updateMany(query,setQuery , {
            multi: true
        }, function (err, products) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when Unpublishing products',
                    error: err
                });
            }
            
        });
                
        
        return res.status(200).json({
            message: 'Coupons Unpublished successfully'
        });
    },

    bulkDelete: function (req, res) {
        var getProduct = [];
        const getId = req.body
        const query = { _id: { $in: getId } };
        console.log(query)
       

        CouponModel.deleteMany(query, async function (err) {
        
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the products.',
                    error: err
                });
            }

           
            return res.status(200).json({
                message: 'Coupons deleted successfully'
            });

        });
    }
};
