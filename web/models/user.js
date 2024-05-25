const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {  // 이메일 필드 추가
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }
  });

  return User;
};

