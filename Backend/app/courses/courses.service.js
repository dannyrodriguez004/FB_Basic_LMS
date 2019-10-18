const database = require('firebase-admin').database();
const userService = require('../users/users.service');

const MAX_POSTS = 50;

class CoursesService {
    constructor() {}

    /**
     * 
     * @param {name: string, description: string, indtructor_id: ,max_size: number, isOpen: boolean} newCourse 
     * 
     * @return true if successfully added
     */

    async addCourse(newCourse) {
        console.log(newCourse);
        try {
            let course = await database.ref('/courses').once('value');
            let newRef = course.ref.push(
                {
                    name: newCourse.name,
                    description: newCourse.description,
                    instructor_id: newCourse.instructor_id,
                    modules: [],
                    assignments: [],
                    size: 0,
                    discussions: [],
                    MAX_SIZE: newCourse.MAX_SIZE,
                    isOpen: newCourse.isOpen,
                    endEnrollDate: newCourse.endEnrollDate
                }
            );

            let cat = await database.ref('/categories/' + newCourse.category).once('value');
            console.log(newRef);
            cat.child(newRef.key).ref.set({ courseId: newRef.key })
            
        } catch (err) {
            console.error(err);
            return false;
        }

        return true;
    }

    /**
     * 
     * @param {string} course_key 
     * @param {title: string, description: string, isClosed: boolean} newDiscussion 
     * 
     * @return true if successfully added new discussion
     */
    async addDiscussion(course_key, newDiscussion) {
        
        try {

            let courses = await database.ref('/courses')
            .orderByKey()
            .equalTo(course_key)
            .once('value');

            if(courses.numChildren() > 1) {
                return false;
            }

            courses.forEach((course) => {
                course.child('discussions').ref.push({
                    title: newDiscussion.title,
                    description: newDiscussion.description,
                    isClosed: newDiscussion.isClosed,
                    endDate: newDiscussion.endDate,
                });
            });
        } catch(err) {
            console.error(err);
            return false;
        }

        return true;
            
    }

    /**
     * 
     * @param {string} course, course key in database
     * @param {string} discussion, discussion key in database
     * @param {user_name: string, user_id: string, date: string, post: string} post 
     * 
     * @return true if post is successfully added
     */
    async addDiscussionPost(course, discussion, post) {
        try {

            await database.ref('/courses/' + course + '/discussions/')
            .child(discussion).child('posts').push(
                {
                    user_name: post.user_name,
                    user_id: post.user_id,
                    date: post.date,
                    post: post.post
                }
            )
        } catch (err) {
            console.error(err);
            return false;
        }

        return true;
    }

    


    /**
     * 
     * @param {string} course, course key in the database
     * @param {name: string} module_obj
     * 
     * @return true if successfully added module to course
     */
    async addCourseModule(course, module_obj) {
        try {
            var courses = await database.ref('/courses').orderByKey().equalTo(course).once('value');
            if(courses.numChildren() != 1) {
                throw false;
            }

            courses.child(course).child('modules').ref.push({
                name: module_obj.name
            });

        } catch (err) {
            console.error(err);
            return false;
        }

        return true;
    }

    /**
     * 
     * @param {string} course_key , course key in the database
     * @param {string} module_key , module key in the database
     * @param {title: string, isTimed: boolean, time: number, dueDate: string, attempts: number, 
     * items: {cal,: number, question: string, answer: string, options: string[]}[]} content 
     * 
     * @return true if successfully added quiz
     */
    async addModuleQuiz(course_key, module_key, content) {

        //console.log('courseKey', course_key, 'moduleKey', module_key ,content);
        try {
            var courses = await database.ref('/courses/' +  course_key).once('value');
            if(courses.hasChildren) {
                var items = courses.child('modules').child(module_key).child('content').ref.push({
                    title: content.title,
                    time: content.time,
                    dueDate: content.dueDate,
                    attempts: content.attempts,
                });

                let total = 0;

                content.items.forEach( (item) => {
                    total += item.value;
                    items.child('items').ref.push({
                        value: Number(item.value),
                        question: item.question,
                        answer: item.answer,
                        options: item.options
                    });
                });

                items.update({outOf: total});


            } else {
                throw false;
            }
        } catch (err) {
            console.error(err);
            return false;
        }

        return true;
    }

