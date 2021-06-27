const express = require("express")
const router = express.Router()

const usersController = require("../controllers/users.controller")

// router.get("/", usersController.findAll)
router.post("/register", usersController.create)
router.post("/login", usersController.login)

module.exports = router
