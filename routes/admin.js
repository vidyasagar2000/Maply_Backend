const express = require("express");
require("dotenv").config();
const Place = require("../models/Place");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchAdmin = require("../middleware/fetchAdmin");
const Feedback = require("../models/Feedback");
const UserReqLocation = require("../models/UserReqLocation");
router.use(express.json());

//Route 1: POST Add places  /api/admin/addplace
router.post(
  "/addplace",
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
  fetchAdmin,
  async (req, res) => {
    const name = req.body.name;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    console.log(latitude, longitude);
    const type = req.body.type;
    const imageUrl = req.body.imageUrl;
    const importantData = req.body.importantData;
    const errors = validationResult(req);
    // If validation not successful
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array()[0].msg });
    } else {
      // Finding Existing place with latitude
      const existingPlace = await Place.findOne({
        latitude: latitude,
      });
      //Existing place not found
      if (!existingPlace) {
        try {
          //Create Place
          const place = await Place.create({
            name: name,
            latitude: latitude,
            longitude: longitude,
            type: type,
            imageUrl: imageUrl,
            importantData: importantData,
          });
          const deleteLocation = await UserReqLocation.findOneAndDelete({
            latitude: place.latitude,
          });
          res.json({
            msg: "Place Added Successfully!",
          });
        } catch (error) {
          console.log(error);
          res.json({
            error: "Error while Adding Place",
          });
        }
      }
      // Existing Place found
      else {
        res.json({
          error: "Place already Exist with this latitude",
        });
      }
    }
  }
);

//Route 2: GET /api/admin/places
router.get("/places", fetchAdmin, async (req, res) => {
  try {
    const places = await Place.find();
    res.json({ msg: places });
  } catch (error) {
    res.json({ error: error });
  }
});

//Route 3: GET /api/admin/getuserlocationupdates
router.get("/getuserlocationupdates", fetchAdmin, async (req, res) => {
  try {
    const userReqLocation = await UserReqLocation.find();
    res.json({ msg: userReqLocation });
  } catch (error) {
    res.json({ error: error });
  }
});

//Route 4: GET /api/admin/feedback
router.get("/feedback", fetchAdmin, async (req, res) => {
  try {
    const feedback = await Feedback.find();
    res.json({ msg: feedback });
  } catch (error) {
    res.json({ error: error });
  }
});

module.exports = router;