    /**
     * 
     * @param {string} course_key , course key in the database
     * @param {string} module_key , module key in the database
     * @param {title: string, url: string} content 
     * 
     * @return true if successfully added Url link to module
     */
    async addModuleUrl(course_key, module_key, content) {
        try {
            var courses = await database.ref('/courses').orderByKey().equalTo(course_key).once('value');
            if(courses.hasChildren) {
                courses.child(course_key).child('modules').child(module_key).child('content').ref.push({
                    title: content.title,
                    url: content.url
                });
            } else {
                throw false;
            }
        } catch (err) {
            console.error(err);
            return false;
        }

        return true;
    }


    /**
     * 
     * @param {string} course_key , course key in the database
     * @param {string} module_key , module key in the database
     * @param {title: string, link: string} content 
     * 
     * @return true if successfully added link to module
     */
    async addModuleLink(course_key, module_key, content) {
        try {
            var courses = await database.ref('/courses').orderByKey().equalTo(course_key).once('value');
            if(courses.hasChildren) {
                courses.child(course_key).child('modules').child(module_key).child('content').ref.push({
                    title: content.title,
                    link: content.link,
                });
            } else {
                throw false;
            }
        } catch (err) {
            console.error(err);
            return false;
        }

        return true;
    }

    async addModuleContent(course_key, module_key, content) {
        //console.log("course", course_key, "module", module_key, "content", content);
        try {
            var courses = await database.ref('/courses').orderByKey().equalTo(course_key).once('value');
            if(courses.hasChildren) {
                courses.child(course_key).child('modules').child(module_key).child('content').ref.push({
                    title: content.title,
                    link: content.link || null,
                    url: content.url || null,
                    embedded: content.embedded || null,
                    page: content.page || null,
                });
            } else {
                throw false;
            }
        } catch (err) {
            console.error(err);
            return false;
        }

        return true;
    }

    /**
     * @return {
     * {id: string, name: string, isOpen: boolean, description: string, 
     * instructor_id: string, size: number, MAX_SIZE: number}[]
     * } courses
     */
    async getAllCourses(key) {
        let payload = [];
        let courses = await database.ref('/courses').orderByKey().equalTo(key).once('value');
        courses.forEach( (course) => {
            payload.push({
                id: course.key,
                name: course.child('name').val(),
                isOpen: course.child('isOpen').val(),
                description: course.child('description').val(),
                instructor_id: course.child('instructor_id').val(),
                size: course.child('size').val(),
                MAX_SIZE: course.child('MAX_SIZE').val()
            });
        });
        return payload;
    }

    /**
     * 
     * @param {string} course_id , course key in the database
     * 
     * @return {{id: string, title: string, dueDate: string, outOf: number}[]} assessments
     */
    async getAssessmentsList(course_id) {
        let assessments = [];
        try {
            let courseModules = await database.ref('/courses/' + course_id + '/modules').once('value');

            courseModules.forEach( (mod) => {
                mod.child("content").forEach( (cont) => {
                    if(cont.hasChild('outOf')) {
                        //console.log(cont.child('title').val());
                        const assessment = cont.toJSON();
                        assessments.push({
                            id: cont.key,
                            title: assessment.title,
                            dueDate: assessment.dueDate,
                            outOf: assessment.outOf,
                        });
                    }
                })
            });


        } catch(err) {
            console.error(err);
        }

        return assessments;
    }

    /**
     * @return {string[]} categories
     */
    async getAllCategories() {
        let payload = [];

        let categoriesRef = await database.ref('/categories').orderByValue();
        categoriesRef.forEach( (category) => {
            payload.push({
                name: category.val(),
                id: category.key,
            })
        })

        return payload;
    }

    /** Debugging, loads all the data in a course
     * 
     * @param {*} key 
     */
    async getCourse(key) {
        let myCourse;
        let courses = await database.ref('/courses').orderByKey().equalTo(key).once('value');
        courses.forEach( (member) => {
            var course = member.toJSON();
            myCourse = course;
            myCourse.key = member.key;
        });

        return myCourse;
    }

