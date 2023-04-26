const express = require("express");
const { validationResult, check } = require("express-validator");

const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/Users");

router.get("/me", auth, async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id }).populate(
    "user",
    ["name", "avatar"]
  );

  if (!profile) {
    return res.status(400).json({ msg: "There is no profile for this user" });
  }
  res.json(profile);
  try {
  } catch (error) {
    console.log("routes/api/profile.js -", error.message);
    res.status(500).send("Server error");
  }
});

const errorsList = [
  check("status", "Status is required").not().isEmpty(),
  check("skills", "Skills is required").not().isEmpty(),
];

router.post("/", [auth, errorsList], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array() });
  }

  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skiils,
    linkedin,
    twitter,
    youtube,
  } = req.body;

  console.log(req.body);
});

module.exports = router;
