const router = require('express').Router();

//Routes
router.use('/users', require('./users/users.route'));

module.exports = router;