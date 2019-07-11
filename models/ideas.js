const Sequelize = require('sequelize')
const users = require('./users')
sequelize = require('../lib/dataBase');

sequelize.define('ideas', {
  title: {
      type: Sequelize.STRING,
      validate: {
        is: ["[a-z]",'i'],        
        max: 30,
        min:5,
                      
      },
  },
  description: {
    type: Sequelize.STRING,
    validate: {
      is: ["[a-z]",'i'],        
      max: 50,
      min:20,
                
    },
  },
  private:{
    type: Sequelize.BOOLEAN,
  },


  
},{timestamps: false, underscored: true});

const { ideas } = sequelize.models;
ideas.belongsTo(users)
module.exports = ideas; 
