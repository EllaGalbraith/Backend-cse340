-- Q1
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Q2
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;

-- Q3
DELETE FROM account
WHERE account_id = 1;

-- Q4
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_id = 10;

-- Q5
SELECT i.inv_make, i.inv_model, cl.classification_name
FROM inventory i INNER JOIN classification cl 
ON i.classification_id = cl.classification_id
WHERE cl.classification_name = 'Sport';

-- Q6
UPDATE inventory
SET inv_image = REPLACE(inv_image, 'images', '/images/vehicles'),
inv_thumbnail = REPLACE(inv_thumbnail, 'images', '/images/vehicles');