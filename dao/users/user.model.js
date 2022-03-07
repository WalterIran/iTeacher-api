const { ObjectId } = require('mongodb');
const Model = require('../model');

class User extends Model {
    constructor() {
        super('Users');
    }

    async addCourseToUser(userId, courseId) {
        const updateCmd = {
            "$addToSet" : {
                courses: new ObjectId(courseId)
            },
        }

        const filter = {_id: new ObjectId(userId)};
        return await this.collection.updateOne(filter, updateCmd);
    }

    async findByEmail(email) {
        const filter = {
            email
        }

        return await this.collection.findOne(filter);
    }

    async findById(id) {
        const _id = new ObjectId(id)
        const filter = {
            _id
        };
        const doc = await this.collection.findOne(filter);
        delete doc?.password;
        return doc;
    }
}

module.exports = User;