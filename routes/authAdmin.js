const express = require("express");
require("dotenv").config();
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const fetchAdmin = require("../middleware/fetchAdmin");
router.use(express.json());

// Route 1 : create a admin using:  POST "/api/authAdmin/createadmin". Doesnt require Auth
router.post(
  "/createadmin",
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
      // Finding Existing admin with email
      const existingAdmin = await Admin.findOne({
        email: email,
      });
      //Existing Admin not found
      if (!existingAdmin) {
        // Using bcryptjs to secure password in database
        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(password, salt);
        try {
          //Create Admin
          const admin = await Admin.create({
            name: name,
            email: email,
            password: securePassword,
            imageUrl: imageUrl
          });
          // Jwt signin
          const data = {
            admin: {
              id: admin._id,
            },
          };
          const jwtToken = jwt.sign(data, process.env.SECRET_KEY);
          res.json({
            msg: "Admin Created Successfully!",
            json: jwtToken,
          });
        } catch (error) {
            console.log(error);
          res.json({
            error: "Error while creating Admin",
          });
        }
      }
      // Existing admin found
      else {
        res.json({
          error: "Admin already Exist with this email-id",
        });
      }
    }
  }
);

//Route 2 : Authenticate a admin using:  POST "/api/authAdmin/login". Doesnt require Auth
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
        let admin = await Admin.findOne({ email: email });
        // wrong email
        if (!admin) {
          res.status(401).json({
            success: false,
            msg: "Please try to login with correct credentials!",
          });
        }
        // correct email
        else {
          // checking for password correct or not
          const passwordCompare = await bcrypt.compare(password, admin.password);
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
              admin: {
                id: admin._id,
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
// Route 3 : Get loggedin Admin details using: POST /api/authAdmin/getadmin. Login required
router.post("/getadmin", fetchAdmin, async (req, res) => {
  try {
    // Login success now trying to fetch the details of admin
    const adminId = req.admin.id;
    const admin = await Admin.findOne({
      _id: adminId,
    })
      .select("-password")
      .lean();
    res.send(admin);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal server error!",
    });
  }
});
module.exports = router;
