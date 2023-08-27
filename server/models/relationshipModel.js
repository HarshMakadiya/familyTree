const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Relationship = sequelize.define('Relationship', {
  relationship_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  person_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  relative_id: {
    type: DataTypes.INTEGER,
    allowNull: false 
  }
},{
  timestamps: false,  
});

module.exports = Relationship;
