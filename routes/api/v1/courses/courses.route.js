const router = require('express').Router();
const { jwtMiddleware } = require('../../../../config/jwt.strategy');

//Model
const Course = require('../../../../dao/courses/course.model');
const courseModel = new Course();

//Validation
const validatorHandler = require('../../../../middlewares/validator.handler');
const { createCourseSchema, reviewCourseSchema, requiredIdCourseSchema, searchSchema, paginationSchema } = require('../../../../schemas/course.schema');

router.post('/create',
    jwtMiddleware,
    validatorHandler(createCourseSchema, 'body'),
    async (req, res, next) => {
        try {
            const data = req.body;
            const insertData = {
                userId: data.userId,
                courseName: data.courseName,
                courseDescription: data.courseDescription,
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

router.get('/teacher-courses/:id/list-courses', 
    validatorHandler(requiredIdCourseSchema, 'params'),
    async (req, res, next) => {
        try {
            const id = req.params.id;
            const page = parseInt(req.query.page) || 1;
            const items = parseInt(req.query.items) || 10;
            const host = req.get('host');

            const results = await courseModel.getFaceted(page, items, {userId: id});

            const nextPage = results.totalPages > page ? (
                `http://${host}/api/v1/courses/teacher-courses/${id}/list-courses?page=${page + 1}&items=${items}`
            ) : (null);
            
            res.status(200).json({
                status: 'success',
                nextPage,
                results
            });

        } catch (error) {
            next(error);
        }
    }
);

router.get('/byid/:id', 
    validatorHandler(requiredIdCourseSchema, 'params'),
    async (req, res, next) => {
        try {
            const id = req.params.id;
            const result = await courseModel.findById(id);

            res.status(200).json({
                status: 'success',
                result
            });

        } catch (error) {
            next(error);
        }
    }
);

router.get('/byid/:id/reviews', 
    validatorHandler(requiredIdCourseSchema, 'params'),
    validatorHandler(paginationSchema, 'query'),
    async (req, res, next) => {
        try {
            const id = req.params.id;
            const page = parseInt(req.query.page) || 1;
            const items = parseInt(req.query.items) || 10;
            const host = req.get('host');

            const results = await courseModel.findCourseReviews(id, page, items);

            const nextPage = results.items === items ? (
                `http://${host}/api/v1/courses/byid/${id}/reviews?page=${page + 1}&items=${items}`
            ) : (null);
            
            res.status(200).json({
                status: 'success',
                nextPage,
                results
            });

        } catch (error) {
            next(error);
        }
    }
);

router.get('/search',
    validatorHandler(searchSchema, 'query'),
    async (req, res, next) => {
        try {
            const { value } = req.query;
            const page = parseInt(req.query.page) || 1;
            const items = parseInt(req.query.items) || 10;
            const host = req.get('host');

            const results = await courseModel.searchCoursesFaceted(value, page, items);

            const nextPage = results.items === items ? (
                `http://${host}/api/v1/courses/search?value=${value}&page=${page + 1}&items=${items}`
            ) : (null);

            res.status(200).json({
                status: 'success',
                nextPage,
                results
            });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;