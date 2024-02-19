const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li class="car-cards">'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        // grid += '<hr />'
        grid += '<h3>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h3>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

  /* **************************************
* Build the specific view HTML
* ************************************ */
Util.buildSpecificVehicle = function(data){
  let card;
  if (data) {
    card = '<div id="specifics-container">'
    card += '<div id="specifics-top">'
    card += '<img src="' + data.inv_image + '" alt="Image of ' + data.inv_make 
    + ' ' + data.inv_model + ' on CSE Motors" />'
    card += '</div>'
    card += '<div id="specifics-bottom">'
    card += '<h3 id="make-h3">' + data.inv_make + ': </h3>'
    card += '<ul class="description-ul">'
    card += '<li id="miles"><strong>Miles:</strong> ' + new Intl.NumberFormat('en-US').format(data.inv_miles) + '</li>'
    card += '<li id="year"><strong>Year:</strong> ' + data.inv_year + '</li>'
    card += '<li id="price"><strong>Price:</strong>$' + new Intl.NumberFormat('en-US').format(data.inv_price) + '</li>'
    card += '<li id="color"><strong>Color:</strong> ' + data.inv_color + '</li>'
    card += '<li id="class"><strong>Classification:</strong> ' + data.classification_name + '</li>'
    card += '</ul>'
    card += '</div>'
    card += '<div id="description-grid">'
    card += '<h4 id="description-h4">Description:</h4>'
    card += '<p>' + data.inv_description + '</p>'
    card += '</div>'
    card += '</div>'
  } else {
    card += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return card
}

  /* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util