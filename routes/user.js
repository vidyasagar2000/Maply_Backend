const express = require("express");
require("dotenv").config();
const Place = require("../models/Place");
const PinLocation = require("../models/PinLocation");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchUser = require("../middleware/fetchUser");
const Feedback = require("../models/Feedback");
const UserReqLocation = require("../models/UserReqLocation");
router.use(express.json());

//Route 1: POST Request new places  /api/user/reqplace
router.post(
  "/reqplace",
  [
    body("name")
      .isLength({ min: 1 })
      .withMessage("Name must be at least 1 characters"),
    body("type")
      .isLength({ min: 3 })
      .withMessage("type must be at least 3 characters"),
    body("latitude")
      .isLength({ min: 1 })
      .withMessage("latitude must be at least 1 characters"),
    body("longitude")
      .isLength({ min: 1 })
      .withMessage("longitude must be at least 1 characters"),
  ],
  fetchUser,
  async (req, res) => {
    const name = req.body.name;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const type = req.body.type;
    const errors = validationResult(req);
    // If validation not successful
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array()[0].msg });
    } else {
      // Finding Existing place with latitude
      const existingPlace = await UserReqLocation.findOne({
        latitude: latitude,
      });
      //Existing place not found
      if (!existingPlace) {
        try {
          //Create Place
          const place = await UserReqLocation.create({
            name: name,
            latitude: latitude,
            longitude: longitude,
            type: type,
          });
          res.json({
            msg: "Place Requested Added Successfully!",
          });
        } catch (error) {
          console.log(error);
          res.json({
            error: "Error while Requesting Place",
          });
        }
      }
      // Existing Place found
      else {
        res.json({
          error: "Requested Place already Exist with this latitude",
        });
      }
    }
  }
);

//Route 2: POST post feedback  /api/user/feedback
router.post(
  "/feedback",
  [
    body("message")
      .isLength({ min: 3 })
      .withMessage("message must be at least 3 characters"),
  ],
  fetchUser,
  async (req, res) => {
    const message = req.body.message;
    const user = req.user;
    const imageUrl = req.body.imageUrl;
    console.log(user);
    const errors = validationResult(req);
    // If validation not successful
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array()[0].msg });
    } else {
      try {
        //Create feedback
        const feedback = await Feedback.create({
          user: user.id,
          message: message,
          imageUrl: imageUrl,
        });
        res.json({
          msg: "Feedback Successfully!",
        });
      } catch (error) {
        console.log(error);
        res.json({
          error: "Error while Requesting feedback",
        });
      }
    }
  }
);

//Route 3: GET /api/user/places
router.get("/places", fetchUser, async (req, res) => {
  try {
    const places = await Place.find();
    res.json({ msg: places });
  } catch (error) {
    res.json({ error: error });
  }
});

//Route 4: POST add pin places /api/user/addpinlocation
router.post(
  "/addpinlocation",
  [
    body("name")
      .isLength({ min: 1 })
      .withMessage("Name must be at least 1 characters"),
    body("type")
      .isLength({ min: 3 })
      .withMessage("type must be at least 3 characters"),
    body("latitude")
      .isLength({ min: 1 })
      .withMessage("latitude must be at least 1 characters"),
    body("longitude")
      .isLength({ min: 1 })
      .withMessage("longitude must be at least 1 characters"),
    body("message")
      .isLength({ min: 3 })
      .withMessage("message must be at least 3 characters"),
  ],
  fetchUser,
  async (req, res) => {
    const name = req.body.name;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const type = req.body.type;
    const errors = validationResult(req);
    const user = req.user;
    const message = req.body.message;
    // If validation not successful
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array()[0].msg });
    } else {
      // Finding Existing place with latitude
      const existingPlace = await PinLocation.findOne({
        latitude: latitude,
      });
      //Existing place not found
      if (!existingPlace) {
        try {
          //Create Place
          const place = await PinLocation.create({
            user: user.id,
            name: name,
            latitude: latitude,
            longitude: longitude,
            type: type,
            message: message,
          });
          res.json({
            msg: "Place pined  Successfully!",
          });
        } catch (error) {
          console.log(error);
          res.json({
            error: "Error while pinning Place",
          });
        }
      }
      // Existing Place found
      else {
        res.json({
          error: "Requested Place already pined with this latitude",
        });
      }
    }
  }
);

//Route 5: GET /api/user/pinlocations
router.get("/pinlocations", fetchUser, async (req, res) => {
  try {
    const places = await PinLocation.find({
      user: req.user.id,
    });
    res.json({ msg: places });
  } catch (error) {
    res.json({ error: error });
  }
});

module.exports = router;
