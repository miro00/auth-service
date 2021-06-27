const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const dbConfig = require('../config/config.json')[env]
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
})
const path = require('path')
const fs = require('fs')
const basename = path.basename(__filename)

const db = {}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0)
    && (file !== basename)
    && (file.slice(-3) === '.js')
  })
  .forEach(file => {
    db[file.split('.')[0]] = require(`./${file}`)(sequelize, Sequelize)
  })

db.Sequelize = Sequelize
db.sequelize = sequelize

module.exports = db