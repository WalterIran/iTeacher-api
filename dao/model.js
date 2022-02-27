const { ObjectId } = require('mongodb');
const { getDb } = require('../config/mongodb');
let db = null;

class Model {
    collection = null;

    constructor(collectionName) {
        getDb()
            .then( (database) => {
                db = database;
                this.collection = db.collection(collectionName);
            })
            .catch( (err) => {
                console.error(err);
            });
    }

    //Add new document
    async new(data) {
        return await this.collection.insertOne(data);
    }

    //Get one document by id
    async findById(id) {
        const filter = {
            _id: new ObjectId(id)
        };
        const doc = await this.collection.findOne(filter);
        return doc;
    }

    //Get All documents
    async findAll() {
        const cursor = await this.collection.find({});
        const docs = await cursor.toArray();
        return docs;
    }

    //Get faceted
    async getFaceted(page, items, filter = {}) {
        const cursor = this.collection.find(filter);
        const totalItems = await cursor.count();
        cursor.skip((page -1) * items);
        cursor.limit(items);

        const docs = await cursor.toArray();
        return {
            totalItems,
            page,
            items,
            totalPages: (Math.ceil(totalItems/items)),
            docs
        };
    }

    //Update one document
    async updateOne(id, changes) {
        const filter = {_id: new ObjectId(id)};
        const updateCmd = {
            '$set': {
                ...changes
            }
        };

        return await this.collection.updateOne(filter, updateCmd);
    }

    //Delete on document
    async deleteOne(id) {
        const filter = {_id: new ObjectId(id)};
        return await this.collection.deleteOne(filter);
    }
}

module.exports = Model;