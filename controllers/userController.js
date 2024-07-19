const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');
const UserModel = require('../Models/userModel');
const bcrypt = require('bcrypt');
const cookie = require('cookie-parser');
const generateToken = require('../utils/generateToken');

const signUp = asyncHandler(async (req, res) => {

    const {
        firstName, lastName, email, password, role
    } = req.body

    if (!firstName || !lastName || !email || !password || !role) {
        throw new AppError(0, 'Provide valid Input', 400)
    }

    const checkUser = await UserModel.findOne({ email: email, active: true })
    if (checkUser) {
        throw new AppError(0, 'user Already exists', 400)
    }
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);


    const userCreate = await UserModel.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashPassword,
        role: role
    })

    return res.status(201).json({ message: 'user is created successfully', data: userCreate });
})


const signIn = asyncHandler(async (req, res) => {

    const {
        email, password
    } = req.body

    if (!email || !password) {
        throw new AppError('provide valid Input', 400)
    }
    const checkEmail = await UserModel.findOne({ email: email, active: true })
    if (!checkEmail) {
        throw new AppError('user is not found!', 404)
    }

    const passwordIsCorrect = await checkEmail.isPasswordMatched(password);
    if (!passwordIsCorrect) {
        throw new AppError('password is Incorrect', 400)
    }
    const token = await generateToken(checkEmail._id);

    return res.status(200).json({
        message: 'logIn successfully',
        data: {
            _id: checkEmail._id,
            firstName: checkEmail.firstName,
            lastName: checkEmail.lastName,
            email: checkEmail.lastName,
            role: checkEmail.role,
            empId: checkEmail.empId,
            token: token
        }
    })
})

const logOut = asyncHandler(async (req, res) => {

    const cookie = req.cookie;
    if (!cookie.refreshToken) {
        throw new AppError('No refreshToken token in cookie', 400)
    }
    const refreshToken = cookie.refreshToken;
    const user = await UserModel.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204);
    }
    await UserModel.findByIdAndUpdate(refreshToken, {
        refreshToken: ""
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true
    });
    return res.sendStatus(204);
})


module.exports = {
    signUp,
    signIn,
    logOut
}