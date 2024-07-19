const express = require('express');
const app =express();
const {config} = require('dotenv');
const connnectedDb = require('../backend/utils/dataBase');
const userRouter = require('../backend/routes/user');
const employeeRouter = require('../backend/routes/employee');
const cors = require('cors');
const bodyParser = require('body-parser');



config({
    path:'./config.env'
})
connnectedDb();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use('/api/users', userRouter);
app.use('/api/employee', employeeRouter);

const PORT = 5000;
app.listen(PORT, (err)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log(`Server is running On ${PORT}`)
    }

})

