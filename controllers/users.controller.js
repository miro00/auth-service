const db = require('../models')
const User = db.users
const Op = db.Sequelize.Op
const bcrypt = require('bcrypt')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

exports.create = (req, res) => {
  const { login, password } = req.body
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      User.create({
        login: login,
        passwordHash: hash,
      })
        .then((data) => {
          res.status(201).send(data)
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message,
          })
        })
    })
  })
}

exports.login = (req, res) => {
  const { username, password } = req.body

  User.findAll({
    where: {
      login: username
    }
  })
  .then(user => {
    if (!user.length) {
      return res.status(404).send({
        message: 'Пользователь не найден'
      })
    }
    
    let userPassword = user[0].dataValues.passwordHash

    bcrypt
      .compare(password, userPassword)
      .then(isMatch => {
        if (isMatch) {
          const { id, login } = user[0].dataValues
          jwt.sign({ id, login }, process.env.SECRET, {
            expiresIn: '1d'
          }, (err, token) => {
            const expiresDate = new Date(0).setUTCSeconds(jwt.decode(token).exp)

            res.cookie('signature', token.split('.')[2], { maxAge: expiresDate, secure: false, httpOnly: true, sameSite: 'lax' })
            res.status(200).send({
              success: true,
              token: 'Bearer ' + token, 
            })
          })
        } else {
          res.status(401).send({
            success: false,
            message: 'Пароль не правильный'
          })
        }
      }).catch(err => console.log(err))
  }).catch(err => console.log(err))
}