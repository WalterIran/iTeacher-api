const Model = require('../model');

class Course extends Model {
    constructor() {
        super('Courses');
    }
}

module.exports = Course;