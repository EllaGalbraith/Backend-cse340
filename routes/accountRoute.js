// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const accValidate = require('../utilities/account-validation')

router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/logout", utilities.handleErrors(utilities.logout))
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildLoginManagement))
router.get("/edit/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountEdit))

// Process the registration data
router.post(
    "/register",
    accValidate.registrationRules(),
    accValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

  // Process the login attempt
  router.post(
    "/login",
    accValidate.loginRules(),
    accValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin),
    // (req, res) => {
    //   res.status(200).send('login process')
    // }
  )

  router.post(
    "/edit/profile",
    accValidate.editAccountRules(),
    accValidate.checkEditData,
    utilities.handleErrors(accountController.editAccount)
  )

  router.post(
    "/edit/password",
    accValidate.editPasswordRules(),
    accValidate.checkEditPassword,
    utilities.handleErrors(accountController.editPassword)
  )

module.exports = router;