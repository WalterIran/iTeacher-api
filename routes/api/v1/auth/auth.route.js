const router = require('express').Router();
const jwt = require('jsonwebtoken');
const boom = require('@hapi/boom');
const multer = require('multer');

const upload = multer();

//Validation
const validatorHandler = require('../../../../middlewares/validator.handler');
const { teacherSignUpSchema, studentSignUpSchema, loginSchema } = require('../../../../schemas/auth.schema');

//Models
const User = require('../../../../dao/users/user.model');
const userModel = new User();

//Utils
const { uploadFile } = require('../../../../config/s3');
const { hashPassword, comparePassword } = require('../../../../utils/encryption.utils');

router.post('/teacher-signup',
    validatorHandler(teacherSignUpSchema, 'body'),
    upload.single('profileImg'),
    async (req, res, next) => {
        try {
            const data = req.body;
            const profileImg = req.file;

            const img = await uploadFile(profileImg);

            const insertData = {
                username: data.name + ' ' + data.surname,
                teacherType: data?.teacherType,
                userType: 'teacher',
                profileImg: img.Location,
                about: {
                    degreeName: data?.degreeName,
                    description: data?.aboutDescription,
                    institutions: data?.institutions,
                    platforms: data?.platforms
                },
                email: data.email,
                password: await hashPassword(data.password),
            }

            const result = await userModel.new(insertData);

            const payload = {
                userId: result.insertedId,
                userType: 'teacher',
                email: data.email
            }

            const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10d' });

            res.status(200).json({
                status: 'success',
                result,
                accessToken
            });
        } catch (error) {
            next(error);
        }
    }
);

router.post('/student-signup',
    validatorHandler(studentSignUpSchema, 'body'),
    async (req, res, next) => {
        try {
            const data = req.body;

            const insertData = {
                username: data.name + ' ' + data.surname,
                userType: 'student',
                email: data.email,
                password: await hashPassword(data.password)
            }

            const result = await userModel.new(insertData);

            const payload = {
                userId: result.insertedId,
                userType: 'student',
                email: data.email
            }

            const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10d' });

            res.status(200).json({
                status: 'success',
                result,
                accessToken
            });
        } catch (error) {
            next(error);
        }
    }
);

router.post('/login',
    validatorHandler(loginSchema, 'body'),
    async (req, res, next) => {
        try {
            const { email, password } = req.body;

            const user = await userModel.findByEmail(email);

            if (!user) {
                throw boom.unauthorized();
            }

            const isMatch = await comparePassword(password, user.password);
            
            if (!isMatch) {
                throw boom.unauthorized();
            }

            const payload = {
                userId: user._id,
                userType: user.userType,
                email
            }

            const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10d' });

            res.status(200).json({
                payload,
                accessToken
            });

        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;
