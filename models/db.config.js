const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/webAdmin', {useNewUrlParser: true }, (err)=> {
    if(!err) { console.log('MongoDB Connection Successded.') }
    else { console.log('Error in DB connection :' + err ) }
});

// require('./usersModel');
// require('./roleModel');
// require('./productsModel');
// require('./categoryModel');
// require('./subCategoryModel');