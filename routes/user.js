const express = require('express');
const router = express.Router();
const {signIn, signUp, logOut}= require('../controllers/userController');

router.post('/signUp',   signUp);

router.post('/signIn', signIn);

router.get('/logout', logOut);



module.exports = router;