var Sequelize = require("sequelize");
var Role = require("../models/role");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false,
      isEmail: true,
    },
    password: {
      type: Sequelize.STRING,
      required: true,
      allowNull: false,
    },
    // roleId: {
    //   type: Sequelize.INTEGER,
    //   required: false,
    //   defaultValue: 1,
    // },
  });
  // User.associate = (models) => {
  User.belongsTo(Role);
  // User.hasMany(models.Message);
  // };
  return User;
};
