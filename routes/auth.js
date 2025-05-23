const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { validateRegister } = require("../middleware/validation");
const auth = require("../middleware/auth");

router.post("/register", validateRegister, authController.register);

router.post("/login", authController.login);

router.get("/debug/:username", authController.debugUser);

module.exports = router;
