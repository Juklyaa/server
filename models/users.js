const Sequelize = require('sequelize')
sequelize = require('../lib/dataBase');

const users = sequelize.define('users', {
  id: { 
    type: Sequelize.INTEGER,
    primaryKey: true 
  },
  name: {
      type: Sequelize.STRING,
      validate: {
        is: ["[a-z]",'i'],        
        max: 30,
        min:5,
                      
      },
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      is: ["[a-z]",'i'],        
      max: 50,
      min:20,
                
    },
  password:{
    type: Sequelize.STRING,
    }
  },
  private:{
    type: Sequelize.BOOLEAN,
  }
  
},{timestamps: false,  underscored: true});

module.exports = users; 
