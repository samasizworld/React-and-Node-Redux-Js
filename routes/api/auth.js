const express = require("express");
const authMiddleware = require("../../middleware/auth");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const config = require("config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

//@routes-  GET api/auth
//@desc -   Test Route
//@acess -  Public
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); //leaves password in db
    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Err........");
  }
});

//@routes-  POST api/auth
//@desc -   Authenticate user and get token
//@acess -  Public
router.post(
  "/",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // if any of above doesnt match
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body; // Destructuring the req.body
    try {
      //See if User exists
      let user = await User.findOne({ email }); //find Users by its email
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      //Matching password of plain  and encrypted
      const isMatch = await bcrypt.compare(password, user.password); //user.password is from db
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      //Return jsonwebtoken (i.e user gets immediately token )

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      req.status(500).send("Server Error");
    }
  }
);

module.exports = router;
