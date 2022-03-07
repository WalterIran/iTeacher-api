const router = require('express').Router();
const { jwtMiddleware } = require('../../../../config/jwt.strategy');

//Model
const Course = require('../../../../dao/courses/course.model');
const courseModel = new Course();

//Validation
const validatorHandler = require('../../../../middlewares/validator.handler');
const { createCourseSchema, reviewCourseSchema, requiredIdCourseSchema, searchSchema, paginationSchema } = require('../../../../schemas/course.schema');

router.post('/create',
    validatorHandler(createCourseSchema, 'body'),
    async (req, res, next) => {
        try {
            const data = req.body;
            const insertData = {
                userId: data.userId,
                courseName: data.courseName,
                courseDescription: data.courseDescription,
                courseTags: [...data.courseTags],
                courseStatus: 'ACT',
                reviews: [],
                createdAt: new Date()
            }

            const result = await courseModel.new(insertData);

            res.status(200).json({
                status: 'success',
                result
            });
        } catch (error) {
            next(error);
        }
    }
);

router.post('/byid/:id/add-review',
    jwtMiddleware,
    validatorHandler(requiredIdCourseSchema, 'params'),
    validatorHandler(reviewCourseSchema, 'body'),
    async (req, res, next) => {
        try {
            const id = req.params.id;
            const data = req.body;
            data.rating = parseInt(data.rating);
            data.createdAt = new Date();

            const result = await courseModel.updateAddReview(id, data);

            res.status(200).json({
                status: 'success',
                result
            });
        } catch (error) {
            next(error);
        }
    }
);


module.exports = router;