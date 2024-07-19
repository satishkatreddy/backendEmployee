const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');
const EmployeeModel = require('../Models/employeeModel');
const UserModel = require('../Models/userModel');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');



const createEmployee = asyncHandler(async (req, res) => {

    const {
        employeeFirstName, employeeLastName, designation, basic_Salary, experience, employeeEmail, employeePassword, date_of_joining

    } = req.body;

    // if (!mongoose.Types.ObjectId.isValid(createdBy)) {
    //     throw new AppError('provide valid adminId')
    // }
    if (!designation || !basic_Salary || !experience || !employeeFirstName || !employeeEmail || !employeePassword || !employeeLastName || !date_of_joining) {
        throw new AppError('Provide valid Input', 400)
    }

    // const checkEmployee = await UserModel.findById({ _id: createdBy, active: true })
    // if (!checkEmployee) {
    //     throw new AppError('Admin is not Found!', 400)
    // }

    const existingUser = await UserModel.findOne({ email: employeeEmail, active: true });
    if (existingUser) {
        throw new AppError('Employee email already exists', 400);
    }
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(employeePassword, salt);

    const createEmployee = await EmployeeModel.create({
        employeeFirstName: employeeFirstName,
        employeeLastName: employeeLastName,
        employeeEmail: employeeEmail,
        employeePassword: hashPassword,
        designation: designation,
        basic_Salary: basic_Salary,
        experience: experience,
        date_of_joining: date_of_joining
    })

    await UserModel.create({
        firstName: employeeFirstName,
        lastName: employeeLastName,
        email: employeeEmail,
        password: hashPassword,
        role: 'Employee',
        empId: createEmployee._id
    })
    return res.status(201).json({ message: 'Employee created successfuly', data: createEmployee });
})


const fetchAllEmployeDetails = asyncHandler(async (req, res) => {

    const allEmployees = await EmployeeModel.find({ active: true }).sort({ createdAt: -1 })
        .lean();

    if (!allEmployees) {
        throw new AppError(0, 'Failed to Fetch Employee Details', 400);
    }

    const fetchEmployees = allEmployees.map((obj) => {
        const DA = 2000;
        const EPF = (obj.basic_Salary + DA) * 12 / 100;

        return {
            employeeName: `${obj?.employeeFirstName} ${obj?.employeeLastName}`,
            employeeEmail: obj?.employeeEmail,
            designation: obj?.designation,
            basic_Salary: obj?.basic_Salary,
            experience: obj?.experience,
            EPF: obj.basic_Salary >= 15000 ? EPF : null,
            date_of_joining : obj?.date_of_joining
        };
    });
    res.status(200).json({
        message: 'Employee Details fetched successfully',
        data: fetchEmployees,
    });

});


const fetchedSingleEmployee = asyncHandler(async (req, res) => {

    const empId = req.params.id;
    const fetchSingleEmployee = await EmployeeModel.findById({ _id: empId, active: true }).lean();
    if (!fetchSingleEmployee) {
        throw new AppError(0, 'Employee is not Found!', 404)
    }
    const FetchedSingleEmployeeDetails = {
        // admin_Name: `${fetchSingleEmployee.createdBy?.firstName} ${fetchSingleEmployee.createdBy?.lastName}`,
        employeeName: `${fetchSingleEmployee?.employeeFirstName} ${fetchSingleEmployee?.employeeLastName}`,
        employeeEmail: fetchSingleEmployee?.employeeEmail,
        designation: fetchSingleEmployee?.designation,
        basic_Salary: fetchSingleEmployee?.basic_Salary,
        experience: fetchSingleEmployee?.experience,
        date_of_joining: fetchSingleEmployee?.date_of_joining
    };

    return res.status(200).json({ message: 'Fetched single Employee Details', Data: FetchedSingleEmployeeDetails });
})



module.exports = {
    createEmployee,
    fetchAllEmployeDetails,
    fetchedSingleEmployee
}