const Joi = require('joi');
//Types
const id = Joi.string();
const courseName = Joi.string();
const courseDescription = Joi.string();
const courseTags = Joi.array().items(Joi.string());
const courseStatus = Joi.string().valid('ACT', 'INA');
const userId = Joi.string();
const rating = Joi.number().valid(1,2,3,4,5);
const reviewTitle = Joi.string();
const reviewDescription = Joi.string();

const generalString = Joi.string();

const createCourseSchema = Joi.object({
    userId: userId.required(),
    courseName: courseName.required(),
    courseDescription: courseDescription.required(),
    courseTags
});

const reviewCourseSchema = Joi.object({
    studentId: userId.required(),
    rating: rating.required(),
    reviewTitle: reviewTitle.required(),
    reviewDescription: reviewDescription.required()
});

const requiredIdCourseSchema = Joi.object({
    id: id.required()
});

const updateCourseSchema = Joi.object({
    courseName,
    courseDescription,
    courseTags,
    courseStatus
});

const searchSchema = Joi.object({
    value: generalString.required(),
    page: Joi.number().positive(),
    items: Joi.number().valid(5,10,15)
});

const paginationSchema = Joi.object({
    page: Joi.number().positive(),
    items: Joi.number().valid(5,10,15)
});

const deleteCourseSchema = requiredIdCourseSchema;

module.exports = { createCourseSchema, reviewCourseSchema, requiredIdCourseSchema, updateCourseSchema, deleteCourseSchema, searchSchema, paginationSchema };