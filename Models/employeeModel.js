const mongoose = require('mongoose');
const schema = mongoose.Schema;
// require('../Models/userModel')



const employeeSchema = new schema({
    employeeFirstName: {
        type: String,
        required: true
    },
    employeeLastName:{
        type: String,
        required: true
    },
    employeeEmail: {
        type: String,
        required: true
    },
    employeePassword: {
        type: String,
        required: true
    },
    designation: {
        enum: ['Developer', 'Tester', 'Data_Analyst', 'Team_Lead', 'Manager', 'HR'],
        type: String,
        required: true
    },
    basic_Salary: {
        type: Number,
        required: true
    },
    date_of_joining: {
        type: Date,
    },
    experience: {
        enum: ['Fresher', 'Experience_Candiate'],
        type: String,
        required: true
    },
    // createdBy: {
    //     type: schema.Types.ObjectId,
    //     ref: 'Users'
    // },
    active: {
        type: Boolean,
        default: true
    }


}, { timestamps: true })

const employees = mongoose.model('Employess', employeeSchema);
module.exports = employees;