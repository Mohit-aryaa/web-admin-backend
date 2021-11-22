var ConsultantModel = require('../models/consultantModel.js');
const connection = require("../db");
//const { any } = require('../middleware/upload.js');
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
let gfs;
connection();
const conn = mongoose.connection;
/**
 * consultantController.js
 *
 * @description :: Server-side logic for managing consultants.
 */
module.exports = {

    /**
     * consultantController.list()
     */
    list: function (req, res) {
        let offset = parseInt(req.query.offset) || 0;
        let size = parseInt(req.query.limit);
        let filter = req.query.filter

        let from = (offset * size) || 0;
        let to = (from + size) || 10;
        ConsultantModel.find(function (err, consultants) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting consultant.',
                    error: err
                });
            } else {
                if (filter) {
                    consultants = consultants.filter(el => {
                        let el2 = JSON.parse(JSON.stringify(el))
                        for(let key in el2) {
                            let checkConsultant = el[key]?.toString().toLowerCase().includes(filter.toLowerCase())
                            if(checkConsultant) {
                                return true;
                            }
                        }
                        return false;
                    })
                }
                let Consultants = consultants.slice(from, to);
                res.status(200).json({
                    total: consultants.length,
                    Consultants
                });
            }
        }).sort({_id:-1});
    },

    /**
     * consultantController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        ConsultantModel.findOne({_id: id}, function (err, consultant) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting consultant.',
                    error: err
                });
            }

            if (!consultant) {
                return res.status(404).json({
                    message: 'No such consultant'
                });
            }

            return res.json(consultant);
        });
    },

    /**
     * consultantController.create()
     */
    create: function (req, res) {
        var consultant = new ConsultantModel({
			logo : req.body.logo,
			displayName : req.body.displayName,
			name : req.body.name,
            email : req.body.email,
            phone : req.body.phone,
			company : req.body.company,
			address : req.body.address,
            bankAccountType: req.body.bankAccountType,
            bankAccountName : req.body.bankAccountName,
            bankAccountDetails: req.body.bankAccountDetails,
            panNumber: req.body.panNumber,
            gstNumber: req.body.gstNumber,
            memberShip: req.body.memberShip,
            status: req.body.status,
            created_at : new Date(),
            updated_at: 'none'
        });

        consultant.save(function (err, consultant) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating consultant',
                    error: err
                });
            }

            return res.status(201).json(consultant);
        });
    },

    /**
     * consultantController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        ConsultantModel.findOne({_id: id}, function (err, consultant) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting consultant',
                    error: err
                });
            }

            if (!consultant) {
                return res.status(404).json({
                    message: 'No such consultant'
                });
            }
            const getData = consultant.logo.split('/');
            const last = getData[getData.length - 1]
            const getConsultantlogo = last.toString();
            consultant.logo = req.body.logo ? req.body.logo : consultant.logo;
			consultant.displayName = req.body.displayName ? req.body.displayName : consultant.displayName;
			consultant.name = req.body.name ? req.body.name : consultant.name;
			consultant.email = req.body.email ? req.body.email : consultant.email;
			consultant.phone = req.body.phone ? req.body.phone : consultant.phone;
			consultant.company = req.body.company ? req.body.company : consultant.company;
			consultant.address = req.body.address ? req.body.address : consultant.address;
            consultant.bankAccountType = req.body.bankAccountType ? req.body.bankAccountType : consultant.bankAccountType;
            consultant.bankAccountName = req.body.bankAccountName ? consultant.bankAccountName : consultant.bankAccountName;
            consultant.bankAccountDetails = req.body.bankAccountDetails ?  req.body.bankAccountDetails : consultant.bankAccountDetails;
            consultant.panNumber = req.body.panNumber ?  req.body.panNumber : consultant.panNumber;
            consultant.gstNumber = req.body.gstNumber ? req.body.gstNumber : consultant.gstNumber;
            consultant.memberShip = req.body.memberShip ? req.body.memberShip : consultant.memberShip; 
            consultant.status = req.body.status ? req.body.status: consultant.status; 
			consultant.updated_at = new Date();
            consultant.save(async function (err, consultant) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating consultant.',
                        error: err
                    });
                } else {
                    if(req.body.logo !== undefined) {
                        try {
                            await gfs.remove({_id: getConsultantlogo, root: 'uploads'});
                        } catch (error) {
                            console.log(error);
                            res.send("An error occured.");
                        }
                    }
                }

                return res.json(consultant);
            });
        });
    },

    upload: function(req, res) {
        if (req.file === undefined) 
        return res.send("you must select a file.");
        const imgUrl = `http://localhost:3000/consultants/file/${req.file.id}`;
        return res.json({
            imagePath: imgUrl
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
     * consultantController.remove()
     */
    remove: function (req, res) {
        let getConsultantLogo = '';
        var id = req.params.id;
        ConsultantModel.findOne({_id: id} ,function (err, getConsultant) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the category.',
                    error: err
                });
            }
            const getData = getConsultant.Logo.split('/');
            const last = getData[getData.length - 1]
            getConsultantLogo = last.toString();
        });
        ConsultantModel.findByIdAndRemove(id, async function (err, consultant) {
            gfs = await Grid(conn.db,  mongoose.mongo);
            gfs.collection("uploads");
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the consultant.',
                    error: err
                });
            }
            else {
                try {
                    await gfs.remove({_id: getCategoryBanner, root: 'uploads'});
                } catch (error) {
                    console.log(error);
                    res.send("An error occured.");
                }
            }

            return res.status(200).json({
                message: "Consultant deleted successfully"
            });
        });
    },

    bulkDelete: function (req, res) {
        var getConsultant = [];
        const getId = req.body;
        const query = { _id: { $in: getId } };
        console.log(query)
        ConsultantModel.find(query, async function (err, consultant) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when fetcching the products.',
                    error: err
                });
            }
            getConsultant = await consultant
        })

        ConsultantModel.deleteMany(query, async function (err) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the products.',
                    error: err
                });
            } 
            if(getConsultant == null) {
                console.log('Consultant has no banner');
            } 
            else {
                gfs = await Grid(conn.db,  mongoose.mongo);
                gfs.collection("uploads");
                try {
                    for (let index = 0; index < getConsultant.length; index++) {
                        const getData = getConsultant[index].logo.split('/');
                        const last = getData[getData.length - 1]
                        let getConsultantLogo = last.toString();
                        console.log(getConsultantLogo)
                        await gfs.remove({_id: getConsultantLogo, root: 'uploads'});   
                     }
                    
                 } catch (error) {
                     console.log(error);
                     return res.status(500).json({message: "An error occured"});
                 }
               
            }
            
            return res.status(200).json({
                message: 'Consultants deleted successfully'
            });

        });
    }
};
