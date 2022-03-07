const Joi = require('joi');

//Types
const id = Joi.string();
const name = Joi.string();
const surname = Joi.string();
const email = Joi.string().email();
const password = Joi.string().min(6);
const confirmPassword = Joi.valid(Joi.ref('password'));
const degreeName = Joi.string();
const aboutDescription = Joi.string();
const teacherType = Joi.string();
const institutions = Joi.array().items(Joi.string());
const platforms = Joi.array().items(Joi.string());

const teacherSignUpSchema = Joi.object({
    name: name.required(),
    surname: surname.required(),
    email: email.required(),
    password: password.required(),
    confirmPassword: confirmPassword.required(),
    degreeName,
    aboutDescription,
    teacherType,
    institutions,
    platforms,
});

const studentSignUpSchema = Joi.object({
    name: name.required(),
    surname: surname.required(),
    email: email.required(),
    password: password.required(),
    confirmPassword: confirmPassword.required(),
});

const loginSchema = Joi.object({
    email: email.required(),
    password: password.required()
});

module.exports = { teacherSignUpSchema, loginSchema, studentSignUpSchema };