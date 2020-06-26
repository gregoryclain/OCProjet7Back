module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define("Role", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  // Role.associate = (models) => {
  //   Role.hasMany(models.User);
  // };
  return Role;
};
