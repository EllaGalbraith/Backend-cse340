const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.addClassificationRules = () => {
    return [
      // classification_name is required and must be string
      body("classification_name")
        .trim()
        .isString()
        .isLength({ min: 1 })
        .withMessage("Please provide a classification name.")
        .custom(value => {
          // Check if there are spaces in the middle of the string
          if (/\s/.test(value)) {
            throw new Error("Classification name should not contain spaces in the middle.");
          }
          return true;
        }),
    ];
  };

validate.addInventoryRules = () => {
    return [
        // inv_make is required and must be string
        body("inv_make")
        .trim()
        .isString()
        .isLength({ min: 1 })
        .withMessage("Please provide an inventory make."), // on error this message is sent.


        // inventory_model is required and must be string
        body("inv_model")
        .trim()
        .isString()
        .isLength({ min: 1 })
        .withMessage("Please provide an inventory model."), // on error this message is sent.

        // inv_year is required and must be number
        body("inv_year")
        .trim()
        .isNumeric()
        .isLength({ min: 4, max: 4 })
        .withMessage("Please provide an inventory year."), // on error this message is sent.

        // inventory_description is required and must be string
        body("inv_description")
        .trim()
        .isString()
        .isLength({ min: 1 })
        .withMessage("Please provide an inventory description."), // on error this message is sent.

        // inv_image is required and must be string
        body("inv_image")
        .trim()
        .isString()
        .isLength({ min: 1 })
        .withMessage("Please provide an inventory image."), // on error this message is sent.

        // inv_thumbnail is required and must be string
        body("inv_thumbnail")
        .trim()
        .isString()
        .isLength({ min: 1 })
        .withMessage("Please provide an inventory thumbnail."), // on error this message is sent.

        // inv_price is required and must be number
        body("inv_price")
        .trim()
        .isNumeric()
        .isLength({ min: 1 })
        .withMessage("Please provide an inventory price."), // on error this message is sent.

        // inv_miles is required and must be number
        body("inv_miles")
        .trim()
        .isNumeric()
        .isLength({ min: 1 })
        .withMessage("Please provide an inventory miles."), // on error this message is sent.

        // inv_color is required and must be string
        body("inv_color")
        .trim()
        .isString()
        .isLength({ min: 1 })
        .withMessage("Please provide an inventory color."), // on error this message is sent.

        // classification_id is required and must be number
        body("classification_id")
        .trim()
        .isInt()
        .isLength({ min: 1 })
        .withMessage("Please provide a classification id."), // on error this message is sent.
    ]
}

validate.checkClassificationData = async (req, res, next) => {
    const {classification_name} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
          errors,
          title: "Add Classification",
          nav,
          classification_name,
        })
        return
      }
      next()
}

validate.checkInventoryData = async (req, res, next) => {
    const {inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id} = req.body
    let errors = []
    errors = validationResult(req)
    console.log("Errors:", errors)
    let dropDown = await utilities.buildClassificationFormInput(classification_id)
    console.log(dropDown)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()  
        res.render("inventory/add-inventory", {
          errors,
          title: "Add Inventory",
          dropDown,
          nav,
          inv_make,
          inv_model,
          inv_year,
          inv_description,
          inv_image,
          inv_thumbnail,
          inv_price,
          inv_miles,
          inv_color,
          classification_id,
        })
        return
      }
      next()
}

module.exports = validate