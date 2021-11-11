require('./models/db.config')
const express = require('express');
const ClientRoutes = require('./routes/ClientRoutes');
const UsersRoutes = require('./routes/usersRoutes');
const roleRoute = require('./routes/roleRoutes');
const productsRoute = require('./routes/productsRoutes');
const categoryRoute = require('./routes/categoryRoutes');
const brandRoute = require('./routes/brandRoutes');
const vendorRoute = require('./routes/vendorRoutes');
const subcategoryRoute = require('./routes/subCategoryRoutes');
const bundelProductsRoute = require('./routes/bundleProductRoutes');
const stockLogsRoute = require('./routes/stockLogsRoutes');
const shippingRoute = require('./routes/shippingRoutes');
const questionsRoute = require('./routes/questionsRoutes');
const bodypasrer = require('body-parser');
const cors = require('cors');
const app = express();
var multer = require('multer');
 

const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');
app.use(cors());
app.use(express.json());



app.use('/users', UsersRoutes);
app.use('/clients', ClientRoutes);
app.use('/roles', roleRoute);
app.use('/products', productsRoute);
app.use('/uploads', express.static('uploads'));
app.use('/categories', categoryRoute);
app.use('/brands', brandRoute);
app.use('/vendors', vendorRoute);
app.use('/subcategories', subcategoryRoute);
app.use('/bundleProducts', bundelProductsRoute);
app.use('/stockLogs', stockLogsRoute)
app.use('/shippings', shippingRoute)
app.use('/questions', questionsRoute)

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

app.use('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(3000)