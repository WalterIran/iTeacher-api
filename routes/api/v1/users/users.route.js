const router = require('express').Router();
const { jwtMiddleware } = require('../../../../config/jwt.strategy');

const User = require('../../../../dao/users/user.model');
const userModel = new User();

//Find One user
router.get('/byid/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await userModel.findById(id);
        
        res.status(200).json({
            status: 'success',
            result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({status: 'failed', msg: 'Internal Server Error'});
    }
});

//Create user
router.post('/create', async (req, res) => {
    try {
        const result = await userModel.new(req.body);

        res.status(200).json({
            status: 'success',
            result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({status: 'failed', msg: 'Internal Server Error'});
    }
});

//Update one user
router.patch('/update/:id', 
    jwtMiddleware,
    async (req, res, next) => {
        try {
            const id = req.params.id;
            const changes = req.body;
            const result = await userModel.updateOne(id, changes);

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