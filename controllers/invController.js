const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  console.log('Yo Testing: ',data[0])
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
  const dropDown = await utilities.buildClassificationFormInput()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    dropDown,
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

invCont.buildApproveInventory = async function (req, res, next) {
  let nav = await utilities.getNav()

  // classification that needs approval
  let needApprovalClassifications = await invModel.getClassificationNeedApproval()
  let approvalClassifications = await utilities.buildApprovalClassification(needApprovalClassifications)
  // inventory that needs approval
  let needApprovalInv = await invModel.getInventoryNeedApproval()
  let approvalInv = await utilities.buildApprovalInventory(needApprovalInv)

  res.render("./inventory/approve-inventory", {
    title: "Approve Inventory",
    nav,
    errors: null,
    approvalInv,
    approvalClassifications,
  })
}

/* ****************************************
*  Process Form Data
* *************************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body

  const classificationResult = await invModel.addClassification(classification_name)

  let nav = await utilities.getNav()

  if (classificationResult) {
    req.flash("notice", `Classification ${classification_name} added.`)
    res.status(201).render("./inventory/management", {
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
    res.status(201).render("./inventory/management", {
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

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const dropDown = await utilities.buildClassificationFormInput(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    dropDown: dropDown,
    errors: null,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
    inv_id
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ****************************************
*  Build Update Inventory
* *************************************** */
invCont.buildUpdateInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const data = await invModel.getInventoryById(inv_id)
  let name = data.inv_make + " " + data.inv_model
  let dropDown = await utilities.buildClassificationFormInput(data.classification_id)
  res.render("./inventory/edit-inventory", {
    title: "Edit " + name,
    nav,
    dropDown: dropDown,
    errors: null,
    inv_id: inv_id,
    inv_make: data.inv_make,
    inv_model: data.inv_model,
    inv_year: data.inv_year,
    inv_description: data.inv_description,
    inv_image: data.inv_image,
    inv_thumbnail: data.inv_thumbnail,
    inv_price: data.inv_price,
    inv_miles: data.inv_miles,
    inv_color: data.inv_color,
    classification_id: data.classification_id,
  })
}

// accept classifications
invCont.approveClassification = async function (req, res, next) {
  const classification_id = parseInt(req.params.classification_id.split(":")[1])
  const user_id = parseInt(res.locals.accountData.account_id)
  console.log("user_id: ", user_id)
  console.log("classification_id: ", classification_id)
  const approvalResult = await invModel.approveClassification(user_id, classification_id)
  console.log("approvalResult: ", approvalResult)
  if (approvalResult) {
    req.flash("notice", `Classification: ${approvalResult.classification_name} approved.`)
    res.redirect("/inv/approval")
  } else {
    req.flash("notice", "Sorry, the approval failed.")
    res.status(501).redirect("/inv/approval")
  }
}

// accept inventory
invCont.approveInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id.split(":")[1])
  const user_id = parseInt(res.locals.accountData.account_id)
  console.log("user_id: ", user_id)
  console.log("inv_id: ", inv_id)
  const approvalResult = await invModel.approveInventory(user_id, inv_id)
  console.log("approvalResult: ", approvalResult)
  if (approvalResult) {
    req.flash("notice", `Inventory: ${approvalResult.inv_make} ${approvalResult.inv_model} approved.`)
    res.redirect("/inv/approval")
  } else {
    req.flash("notice", "Sorry, the approval failed.")
    res.status(501).redirect("/inv/approval")
  }
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,  
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    classification_id
  } = req.body

  const itemName = inv_make + " " + inv_model
  
  const deleteResult = await invModel.deleteInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    classification_id
  )

  if (deleteResult) {
    // const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", ` ${itemName} successfully deleted.`)
    res.redirect("/inv/")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    classification_id,
    })
  }
}


/* ****************************************
*  Build Delete Inventory
* *************************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const data = await invModel.getInventoryById(inv_id)
  let name = data.inv_make + " " + data.inv_model
  res.render("./inventory/delete-inventory", {
    title: "Delete " + name,
    nav,
    errors: null,
    inv_id: inv_id,
    inv_make: data.inv_make,
    inv_model: data.inv_model,
    inv_year: data.inv_year,
    inv_price: data.inv_price,
    classification_id: data.classification_id,
  })
}
module.exports = invCont;