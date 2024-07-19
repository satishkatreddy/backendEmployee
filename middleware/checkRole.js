const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');



const checkRole = asyncHandler(async (req, res, next) => {

    const userRole = req.body.userRole;
    if (!userRole || !userRole.length === 0) {
        throw new AppError(0, 'Provide User Role', 400)
    }

    try {
        if (userRole === 'Admin') {
            next();
        }
        else {
            throw new AppError(0, 'You are not Authorized', 401)
        }
    }
    catch (err) {
        throw new Error(err)
    }
})

module.exports = checkRole;