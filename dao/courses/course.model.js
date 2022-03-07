const Model = require('../model');
const { ObjectId } = require('mongodb');

const User = require('../users/user.model');
const userModel = new User();
class Course extends Model {
    constructor() {
        super('Courses');
    }

    //Add new document
    async new(data) {
      const course = await this.collection.insertOne(data);
      const user = await userModel.addCourseToUser(data.userId,course._id);
      return {user, course};
    }

    async updateAddReview(id, review) {
        review.studentId = new ObjectId(review.studentId);
        const updateCmd = {
            "$addToSet" : {
                reviews: review
            },
        }

        const filter = {_id: new ObjectId(id)};
        return await this.collection.updateOne(filter, updateCmd);
    }

    //Get one document by id
    async findById(id) {

        const agg = [
            {
              '$match': {
                '_id': new ObjectId(id)
              }
            }, {
              '$addFields': {
                'rating': {
                  '$trunc': [
                    {
                      '$avg': '$reviews.rating'
                    }, 1
                  ]
                }, 
                'totalReviews': {
                  '$size': '$reviews'
                }
              }
            }, {
              '$project': {
                'reviews': 0
              }
            }
          ];

        const cursor = await this.collection.aggregate(agg);
        const doc = await cursor.limit(1).toArray();
        return doc[0];
    }

    //Get course reviews paginated
    async findCourseReviews(id, page, items) {

      const agg = [
        {
          '$match': {
            '_id': new ObjectId(id)
          }
        }, {
          '$unwind': {
            'path': '$reviews'
          }
        }, {
          '$project': {
            '_id': 0, 
            'courseId': '$_id', 
            'review': '$reviews'
          }
        }, {
          '$replaceRoot': {
            'newRoot': {
              '$mergeObjects': [
                '$$ROOT', '$review'
              ]
            }
          }
        }, {
          '$project': {
            'review': 0
          }
        }
      ];

      const cursor = await this.collection.aggregate(agg);
      cursor.skip((page -1) * items);
      cursor.limit(items);
      const docs = await cursor.toArray();
      items = docs.length;
      return {
        page,
        items,
        docs
      };
    }

    //Get faceted
    async getFaceted(page, items, filter = {}) {
      filter.userId = new ObjectId(filter.userId);
      const cursor = this.collection.find(filter).project({reviews: 0});
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

  dynamicRegex(text) {
    return text !== '' ? `(${text.split(' ').map(word => `(?=.*${word})`).join('')})` : '';
  }

  addToCondition(text, arrIdentifiers, conditions) {
    const rgx = this.dynamicRegex(text);
    arrIdentifiers.forEach(value => {
      if(rgx !== '') {
        conditions.push({[`${value}`]: new RegExp(rgx, 'i')})
      }
    });
  }

  //Search courses
  async searchCoursesFaceted(searchValue, page, items) {
    // const rgx = `(${text.split(' ').map(word => `(?=.*${word})`).join('')})`;
    const conditions = [];
    const arrIdentifiers = [
      'teacherInfo.username', 
      'teacherInfo.about.institutions', 
      'teacherInfo.teacherType', 
      'teacherInfo.about.platforms',
      'courseTags',
      'courseName',
      'courseDescription'
    ];

    this.addToCondition(searchValue, arrIdentifiers, conditions);

    const agg = [
      {
        '$project': {
          'reviews': 0
        }
      }, {
        '$lookup': {
          'from': 'Users', 
          'localField': 'userId', 
          'foreignField': '_id', 
          'as': 'teacherInfo'
        }
      }, {
        '$match': {
          '$or': conditions
        }
      }
    ];

    const cursor = await this.collection.aggregate(agg);
    cursor.skip((page -1) * items);
    cursor.limit(items);
    const docs = await cursor.toArray();
    items = docs.length;
    return {
      page,
      items,
      docs
    };
  }
}

// [
//   {
//     'teacherInfo.username': new RegExp(teacherNameRgx, 'i')
//   }, {
//     'teacherInfo.about.institutions': new RegExp('((?=.*hola))', 'i')
//   }, {
//     'teacherInfo.about.platforms': new RegExp('((?=.*hola))', 'i')
//   }, {
//     'courseTags': new RegExp('((?=.*hola))', 'i')
//   }, {
//     'courseName': new RegExp('((?=.*hola))', 'i')
//   }
// ]

module.exports = Course;