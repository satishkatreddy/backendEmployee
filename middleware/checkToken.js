const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');
const userModel = require('../Models/user');


const checkToken = asyncHandler(async (req, res, next) => {


    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        let token;
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = await userModel.findById(decoded._id).select('-password')
            next();
        }
        catch { 
            throw new AppError('Invalid Token', 400);
        } 
    }
    if (!token) {
        throw new AppError('Token not found', 404)
    }

})

module.exports= checkToken;