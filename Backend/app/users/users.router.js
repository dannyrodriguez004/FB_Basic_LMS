const jwt = require('jsonwebtoken');
const usersServices = require('./users.service');
const express = require('express');
const router = express.Router();
const jwtMiddleware = (req, res, next) => {
    const authString = req.headers['authorization'];
    if(typeof authString === 'string' && authString.indexOf(' ') > -1) {
        const authArray = authString.split(' ');
        const token = authArray[1];
        jwt.verify(token, '85tHm4SdMr7QmT2Xsi20Kcx3XUI3OGYf8siO5JMiThZICLMCtge01L3zDG0qBXx', (err, decoded) =>
        {
            if(err) {
                res.status(403).send({
                    errorMessage: 'Permission denied'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.status(403).send({
            errorMessage: 'Permission denied'
        });

    }
};

module.exports = (passport) => {

    /**
     * @param user: {email: string, contactEmail: string, f_name: string, l_name: string, password: string}
     */
    router.post('/add-instructor', passport.authenticate('jwt', {session: true}), async (req, res, next) => {
        const resp = await usersServices.addInstructor(req.body.user);
        res.json(resp);
    })

    router.post('/add-user', jwtMiddleware, async (req, res, next) => {
        console.log(req);
        console.log(res);
        const resp = await usersServices.addUser(req.body.user_info);
        res.json(resp);
    })

    /**
     * @param user: {key: string, name: string}
     */
    router.post('/add-student', async (req, res, next) => {
        const resp = await usersServices.addStudent(req.body.user);
        res.json(resp);
    });

    /**
     * @param student: string, student databasse key
     * @param course: string, course database key
     */
    router.post('/enroll-student', passport.authenticate('jwt', {session: true}), async (req, res, next) => {
        const resp = await usersServices.enrollIn(req.body.student, req.body.course);
        res.json(resp);
    });

    router.get('/all-instructors', passport.authenticate('jwt', {session: true}), async (req, res, next) => {
        const resp = await usersServices.getAllInstructors();
        res.json(resp);
    });

    router.get('/all-categories', async (req, res, next) => {
        const resp = await usersServices.getAllCategories();
        res.json(resp);
    });

    /**
     * @param id: string, instructor database key
     */
    router.get('/instructor-info', async (req, res, next) => {
        const resp = await usersServices.getInstructor(req.query.id);
        res.json(resp);
    });

    /**
     * 
     * @param req.body.username: string
     * @param req.body.password: string
     * 
     * ----> after passport authenticate ---->
     * 
     * @param user: {key: string, email: string, concatEmail: string, name: string, auth: number}
     * 
     */
    router.post('/admin-login', passport.authenticate('local', {}), async (req, res, next) => {
        const token = await usersServices.login(req.user);
        res.status(200).json({
            payload: token
        });
    });

    router.get('/get-student-info', async (req, res, next) => {
        const resp = await usersServices.getStudentDetail(req.query.student);
        res.json(resp);
    });

    router.post('/available-username', passport.authenticate('jwt', {session: true}), async (req, res, next) => {
        const resp = await usersServices.isAvailable(req.body.username);
        res.json(resp);
    });

    router.post('/existing-student', async (req, res, next) => {
        var userID = req.body.userID;
        console.log(userID);
        const resp = await usersServices.studentInDatabase(req.body.userID);
        res.json(resp);
    });
    return router;
}
