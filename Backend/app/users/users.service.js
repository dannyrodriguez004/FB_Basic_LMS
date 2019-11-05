const database = require('firebase-admin').database();
const jwt = require('jsonwebtoken');
const crypto = require('bcrypt');
const coursesService = require('../courses/courses.service');
//JIQc0dIMic9Cv5kk

class UsersService {
    constructor() {}
    /**
     * 
     * @param {email: string, contactEmail: string, f_name: string, l_name: string, password: string} user 
     * 
     * @returns true if successfully added instructor to database.
     */
    async addInstructor(user) {
        console.log(user);
        try {
            let users = await database.ref('/instructors')
            .orderByChild('email')
            .equalTo(user.email)
            .once('value');

            if(!users.hasChildren()) {
                const salt = await crypto.genSalt();
                const hashedPass = await crypto.hash(user.password, salt);
                await database.ref('/instructors').push({
                    email: user.email.trim(),
                    contactEmail: user.contactEmail.trim(),
                    f_name: user.f_name.trim(),
                    l_name: user.l_name.trim(),
                    password: hashedPass,
                    auth: user.auth
                });

                return true;
            }

        } catch (err) {
            console.error(err);
        }

        return false;
    }

    async addStudent(user) {

        try {
            var users = await database.ref('/students').orderByKey().equalTo(user.key).once('value');
            //if(!users.hasChildren()) {
                await database.ref('/students').child(user.key).update({
                    token: user.token,
                    fname: user.fname.trim(),
                    lname: user.lname.trim(),
                    email: user.email.trim(),
                    country: user.country,
                    phone: user.phone,
                });
            //}
        } catch (err) {
            console.error(err);
            return false;
        }

        return true;
    }
    /**
     * 
     * @param {key: string, name: string} user 
     * 
     * @return true if successfully added new user
     */
    async addUser (user_info) {
        console.log('IN ADDSTUDENT USERSERVICE');
        console.log(user_info);
        try {
            var users = await database.ref('/users').orderByKey().equalTo(user_info.body.userID).once('value');
            if(!users || !users.hasChildren()) {
                await database.ref('/users').child(user_info.body.userID).set({
                    first_name: user_info.body.first_name.trim(),
                    last_name: user_info.body.last_name.trim(),
                    phone: user_info.body.phone.trim(),
                    email: user_info.body.email.trim(),
                    type: 'student',
                    country: user_info.body.country.trim()
                });
            } else {
                console.log('USER ALREADY EXISTS');
            }
        } catch (err) {
            console.error(err);
            return false;
        }

        return true;
    }

    /**
     * 
     * @param {string} student_key 
     * @param {string} course_key 
     * 
     * @return true if successfully added student to course
     */
    async enrollIn(student_key, course_key) {


        console.log(coursesService);

        var student = await database.ref('/courses/' + course_key + '/students').once('value');
         

        //var hasCourse = await coursesService.studentHasCourse(student_key, course_key);
        if(student.hasChild(student_key)) return false;

        try {

            let users = await database.ref('/students').orderByKey().equalTo(student_key).once('value');
            if(users.numChildren() != 1) {
                throw false;
            }
            users.child(student_key).child('enrolled').child(course_key).ref.set({id: course_key});

            await database.ref('/courses/' + course_key + '/students').child(student_key).ref.set({id: student_key});
        } catch (err) {
            console.error(err);
            return err;
        }

        return true;
    }


    async getAllInstructors() {

        let payload = [];

        let instructorsRef =  await database.ref('/instructors').orderByChild('l_name').once('value');

        instructorsRef.forEach((instructor) => {
            payload.push({
                name: instructor.child('l_name').val() + ', ' + instructor.child('f_name').val(),
                id: instructor.key,
            });
        })

        return payload;
    }


    async getAllCategories() {

        let payload = [];

        let categoriesRef =  await database.ref('/categories').orderByKey().once('value');

        categoriesRef.forEach((category) => {
            payload.push({
                name: category.key
            });
        })

        return payload;
    }

    /**
     * 
     * @param {string} id instructor id
     * 
     * @return {concatEmail: string, name: string} isntructor object
     */
    async getInstructor(id) {
        var resp = {
            contactEmail:'',
            name: '',
        };

        try {

            var instructor = await database.ref('/instructors/' + id).once('value');
            resp.contactEmail = instructor.child('contactEmail').val();
            resp.name = instructor.child('f_name').val() + ' ' + instructor.child('l_name').val();
            
        } catch (err) {
            console.log(err);
        }

        return resp;
    }


    /**
     * 
     * @param {key: string, email: string, concatEmail: string, name: string, auth: number} user
     * 
     * @return token: jwt token
     */
    async login(user) {
        const userInfo = {
            id: user.key,
            name: user.f_name + ' ' + user.l_name,
            email: user.email,
            contactEmail: user.concatEmail,
            auth: user.auth
        }

        const token = await jwt.sign(userInfo, '85tHm4SdMr7QmT2Xsi20Kcx3XUI3OGYf8siO5JMiThZICLMCtge01L3zDG0qBXx',
        {
            expiresIn: '7d',
            algorithm: 'HS512'
        });

        return token;
    }

    async getStudentDetail(student_id) {
        let payload = {};
        try {
            let students =  await database.ref('/students').orderByKey().equalTo(student_id).once('value');
            if(!students.hasChildren()) return payload;
            students.forEach( student  => {
                payload = student.toJSON();
                payload.id = student.key;
            });
        } catch (err) {
            console.error(err);
            return payload;
        }

        return payload;
    }

    async isAvailable(username) {
        try {

            let reference = await database.ref('/instructors').orderByChild('email').equalTo(username).once('value');
            if(!reference.hasChildren()) return true;
        } catch(err) {
            console.error(err);
        }

        return false;
    }

    async getUserInfo(key) {

        let userInfo = {};

        let user = await database.ref('/users').orderByKey().equalTo(key).once('value');
        user.forEach( (member) => {
            var user = member.toJSON();
            userInfo = {
                id: member.key,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                country: user.country
            };
        });

        return userInfo;
    }

        async studentInDatabase(userID) {

        try {
            console.log('STUDENT IN DATABASE: USERID SENT IN FOR CHECKING');
            console.log(userID);
            let reference = await database.ref('/users' + userID)
                // .orderByValue().equalTo(userID).once('value');
                console.log(reference);
                //make !reference below to check for non-occurrences of userID in database
            if(reference) {
                return true;
            } else {
                return false;
            }
        } catch(err) {
            console.error(err);
        }
        return false;
    }
}

module.exports = new UsersService();