    /**
     * 
     * @param {string} key , course key in the database
     * 
     * @return {id: string, name: string, description: string, instructor: string, size: number, MAX_SIZE: number} course_info
     */
    async getCourseInfo(key) {

        let myCourse = {};

        let courses = await database.ref('/courses').orderByKey().equalTo(key).once('value');
        courses.forEach( (member) => {
            var course = member.toJSON();
            myCourse = {
                id: member.key,
                name: course.name,
                description: course.description,
                instructor: course.instructor_id,
                size: course.size,
                MAX_SIZE: course.MAX_SIZE,
                endEnrollDate: course.endEnrollDate,
            };
        });

        return myCourse;
    }

    /**
     * 
     * @param {string} courses_id , course key in the database
     * 
     * @returns {name: string,
     *           resources: {id: string, title: string, url: string, link: string, isTime}[]}[]
     */
    async getCourseModules(courses_id) {
    
        let payload = {
            modules: []
        };
   
        let tempModule;
   
        try {
   
            var courseModules = await database.ref('/courses/' + courses_id + '/modules').once('value');
   
            courseModules.forEach( (mod) => {

                tempModule = {id:'', name: '', resources: []};
   
                tempModule.name = mod.child('name').val();
                tempModule.id = mod.key;
   
                mod.child('content').forEach( (item) => {
                    tempModule.resources.push({
                    id: item.key,
                    mod: mod.key,
                    title: item.child('title').val(),
                    url: item.child('url').val(),
                    link: item.child('link').val(),
                    outOf: item.child('outOf').val(),
                    embedded: item.child('embedded').val(),
                    page: item.child('page').val(),
                    });
                });
   
                   payload.modules.push(tempModule);
            });
        } catch (err) {
               console.error(err);
        }
   
           return payload.modules;
    }


    /**
     * 
     * 
     * @return {{id: string, name: string, description: string, instructor: string}[]} courses_info
     */
    async getCoursesInfo() {

        let payload = [];

        let courses = await database.ref('/courses').orderByKey().equalTo(key).once('value');

        courses.forEach( (member) => {
            var course = member.toJSON();
            payload.push({
                id: member.key,
                name: course.name,
                img: course.img,
                description: course.description,
                instructor: course.instructor,
            });
        });
    }
    
    /**
     * 
     * @param {string} course , course key in the database
     * @param {string} discussion_id , discussion key in the database
     * 
     * @return {title: string, description: string, isClosed: boolean} discussion_info
     */
    async getDiscussionInfo(course, discussion_id) {
        
        try {

            var discussion = await database.ref('/courses/' + course + '/discussions/' + discussion_id).once('value');
            return {
                title: discussion.child("title").val(),
                description: discussion.child("description").val(),
                isClosed: discussion.child("isClosed").val(),
                endDate: discussion.child("endDate").val()
            };

        }catch (err) {
            console.error(err);
        }

        return {title: "", description: "", isClosed: true};
    }

    /**
     * 
     * @param {string} course , course key in the database
     * @param {string} discussion_id , discussion key in the database
     * 
     * @return {{id: string, date: string, post: string, user_id: string, user_name: string}[]} posts
     */
    async getDiscussionPosts(course, discussion) {
        let payload = {
            posts: []
        }

        try {

            let posts = await database.ref('/courses/' + course + '/discussions/' + discussion + '/posts/').orderByKey().once('value');

            if(!posts.hasChildren()) {
                return payload;
            }
            
            posts.forEach( (item) => {
                var post = item.toJSON();
                post.id = item.key;
                payload.posts.push(post);
            });

        }catch (err) {
            console.error(err);
        }

        return payload.posts;

    }

    /**
     * 
     * @param {string} course , course key in the database
     * @param {string} discussion_id , discussion key in the database
     * @param {number} start , element "index" from which to begin fetching post
     * 
     * @return {{id: string, date: string, post: string, user_id: string, user_name: string}[]} posts
     */
    async getDiscussionPostsFrom(course, discussion, start) {
        let payload = {
            posts: [],
            total: 0,
        }

        let loadedPosts = 0;

        try {

            payload.total = await this.getNumberOfPosts(course, discussion);
            if(payload.total < 1) throw 'not error, the discussion is empty';

            let posts = await database.ref('/courses/' + course + '/discussions/' + discussion + '/posts/')
            .orderByKey()
            .limitToLast(payload.total - start)
            .once('value');

            if(!posts.hasChildren()) {
                return payload;
            }
            
            posts.forEach( (item) => {
                if(loadedPosts < MAX_POSTS) {
                    var post = item.toJSON();
                    post.id = item.key;
                    payload.posts.push(post);
                } else {
                    throw "Not error, just interrup for each with a throw";
                }
                loadedPosts++;
            });

        }catch (err) {
            console.error(err);
        }

        return payload;

    }

