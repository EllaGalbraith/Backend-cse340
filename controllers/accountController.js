const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const accountController = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
accountController.buildLogin = async function(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }

accountController.buildRegister = async function(req, res, next) {
  try {
    let nav = await utilities.getNav()
    let flashMessage;
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  } catch (error) {
    next(error)
  }

}

accountController.buildLoginManagement = async function(req, res, next) {
  try{
    let nav = await utilities.getNav()
    res.render("./account/management", {
      title: "Login Management",
      nav,
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

accountController.buildAccountEdit = async function(req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("./account/account-update", {
      title: "Edit Account",
      nav,
      errors: null,
      account_id: res.locals.accountData.account_id,
      account_firstname: res.locals.accountData.account_firstname,
      account_lastname: res.locals.accountData.account_lastname,
      account_email: res.locals.accountData.account_email,
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
*  Process Registration
* *************************************** */
accountController.registerAccount = async function(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.accountRegister(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
accountController.accountLogin = async function(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  console.log('first: ' + account_email)
  const accountData = await accountModel.getAccountByEmail(account_email)
  console.log(accountData)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("./account/management", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
   console.log(account_email)
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   if (process.env.NODE_ENV === "development") {
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   } else {
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000, secure: true})
   }
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

 // process account updates
accountController.editAccount = async function(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  try {
    const updateResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    )
    if (updateResult) {
      req.flash("notice", "Your account has successfully been updated.")
        delete updateResult.account_password
        const accessToken = jwt.sign(updateResult, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
        if (process.env.NODE_ENV === "development") {
         res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        } else {
         res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000, secure: true})
        }
      return res.redirect("/account/")
    } else {
      req.flash("notice", "Sorry, the update failed.")
      res.status(501).render("./account/account-update", {
        title: "Edit Account",
        nav,
        errors: null,
        account_id,
        account_firstname,
        account_lastname,
        account_email,
      })
    }
  } catch (error) {
    return new Error('Access Forbidden')
  }
}

// edit password
accountController.editPassword = async function(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_password, } = req.body
  try {
    const hashedPassword = await bcrypt.hashSync(account_password, 10)
    console.log('Test the password crap: ' + hashedPassword + ' ' + account_password)
    const updateResult = await accountModel.updatePassword(account_id, hashedPassword)
    delete updateResult.account_password
    if (updateResult) {
      req.flash("notice", "Your password has successfully been updated.")
      return res.redirect("/account/")
    } else {
      req.flash("notice", "Sorry, the password update failed.")
      res.status(501).render("./account/account-update", {
        title: "Edit Account",
        nav,
        errors: null,
        account_id: updateResult.account_id,
        account_firstname: updateResult.account_firstname,
        account_lastname: updateResult.account_lastname,
        account_email: updateResult.account_email,
      })
    }
  } catch (error) {
    return new Error('Access Forbidden')
  }
}

  
module.exports = accountController