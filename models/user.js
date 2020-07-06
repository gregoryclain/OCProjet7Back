module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
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
    },
    { tableName: "user", timestamps: true, underscored: true }
  );
  User.hasOne(Role, { foreignKey: "id", as: "role" });
  // User.associate = (models) => {
  //   User.belongsTo(models.Role, {
  //     foreignKey: {
  //       name: "role_id",
  //     },
  //   });
  //   // User.hasMany(models.Message);
  // };
  // User.associate = (models) => {
  //   User.belongsTo(models.Role, {
  //     foreignKey: {
  //       name: "roleId",
  //     },
  //     // foreignKey: "roleId",
  //   });
  //   // User.hasMany(models.Message);
  // };
  return User;
};
