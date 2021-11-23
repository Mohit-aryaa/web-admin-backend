//require('./models/db.config')
require("dotenv").config();
const connection = require('./db')
const express = require('express');
const ClientRoutes = require('./routes/ClientRoutes');
const UsersRoutes = require('./routes/usersRoutes');
const roleRoute = require('./routes/roleRoutes');
const productsRoute = require('./routes/productsRoutes');
const categoryRoute = require('./routes/categoryRoutes');
const brandRoute = require('./routes/brandRoutes');
const vendorRoute = require('./routes/vendorRoutes');
const subcategoryRoute = require('./routes/subCategoryRoutes');
const subChildCategories = require('./routes/subChildCategoryRoutes')
const bundelProductsRoute = require('./routes/bundleProductRoutes');
const stockLogsRoute = require('./routes/stockLogsRoutes');
const shippingRoute = require('./routes/shippingRoutes');
const questionsRoute = require('./routes/questionsRoutes');
const consultants = require('./routes/consultantRoutes');
const coupons = require('./routes/couponRoutes');
const admin = require('./routes/adminRoutes')
const bodypasrer = require('body-parser');
const cors = require('cors');
const app = express();
var multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const mongoose = require("mongoose");

//const methodOverride = require('method-override')

const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');
app.use(cors());
app.use(express.json());


app.use('/admin', admin)
app.use('/users', UsersRoutes);
app.use('/clients', ClientRoutes);
app.use('/roles', roleRoute);
app.use('/products', productsRoute);
app.use('/uploads', express.static('uploads'));
app.use('/categories', categoryRoute);
app.use('/brands', brandRoute);
app.use('/vendors', vendorRoute);
app.use('/subcategories', subcategoryRoute);
app.use('/subChildCategories', subChildCategories)
app.use('/bundleProducts', bundelProductsRoute);
app.use('/stockLogs', stockLogsRoute)
app.use('/shippings', shippingRoute)
app.use('/questions', questionsRoute)
app.use('/consultants', consultants);
app.use('/coupons', coupons)

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

app.use('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerDocument))

const port = process.env.PORT || 3000;
app.listen(port, console.log(`Listening on port ${port}...`))