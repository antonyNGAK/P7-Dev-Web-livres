const express = require('express');
const router = express.Router();

const userControle = require('../controleurs/user');

router.post('/signup', userControle.signup);
router.post('/login', userControle.login);

module.exports = router;