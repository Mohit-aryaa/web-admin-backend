var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var servicesSchema = new Schema({
    'productTitle': String,
    'productImages': Array,
    'productDescription': String,
    'productCategory': {
        type:Schema.Types.ObjectId,
        ref: 'category',
        } ,
    'productConsultant': {
        type:Schema.Types.ObjectId,
        ref: 'consultant',
    },
    'productBrand': String,
    'tags':  Object,
    'salePrice': String,
    'servicesDiscount': String,
    'purchasePrice': String,
    'shippingCost': String,
    'testName': String,
    'seoKeyWords': String,
    'metaTagKeywords': String,
    'metaTagDescription': String,
    'metaTagTitle': String,
});

module.exports = mongoose.model('Services', servicesSchema);
