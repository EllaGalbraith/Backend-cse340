const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildSpecificItem = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryById(inv_id)
  const dataSpecifics = utilities.buildSpecificVehicle(data)
  console.log(data)
  let nav = await utilities.getNav()
  res.render("./inventory/detail", {
    title: data.inv_make + " " + data.inv_model,
    nav,
    dataSpecifics,
  })
}

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
  })
}

invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let dropDown = await utilities.buildClassificationFormInput()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    dropDown,
    errors: null,
  })
}

/* ****************************************
*  Process Form Data
* *************************************** */
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const classificationResult = await invModel.addClassification(classification_name)

  if (classificationResult) {
    req.flash("notice", `Classification ${classification_name} added.`)
    res.status(201).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", 'Sorry, there was an error processing the classification.')
    res.status(500).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
}

invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let dropDown = await utilities.buildClassificationFormInput()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const inventoryResult = await invModel.addInventory(
    inv_make, 
    inv_model, 
    inv_year,
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles,
    inv_color, 
    classification_id
    )

  if (inventoryResult) {
    req.flash("notice", `Inventory ${inv_make} ${inv_model} added.`)
    res.status(201).render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: null,
      dropDown,
    })
  } else {
    req.flash("notice", 'Sorry, there was an error processing the inventory.')
    res.status(500).render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: null,
      dropDown,
    })
  }
}

module.exports = invCont;