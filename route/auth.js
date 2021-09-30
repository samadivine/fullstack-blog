const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// REGISTRING USERS
router.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
    });

    newUser
      .save()
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  });
});

// USERS LOGIN
router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({ username })
    .then((result) => {
      if (result) {
        bcrypt.compare(password, result.password, function (err, result2) {
          if (result2) {
            const { password, ...others } = result._doc;
            res.status(200).json(others);
          } else {
            res.status(500).json("wrong password");
          }
        });
      } else {
        res.status(500).json("wrong username");
      }
    })
    .catch((err) => err);
});
module.exports = router;