    /**
     * 
     * @param {string} course_key , course key in the database
     * 
     * @return {{title: string, id: string}[]} discussions
     */
    async getDiscussions(course_key) {

        let payload = {
            discusions: []
        };

        try {

            let discussions = await database.ref('/courses/' + course_key + '/discussions')
            .once('value');

            discussions.forEach( (discussion) => {
                payload.discusions.push({
                    id: discussion.key,
                    title: discussion.child('title').val(),
                });
            });

        } catch (err) {
            console.error(err);
        }

        return payload.discusions;
    }

    /**
     * 
     * @param {string} course , course key in the database
     * @param {string} discussion_id , discussion key in the database
     * 
     * @param {number}, number of posts in a discussion
     */
    async getNumberOfPosts(course, discussion) {
        try {
            let posts = await database.ref('/courses/' + course + '/discussions/' + discussion + '/posts/').once('value');
            return posts.numChildren();
        } catch (err) {
            console.error(err);
        }

        return 0;
    }

    /**
     * 
     * @param {string} user, student key in the database
     * 
     * @return {{id: string, name: string}[]} courses
     */
    async getMyCourses(user) {

        let payload = {
            courses: []
        };

        let student = await database.ref('/students/' + user + '/enrolled').once('value');


        student.forEach( (item) => {
            payload.courses.push({id: item.child('id').toJSON()});
        })

        let courses = await database.ref('/courses').once('value');
        for(var i =0; i < payload.courses.length; i++){
            payload.courses[i].name = (courses.child(payload.courses[i].id).child('name').val());
        }

        return payload.courses;
    }

    async getPage(course_id, module_id, page_id){
        //console.log('course',course_id,'module', module_id,'page', page_id);
        let payload = {};
        try {

            let page = await database.ref('/courses/' + course_id + '/modules/' + module_id + '/content/' + page_id).once('value');
            return page.toJSON();

        } catch(err) {
            console.error(err);
        }

        return payload;
    }

    /**
     * 
     * @param {string} course_id , course key in the database
     * @param {string} student_id , student key in the database
     * 
     * @return {{{id: string, title: string, dueDate: string, outOf: number, doneOn: string, score: number}[]}} records
     */
    async getStudentGrades(course_id, student_id) {

        let assessments = await this.getAssessmentsList(course_id);

        if(assessments.length < 1) return assessments;

        try {

            assessments.forEach((item) => {
                var record = this.getStudentRecord(student_id, course_id, item.id);
                item.doneOn = record.doneOn || null;
                item.score = record.score || null;
                item.startTime = record.startTime || null;
            });
            
        } catch(err) {
            console.error(err);
        }

        return assessments;

    }

    
    /**
     * 
     * @param {string} course_id , course key in the database
     * @param {string} student_id , student key in the database
     * @param {string} assessment_id, assesment key in the database
     * 
     * @return {doneOn: string, score: number} record

     */
    async getStudentRecord(student_id, course_id, assessment_id) {
        try {
            let records = await database.ref('/students/' + student_id + '/enrolled')
            .orderByChild('id')
            .equalTo(course_id)
            .once('value');

            records.child('records').child(assessment_id).forEach( (record) => {
                return {
                    doneOn: record.child('doneOn').val(),
                     score: record.child('score').val()
                    };
            });

        } catch(err) {
            console.error(err);
        }

        return {
            doneOn: null,
             score: null
            };
    }


    async removeModule() {

    }

    async removeContent(course, module_id, content) {
        try {
            await database.ref('/courses/' + course + '/modules/' + module_id + '/content/' + content).remove();
        } catch (err) {
            console.error(err);
            return false;
        }

        return true;
    }


    /**
     * @param {string} course_id , course key in the database
     * @param {string} student_id , student key in the database
     * 
     * @returns {boolean} true if this student is enrolled in this course
     */
    async studentHasCourse(student_id, course_id) {
        let student = await database.ref('/courses/' + course_id + '/students').once('value');
        return student.hasChild(student_id);
    }

