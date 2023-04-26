const express = require("express");
const { validationResult, check } = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const User = require("../../models/Users");

const router = express.Router();

const errorsList = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Please enter valid email").isEmail(),
  check("password", "Enter 6 or more characters").isLength({ min: 5 }),
];

router.post("/", errorsList, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "User already exists/......" }] });
    }
    // Check gravatar
    const avatar = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "mm",
    });

    user = new User({
      name,
      email,
      avatar,
      password,
    });

    // Encrypt password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

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
        console.log(1);
        if (error) throw error;
        res.status(200).json({ token });
      }
    );
    // return res.send("User registered");
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
