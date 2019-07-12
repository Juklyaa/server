const Koa = require("koa");
const cors = require("koa2-cors");
const bodyParser = require("koa-bodyparser");
const session = require('koa-session');

const config = require('config');
const mainRoutes = require("routes/main");
const database = require('../lib/dataBase');

const app = new Koa();
app.keys = ['some secret hurr'];

const CONFIG = {
  key: 'koa:sess', 
  maxAge: 86400000,
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};





app.init = async () => {
  app.use(cors({
    credentials: true
  }));
  app.use(session(CONFIG, app));
  
  app.use(bodyParser());
  await database.sync();
  
  app.context.sequelize = database;
  // routes
  app.use(mainRoutes);
};

module.exports = app;
