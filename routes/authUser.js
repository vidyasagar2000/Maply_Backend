const express = require("express");
require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const fetchUser = require("../middleware/fetchUser");
router.use(express.json());

// Route 1 : create a user using:  POST "/api/authUser/createuser". Doesnt require Auth
router.post(
  "/createuser",
  //validation checks
  [
    body("name")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 7 })
      .withMessage("Password must be at least 7 characters"),
  ],
  async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const imageUrl = req.body.imageUrl;
    const errors = validationResult(req);

    // If validation not successful
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array()[0].msg });
    }
    //validation successful
    else {
      // Finding Existing user with email
      const existingUser = await User.findOne({
        email: email,
      });
      //Existing User not found
      if (!existingUser) {
        // Using bcryptjs to secure password in database
        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(password, salt);
        try {
          //Create User
          const user = await User.create({
            name: name,
            email: email,
            password: securePassword,
            imageUrl: imageUrl
          });
          // Jwt signin
          const data = {
            user: {
              id: user._id,
            },
          };
          const jwtToken = jwt.sign(data, process.env.SECRET_KEY);
          res.json({
            msg: "User Created Successfully!",
            json: jwtToken,
          });
        } catch (error) {
          res.json({
            error: "Error while creating user",
          });
        }
      }
      // Existing user found
      else {
        res.json({
          error: "User already Exist with this email-id",
        });
      }
    }
  }
);

//Route 2 : Authenticate a user using:  POST "/api/authUser/login". Doesnt require Auth
router.post(
  "/login",
  [body("email").isEmail().withMessage("Please enter a valid email")],
  async (req, res) => {
    const errors = validationResult(req);
    // If validation not successful
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array()[0].msg });
    }
    // validation successful
    else {
      // checking if the email is correct or not
      const { email, password } = req.body;
      try {
        let user = await User.findOne({ email: email });
        // wrong email
        if (!user) {
          res.status(401).json({
            success: false,
            msg: "Please try to login with correct credentials!",
          });
        }
        // correct email
        else {
          // checking for password correct or not
          const passwordCompare = await bcrypt.compare(password, user.password);
          // password not correct
          if (!passwordCompare) {
            res.status(401).json({
              success: false,
              msg: "Please try to login with correct credentials!",
            });
          }
          // password correct
          else {
            const data = {
              user: {
                id: user._id,
              },
            };
            const jwtToken = jwt.sign(data, process.env.SECRET_KEY);
            const success = true;
            res.json({
              success: success,
              json: jwtToken,
            });
          }
        }
      } catch (error) {
        // something error occured while login
        res.json({
          success: false,
          msg: "Internal server error!",
        });
      }
    }
  }
);
// Route 3 : Get loggedin user details using: POST /api/authUser/getuser. Login required
router.post("/getuser", fetchUser, async (req, res) => {
  try {
    // Login success now trying to fetch the details of user
    const userId = req.user.id;
    const user = await User.findOne({
      _id: userId,
    })
      .select("-password")
      .lean();
    res.send(user);
  } catch (error) {
    res.status(500).json({
      error: "Internal server error!",
    });
  }
});
module.exports = router;
