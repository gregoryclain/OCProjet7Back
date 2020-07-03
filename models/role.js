module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define("Role", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // group_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   defaultValue: 0,
    // },
    // user_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   defaultValue: 0,
    // },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user",
    },
  });
  // Role.associate = (models) => {
  //   Role.hasMany(models.User);
  // };
  return Role;
};
