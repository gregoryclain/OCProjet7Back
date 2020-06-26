module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false,
      isEmail: true,
    },
    password: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.STRING,
      required: false,
      defaultValue: "user",
    },
  });
  // User.associate = (models) => {
  //   User.belongsTo(models.Role);
  //   // User.hasMany(models.Message);
  // };
  return User;
};
