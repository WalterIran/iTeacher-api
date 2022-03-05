const router = require('express').Router();

//Routes
router.use('/auth', require('./auth/auth.route'));
router.use('/users', require('./users/users.route'));
router.use('/courses', require('./courses/courses.route'));

module.exports = router;