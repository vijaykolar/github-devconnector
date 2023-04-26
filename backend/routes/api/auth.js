const express = require("express");
const { validationResult, check } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");
const auth = require("../../middleware/auth");
const User = require("../../models/Users");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.log("routes/api/auth.js - ", error.message);
    res.status(500).send("outes/api/auth.js - Server error");
  }
});

const errorsList = [
  check("email", "Please enter valid email").isEmail(),
  check("password", "Password is required").exists(),
];

router.post("/", errorsList, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    }
    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      config.get("jwtToken"),
      { expiresIn: 360000 },
      (error, token) => {
        if (error) throw error;
        res.status(200).json({ token });
      }
    );
    // return res.send("User registered");
  } catch (error) {
    console.log("api/auth/ -", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
