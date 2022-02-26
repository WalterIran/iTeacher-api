const { ObjectId } = require('mongodb');
const Model = require('../model');

class User extends Model {
    constructor() {
        super('Users');
    }

    async findById(email) {
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
        delete doc.password;
        return doc;
    }
}

module.exports = User;