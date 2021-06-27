const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define("users", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    login: {
      type: Sequelize.STRING(80),
      notEmpty: true
    },
    passwordHash: {
      type: Sequelize.STRING(200),
    },
  })

  return Users
}