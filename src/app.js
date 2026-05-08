const express = require('express');
const app = express();
require("dotenv").config();

const port= process.env.PORT || 3001; 
const path = require('path');
const methodOverride =  require('method-override');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const cookieCheck = require("./middlewares/cookieCheck");
const cors = require("cors");

app.use(express.static("public"));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    secret: "secreto",
    resave: false,
    saveUninitialized: true
}))
app.use(cookieParser());
app.use(cookieCheck);
app.use(cors());


/* Template engine config */
app.set('view engine', 'ejs');
app.set('views', "./src/views");


/* Routers */
const mainRouter = require('./routes/main');
const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');

/* APIs Routers */
/* const apiUsersRouter = require('./routes/api/users');
const apiProductsRouter = require('./routes/api/products'); */
const apiRouter = require("./routes/api");

/* Routers Middlewares */
app.use('/', mainRouter);
app.use('/products', productsRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use("/api", apiRouter);

/* app.use('/api/users', apiUsersRouter);
app.use('/api/products', apiProductsRouter); */

const { sequelize } = require("./database/models");
app.get("/test-db", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.send("Conexión a BD OK");
  } catch (err) {
    console.error("Error conectando a BD:", err);
    res.status(500).send("Error de conexión a BD");
  }
});


/*app.listen(port, () => {
    console.log(`servidor levantado en http://localhost:${port}`);
    }
);*/
sequelize.sync({ alter: true }).then(() => {
    app.listen(port, '0.0.0.0', () => {
        console.log(`Servidor levantado en puerto ${port}`);
    });
});




