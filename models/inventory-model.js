const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
// classifications that are approved show up for the drop down in the forms, not the nav bar though... unless we want 

async function getALLClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

// check if the classification is approved and check if there is at least one inventory item in the classification
// SELECT * FROM public.classification WHERE classification_approved = true AND classification_id IN (SELECT classification_id FROM public.inventory)

async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification WHERE classification_approved = true AND classification_id IN (SELECT classification_id FROM public.inventory WHERE inv_approved = true) ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      INNER JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1 AND i.inv_approved = true`,
      [classification_id]
    )
    console.log("testing data.rows: ", data.rows)
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryById error " + error)
  }
}

// approve classification
async function approveClassification(user_id, classification_id) {
  try {
    console.log("checking in the model:  ", classification_id, " ", user_id)
    const data = await pool.query(
      `UPDATE public.classification SET account_id = $1, classification_approved = true WHERE classification_id = $2 RETURNING *;`,
      [user_id, classification_id]
    )
    console.log("approveClassification data: ", data)
    return data.rows[0]
  } catch (error) {
    console.error("approveInventory error " + error)
  }
}

// approve Inventory
async function approveInventory(user_id, inv_id) {
  try {
    const data = await pool.query(
      `UPDATE public.inventory SET account_id = $1, inv_approved = true WHERE inv_id = $2 RETURNING *;`,
      [user_id, inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("approveInventory error " + error)
  }
}

async function getClassificationFormInput() {
  try {
    const data = await pool.query("SELECT * FROM public.classification WHERE classification_approved = true ORDER BY classification_name")
    return data.rows
  } catch (error) {
    console.error("getClassificationFormInput error " + error)
  }
}

// get inventory that needs approval and the classification name for the inventory
async function getInventoryNeedApproval(){
  try {
    const data = await pool.query(
      // `SELECT * FROM public.inventory AS i 
      // JOIN public.classification AS c 
      // ON i.classification_id = c.classification_id 
      // WHERE i.inv_approved = false`
      `SELECT i.*, c.classification_name
      FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.inv_approved = false`
    )
    // console.log('YUH', data.rows[0])
    return data.rows
  } catch (error) {
    console.error("getInventoryNeedApproval error " + error)
  }
}

async function getClassificationNeedApproval() {
  try {
    const data = await pool.query(
      `SELECT * FROM public.classification 
      WHERE classification_approved = false`
    )
    return data.rows
  } catch (error) {
    console.error("getClassificationNeedApproval error " + error)
  }
}

/* ***************************
 *  Add all classification data
 * ************************** */
async function addClassification(classification_name){
  try {
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  }
  catch (error) {
    return error.message
  }
}

async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color,  classification_id){
  try {
    const sql = "INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id]);
  }
  catch (error) {
    return error.message
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventory(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1'
    const data = await pool.query(sql, [inv_id])
  return data
  } catch (error) {
    new Error("Delete Inventory Error")
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryById, getClassificationFormInput, addClassification, addInventory, updateInventory, deleteInventory, getALLClassifications, getInventoryNeedApproval, getClassificationNeedApproval, approveClassification, approveInventory}