    /**
     *
     * @param {string} course_id , course key in the database
     * @param {string} student_id , student key in the database
     *
     * @return {{{id: string, title: string, dueDate: string, outOf: number, doneOn: string, score: number}[]}} records

     async getCourseModules(courses_id) {

        let payload = {
            modules: []
        };

        let tempModule;

        try {

            var courseModules = await database.ref('/courses/' + courses_id + '/modules').once('value');

            courseModules.forEach( (mod) => {

                tempModule = {id:'', name: '', resources: []};

                tempModule.name = mod.child('name').val();
                tempModule.id = mod.key;

                mod.child('content').forEach( (item) => {
                    tempModule.resources.push({
                    id: item.key,
                    mod: mod.key,
                    title: item.child('title').val(),
                    url: item.child('url').val(),
                    link: item.child('link').val(),
                    isTimed: item.child('isTimed').val(),
                    embedded: item.child('embedded').val()
                    });
                });

                   payload.modules.push(tempModule);
            });
        } catch (err) {
               console.error(err);
        }

           return payload.modules;
    }
*/
    // async getCourseStudents(courses_id) {
    //
    //     let payload = {
    //         students: []
    //     };
    //
    //     let tempStudent;
    //
    //     try {
    //
    //         var courseStudents = await database.ref('/courses/' + courses_id + '/students').once('value');
    //
    //         courseStudents.forEach( (stu) => {
    //
    //             tempStudent = {name: ''};
    //
    //             tempStudent.name = stu.child('name').val();
    //             // tempStudent.id = stu.key;
    //
    //             payload.students.push(tempStudent);
    //         });
    //     } catch (err) {
    //         console.error(err);
    //     }
    //
    //     return payload.students;
    // }
    async updateCourse(course) {

        console.log(course.endEnrollDate);

        try {

            await database.ref('/courses/' + course.id).update({
                name: course.name,
                instructor_id: course.instructor,
                description: course.description,
                endEnrollDate: course.endEnrollDate
            });
        } catch (err) {
            console.error(err);
            return false;
        }

        return true;
    }


    async getModule(course, module_id) {
        let payload = {id: '', title: '', resources: []};

        try {

            let current_module = await database.ref('/courses').child(course)
            .child('modules').child(module_id).once('value');

            payload.title = current_module.child('name').val();
            payload.id = current_module.key;

            current_module.child('content').forEach( (item) => {
                payload.resources.push({
                    id: item.key,
                    mod: current_module.key,
                    title: item.child('title').val(),
                    url: item.child('url').val(),
                    link: item.child('link').val(),
                    outOf: item.child('outOf').val(),
                    embedded: item.child('embedded').val(),
                    page: item.child('page').val(),
                });
            });

        } catch (err) {
            console.error(err);
        }

        return payload;

    }


    async updateDiscussion(course, discussion) {
        try {

            await database.ref('/courses/' + course + '/discussions/' + discussion.id).update({
                description: discussion.description,
                endDate: discussion.endDate,
                isClosed: discussion.isClosed,
                title: discussion.title,
            });

        } catch(err) {
            console.error(err);
            return false;
        }

        return true;
    }


    async removeDiscussion(course, discussion) {
        try {
            await database.ref('/courses/' + course + '/discussions/' + discussion).remove();
        } catch(err) {
            console.error(err);
            return false;
        }

        return true;
    }


    /**  ---------------------- getStudentsForCourse  ----------------------
     *
     * @param {string} course_id
     *
     * @returns json object with array of student objects
     */
    //
    // async getStudents(course) {
    //
    //     let payload = [];
    //
    //     let students = await database.ref('/courses').child(course).child('students').once('value');
    //     students.forEach( (students) => {
    //         payload.push({
    //             id: students.key,
    //             name: students.child('name').val(),
    //             email: students.child('email').val()
    //         });
    //     });
    //     return payload;
        // let payload = {id: '', name: '', email: ''};
        //
        // try {
        //
        //     let current_student = await database.ref('/courses').child(course)
        //         .child('students').child(student_id).once('value');
        //
        //     payload.name = current_student.child('name').val();
        //     payload.id = current_student.key;
        //
        //     // current_module.child('email').forEach( (student) => {
        //     //     payload.email.push({
        //     //         id: student.key,
        //     //         stu: current_student.key,
        //     //         name: student.child('title').val()
        //     //     });
        //     // });
        //
        // } catch (err) {
        //     console.error(err);
        // }
        //
        // return payload;
    //
    // }
    /**
     * @return {string[]} categories
     */
    async getAllCourses() {
        let payload = [];

        let coursesRef = await database.ref('/courses').orderByValue();
        coursesRef.forEach( (course) => {
            payload.push({
                name: course.name,
                id: course.key,
                instructor_name: course.instructor_name
            })
        })

        return payload;
    }

