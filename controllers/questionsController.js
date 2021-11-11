var QuestionsModel = require('../models/questionsModel.js');
var ProductsModel = require('../models/productsModel.js');
var BundleProductsModel = require('../models/bundleProductModel.js');
const { any } = require('../middleware/upload.js');
var BrandModel = require('../models/brandModel.js');
var setProduct = {};
/**
 * questionsController.js
 *
 * @description :: Server-side logic for managing questionss.
 */
module.exports = {

    /**
     * questionsController.list()
     */
    list: async function (req, res) {
        let offset = parseInt(req.query.offset) || 0;
        let size = parseInt(req.query.limit);
        let filter = req.query.filter
        let from = (offset * size) || 0;
        let to = (from + size) || 10;
        await QuestionsModel.find(async function (err, questions) { 
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting questions.',
                    error: err
                });
            } else {
                for (let index = 0; index < questions.length; index++) {
                    let getBrandId = questions[index].product.productBrand;
                    console.log(getBrandId)
                    try {
                        let brands =  await BrandModel.findById(getBrandId).lean()
                        console.log(brands.brandName)
                        questions[index].product.productBrandName = brands.brandName;
                    } catch (error) {
                        console.log('err', error)
                    }
                }

            // questions.map( asnyc, function(element) {
            //     let getBrandId = element.product.productBrand;
            //     console.log(getBrandId)
            //     let brands =  await BrandModel.findById(getBrandId).lean()
            //     console.log(brands.brandName)
            //     element.product.productBrandName = brands.brandName;
            //     })
                
                //console.log(questions)
                if (filter) {
                    questions = questions.filter(el => {
                        let el2 = JSON.parse(JSON.stringify(el))
                        for(let key in el2) {
                            let checkQuestions = el[key]?.toString().toLowerCase().includes(filter.toLowerCase())
                            if(checkQuestions) {
                                return true;
                            }
                        }
                        return false;
                    })
                }
                let Questions = questions.slice(from, to);
                res.status(200).json({
                    total: questions.length,
                    Questions
                });
            }
        }).clone().populate().sort({_id: -1});
    },
    

    /**
     * questionsController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        QuestionsModel.findOne({_id: id}, function (err, questions) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting questions.',
                    error: err
                });
            }

            if (!questions) {
                return res.status(404).json({
                    message: 'No such questions'
                });
            }

            return res.json(questions);
        });
    },

    /**
     * questionsController.create()
     */
    create: async function (req, res) {
      let getId = req.body.product;
      let query = {_id: getId};
      try {
        const getProductData = await ProductsModel.findOne(query).lean();
        setProduct = getProductData || await BundleProductsModel.findOne(query).lean();
      } catch (error) {
          console.log(error)
      }

        var questions = new QuestionsModel({
			question : req.body.question,
			product : setProduct,
			answer : req.body.answer,
            created_at : new Date(),
            updated_at: 'none'
        });
        questions.save(function (err, questions) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating questions',
                    error: err
                });
            }

            return res.status(201).json(questions);
        });
    },

    /**
     * questionsController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        QuestionsModel.findOne({_id: id}, function (err, questions) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting questions',
                    error: err
                });
            }

            if (!questions) {
                return res.status(404).json({
                    message: 'No such questions'
                });
            }

            // questions.question = req.body.question ? req.body.question : questions.question;
			// questions.product = req.body.product ? req.body.product : questions.product;
			questions.answer = req.body.answer.trim() ? req.body.answer.trim() : questions.answer;
            questions.updated_at = new Date();
			
            questions.save(function (err, questions) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating questions.',
                        error: err
                    });
                }

                return res.json(questions);
            });
        });
    },

    /**
     * questionsController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        QuestionsModel.findByIdAndRemove(id, function (err, questions) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the questions.',
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
        
        
        QuestionsModel.deleteMany(query, function (err) {
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
