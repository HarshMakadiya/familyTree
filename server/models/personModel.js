const { DataTypes } = require('sequelize');
const sequelize = require('../database/database.js');

const Person = sequelize.define('Person', {
  person_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  birthdate: {
    type: DataTypes.STRING
  },
  gender:{
    type: DataTypes.STRING
  }
},{
  timestamps: false, 
});


module.exports = Person;