    async signUpFor(user, course) {
        try {

            if( await this.studentHasCourse(user, course)) return false;

            let courseInfo = await this.getCourseInfo(course);

            if(courseInfo.size >= courseInfo.MAX_SIZE) {
                return await this.addToWaitingList(user, course);
            }

            await database.ref('/courses/' + course + '/registered').child(user).set({student_id: user});

            let increment = await database.ref('/courses/' + course).once('value');
            increment.ref.update({size: (increment.child('size').val() + 1) });

        } catch (err) {
            console.error(err);
            return false;
        }

        return true;
    }

    async addToWaitingList(user, course) {
        try {
            await database.ref('/courses/' + course + '/waiting-list').child(user).set({student_id: user});
        } catch (err) {
            console.error(err);
            return false;
        }

        return true;
    }

    async getRegistered(course) {
        let payload = [];
        let ids = [];
        try {
            let registered = await database.ref('/courses/' + course + '/registered').once('value');

            registered.forEach((item) => {
                
                ids.push(item.child('student_id').val());
            });

            var index;
            for(index = 0; index < ids.length; index++) {
                var temp = await userService.getStudentDetail(ids[index]);
                temp.id = ids[index];
                payload.push(temp);
            }

        } catch (err) {
            console.error(err);
        }

        return payload;
    }

    async waitingListSize(course) {
        let size = 0;

        try {
            var waitigList = await database.ref('/courses/' + course + '/waiting-list').once('value');
            size = waitigList.numChildren();
        } catch(err) {
            console.error(err);
        }

        return size;
    }

    async removeRegistree(student, course) {
        try {

            let studentRef = await database.ref('/courses/' + course + '/registered/' + student).once('value');
            if(studentRef.exists()) {

                studentRef.ref.remove();

                let decriment = await database.ref('/courses/' + course).once('value');
                decriment.ref.update({size: (decriment.child('size').val() - 1) });
            } else {
                return false;
            }

            await this.moveFromWaitToRegister(course);

        } catch(err){
            return false;
        }

        return true;
    }

    async confirmEnrollment(student, course) {
        
        try {
            if(await userService.enrollIn(student, course)) {
                let studentRef = await database.ref('/courses/' + course + '/registered/' + student).once('value');
                if(studentRef.exists()) {
                    studentRef.ref.remove();
                } else {
                    return false;
                }
            } else {
                return false;
            }

            await this.moveFromWaitToRegister(course);

        } catch (err) {
            console.error(err);
            return false;
        }

        return true;
    }

    async moveFromWaitToRegister(course) {
        
        if( await this.waitingListSize(course) < 1) return false;
        
        try {

            let waitlistRef = await database.ref('/courses/' + course + '/waiting-list').limitToFirst(1).once('value');

            waitlistRef.forEach( (student) => {
                database.ref('/courses/' + course + '/registered').child(student.key).set({student_id: student.key});
                student.ref.remove();
            });

            let increment = await database.ref('/courses/' + course).once('value');
            increment.ref.update({size: (increment.child('size').val() + 1) });

        } catch (err) {
            console.error(err);
            return false;
        }

        return true;
    }

    async getCourseStudent(course) {
        let payload = [];
        let list = [];

        let students = await database.ref('/courses/' + course + '/students').once('value');
        
        students.forEach( (item) => {
            list.push(item.key);
        })

        var student;
        for(let i = 0; i < list.length; i++) {

            student = await userService.getStudentDetail(list[i]);

            console.log(student);
            payload.push({
                id: student.id,
                fname: student.fname,
                lname: student.lname
            });
        }

        return payload;
    }
}


module.exports = new CoursesService();
