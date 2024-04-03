// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build the specific item view
router.get("/detail/:invId", utilities.handleErrors(invController.buildSpecificItem));
router.get("/", utilities.checkLogin, utilities.handleErrors(invController.buildManagement));
router.get("/add/classification", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification));
router.get("/add/inventory", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory));

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
router.get("/edit/:inv_id", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildUpdateInventory))
router.get("/delete/:inv_id", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildDeleteInventory))
router.get("/approval", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildApproveInventory))
router.get("/class/approved/:classification_id", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.approveClassification))
router.get("/approved/:inv_id", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.approveInventory))

// post routes
router.post(
    "/add/classification",
    invValidate.addClassificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
  )

  router.post(
    "/add/inventory",
    invValidate.addInventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
  )

  router.post(
    "/update/",
    invValidate.addInventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

  router.post(
    "/delete/",
    // invValidate.deleteInventoryRules(),
    // invValidate.checkDeleteData,
    utilities.handleErrors(invController.deleteInventory)
  )

  // router.post(
  //   "/class/approved/:classification_id",
  //   utilities.handleErrors(invController.approveClassification)
  // )

module.exports = router;