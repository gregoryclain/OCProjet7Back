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
  });
  return Message;
};
