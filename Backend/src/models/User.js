const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define(
  'User',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    name: { type: DataTypes.STRING, allowNull: false },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },

    phone: { type: DataTypes.STRING, allowNull: false },

    company: { type: DataTypes.STRING, allowNull: false },

    // Nested object as JSONB: { street, city, zipcode, geo: { lat, lng } }
    address: {
      type: DataTypes.JSONB,
      allowNull: false
    }
  },
  {
    tableName: 'users',
    timestamps: true,
    indexes: [{ unique: true, fields: ['email'] }]
  }
);

module.exports = User;
