
const Sequelize = require('sequelize');

const sequelize = new Sequelize('IdeasDB', 'juli', '123', {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = sequelize;
