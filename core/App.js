const Koa = require("koa");
const cors = require("koa2-cors");
const bodyParser = require("koa-bodyparser");

const config = require('config');
const mainRoutes = require("routes/main");

const app = new Koa();


app.init = async () => {
  app.use(cors({
      credentials: true
  }));

  app.use(bodyParser());

  // routes
  app.use(mainRoutes);
};

module.exports = app;
