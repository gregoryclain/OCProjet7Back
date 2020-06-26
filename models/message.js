module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define("Message", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  // Message.associate = (models) => {
  //   Message.belongsTo(models.User);
  // };
  return Message;
};
