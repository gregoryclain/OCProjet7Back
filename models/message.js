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
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    messageParentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });
  // Message.associate = (models) => {
  //   Message.belongsTo(models.User);
  // };
  return Message;
};
