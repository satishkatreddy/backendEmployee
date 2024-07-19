const express = require('express');
const router = express.Router();
const {createEmployee, fetchAllEmployeDetails, fetchedSingleEmployee}= require('../controllers/employeController');
// const checkRole = require('../middleware/checkRole');

router.post('/create',   createEmployee);

router.get('/fetchAllEmployees', fetchAllEmployeDetails);
 
router.get('/fetchSingleEmployeeDetails/:id', fetchedSingleEmployee);




module.exports = router;