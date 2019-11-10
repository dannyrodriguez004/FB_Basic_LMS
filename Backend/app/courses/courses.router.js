const jwt = require('jsonwebtoken');
const coursesServices = require('./courses.service');
const express = require('express');
const router = express.Router();
const Utils = require('../utils/utils.service');

module.exports = (passport) => {

    // add course to app
    router.post('/add-course', passport.authenticate('jwt', {session: true}), async (req, res, next) => {
        const resp = await coursesServices.addCourse(req.body.course);
        res.json(resp);
        Utils.AdminLog(req.user, {method: coursesServices.addCourse.name, params: [req.body.course], result: resp}, "Adding New Course");
    });

    // add course discussion to course
    router.post('/add-course-discussion', passport.authenticate('jwt', {session: true}), async (req, res, next) => {
        const resp = await coursesServices.addDiscussion(req.body.course, req.body.discussion);
        res.json(resp);
        Utils.AdminLog(req.user, {method: coursesServices.addDiscussion.name, params: [req.body.course, req.body.discussion], result: resp}, "Adding New Discussion");
    });

    // add post to a discussion
    // router.post('/add-discussion-post', async (req, res, next) => {
    //     const resp = await coursesServices.addDiscussionPost(req.body.course, req.body.discussion, req.body.post);
    //     res.json(resp);
    // });
    router.post('/add-discussion-post', async (req, res, next) => {
        // if (!req.body.post.user_id){
        //     req.body.post.user_id = req.user;
        // }
        const resp = await coursesServices.addDiscussionPost(req.body.course, req.body.discussion, req.body.post);
        res.json(resp);
    });
    // add module to a course
    router.post('/add-module', passport.authenticate('jwt', {session: true}), async (req, res, next) => {
        const resp = await coursesServices.addCourseModule(req.body.course, req.body.module);
        res.json({success: resp});
        Utils.AdminLog(req.user, {method: coursesServices.addCourseModule.name, params: [req.body.course, req.body.module], result: resp}, "Adding New Module");
    });

    // add link content to module
    router.post('/add-module-link', passport.authenticate('jwt', {session: true}), async (req, res, next) => {
        const resp = await coursesServices.addModuleLink(req.body.course, req.body.module, req.body.content);
        res.json({success: resp});
        Utils.AdminLog(req.user, {method: coursesServices.addModuleLink.name, params: [req.body.course, req.body.module, req.body.content], result: resp}, "Adding a link to a module.");
    });

    // add quiz content to module
    router.post('/add-module-quiz', passport.authenticate('jwt', {session: true}), async (req, res, next) => {
        const resp = await coursesServices.addModuleQuiz(req.body.course, req.body.module, req.body.content);
        res.json({success: resp});
        Utils.AdminLog(req.user, {method: coursesServices.addModuleQuiz.name, params: [req.body.course, req.body.module, req.body.content], result: resp}, "Adding a quiz to a Module");
    });

    // add external link to module
    router.post('/add-module-url', passport.authenticate('jwt', {session: true}), async (req, res, next) => {
        const resp = await coursesServices.addModuleUrl(req.body.course, req.body.module, req.body.content);
        res.json({success: resp});
        Utils.AdminLog(req.user, {method: coursesServices.addModuleUrl.name, params: [req.body.course, req.body.module, req.body.content], result: resp}, "Adding an external link to a module.");
    });

    router.post('/add-module-content', passport.authenticate('jwt', {session: true}), async (req, res, next) => {
        const resp = await coursesServices.addModuleContent(req.body.course, req.body.module, req.body.content);
        res.json(resp);
        Utils.AdminLog(req.user, {method: coursesServices.addModuleContent.name, params: [req.body.course, req.body.module, req.body.content], result: resp}, "Adding a content to a module.");
    });

    // get course catergories
    router.get('/categories', async (req, res, next) => {
        const resp = await coursesServices.getAllCategories();
        res.json(resp);
    });

    // debug get all data associated with a course
    router.get('/course', passport.authenticate('jwt', {session: true}), async (req, res, next) => {
        const resp = await coursesServices.getCourse(req.query.key);
        res.json(resp);
    });

    // get info for a course
    router.get('/course-info', async (req, res, next) => {
        const resp = await coursesServices.getCourseInfo(req.query.key);
        res.json(resp);
    });

    // get all courses infos
    router.get('/courses', async ( req, res, next) => {
        const resp = await coursesServices.getAllCourses();
        res.json(resp);
    });

    // get course discussions
    router.get('/course-discussions', async (req, res, next) => {
        const resp = await coursesServices.getDiscussions(req.query.course);
        res.json(resp);
    });

    // get course discussion info
    router.get('/course-discussion-info', async (req, res, next) => {
        const resp = await coursesServices.getDiscussionInfo(req.query.course, req.query.discussion);
        res.json(resp);
    });
    
    // get all posts from a discussion
    router.get('/discussion-posts', async (req, res, next) => {
        const resp = await coursesServices.getDiscussionPosts(req.query.course, req.query.discussion);
        res.json(resp);
    });

    // get upto 50 posts from a discussion starting from start element
    router.get('/discussion-posts-from', async (req, res, next) => {
        const resp = await coursesServices.getDiscussionPostsFrom(req.query.course, req.query.discussion, Number(req.query.start));
        res.json(resp);
    });

    // get all info for all modules in a course
    router.get('/modules', async (req, res, next) => {
        const resp = await coursesServices.getCourseModules(req.query.course);
        res.json(resp);
    });

    // get all info for all modules in a course
    // router.get('/course-students', async (req, res, next) => {
    //     const resp = await coursesServices.getCourseStudents(req.query.course);
    //     res.json(resp);
    // });

    router.get('/page', async (req, res, next) => {
        //console.log(req.query);
        const resp = await coursesServices.getPage(req.query.course, req.query.module, req.query.page);
        res.json(resp);
    });

    // get all the courses that a student is enrolled in
    // router.get('/student-courses', async (req, res, next) => {
    //     const resp = await coursesServices.getMyCourses(req.decoded);
    //     res.json(resp);
    // })

    // get all the courses that a student is enrolled in
    router.get('/student-courses', passport.authenticate('jwt', {session: true}), async (req, res, next) => {
        const resp = await coursesServices.getMyCourses(req.user);
        res.json(resp);
    })

    // get whether a student is enrolled in a particullar course
    // router.get('/student-has-course', jwtMiddleware, async (req, res, next) => {
    //     const resp = await coursesServices.studentHasCourse(req.decoded, req.query.course);
    //     console.log('STUDENT HAS COURSE:  ' + resp);
    //     res.json(resp);
    // });

    // get whether a student is enrolled in a particullar course
    router.get('/student-has-course', passport.authenticate('jwt', {session:true}), async (req, res, next) => {
        const resp = await coursesServices.studentHasCourse(req.user, req.query.course);
        res.json(resp);
    });


    // get a student's grades for a particular course
    router.get('/student-grades', async(req, res, next) => {
        const resp = await coursesServices.getStudentGrades(req.query.course, req.query.student);
        res.json(resp);
    });

    router.post('/update-course', passport.authenticate('jwt', {session: true}), async(req, res, next) => {
        const resp = await coursesServices.updateCourse(req.body.course);
        res.json(resp);
        Utils.AdminLog(req.user, {method: coursesServices.updateCourse.name, params: [req.body.course], result: resp}, "Updating Course Information.");
    });

    router.post('/remove-content', passport.authenticate('jwt', {session: true}), async(req, res, next) => {
        const resp = await coursesServices.removeContent(req.body.course, req.body.module, req.body.content);
        res.json(resp);
        Utils.AdminLog(req.user, {method: coursesServices.removeContent.name, params: [req.body.course, req.body.module, req.body.content], result: resp}, "Removing Course Content.");
    });

    router.get('/course-module', async(req, res, next) => {
        const resp = await coursesServices.getModule(req.query.course, req.query.module);
        res.json(resp);
    });

    router.post('/update-discussion', passport.authenticate('jwt', {session: true}), async(req, res, next) => {
        const resp = await coursesServices.updateDiscussion(req.body.course, req.body.discussion);
        res.json(resp);
        Utils.AdminLog(req.user, {method: coursesServices.updateDiscussion.name, params: [req.body.course, req.body.discussion], result: resp}, "Updating Course Discussion.");
    });

    router.post('/remove-discussion', passport.authenticate('jwt', {session: true}), async(req, res, next) => {
        const resp = await coursesServices.removeDiscussion(req.body.course, req.body.discussion);
        res.json(resp);
        Utils.AdminLog(req.user, {method: coursesServices.removeDiscussion.name, params: [req.body.course, req.body.discussion], result: resp}, "Removing Course Discussion.");
    });

    router.get('/registered-students', passport.authenticate('jwt', {session: true}), async(req, res, next) => {
        const resp = await coursesServices.getRegistered(req.query.course);
        res.json(resp);
    });

    router.post('/signup', async(req, res, next) => {
        const resp = await coursesServices.signUpFor(req.body.student, req.body.course);
        res.json(resp);
    });


    router.get('/course-students', async(req, res, next) => {
        const resp = await coursesServices.getStudents(req.query.course, req.query.student);
        res.json(resp);
    });

    // router.get('/course-students', jwtMiddleware, async (req, res, next) => {
    //     const resp = await coursesServices.getStudents(req.query.course, req.decoded);
    //     res.json(resp);
    // });

    // get courses
    router.get('/courses', async (req, res, next) => {
        const resp = await coursesServices.getAllCourses();
        res.json(resp);
    });

    router.get('/waiting-list-size', async(req, res, next) => {
        const resp = await coursesServices.waitingListSize(req.query.course);
        res.json(resp);
    });

    router.post('/remove-registree', passport.authenticate('jwt', {session: true}), async(req, res, next) => {
        const resp = await coursesServices.removeRegistree(req.body.student, req.body.course);
        res.json(resp);
        Utils.AdminLog(req.user, {method: coursesServices.removeRegistree.name, params: [req.body.student, req.body.course], result: resp}, "Removing Course Registree.");
    });

    router.post('/confirm-enrollment', passport.authenticate('jwt', {session: true}), async(req, res, next) => {
        const resp = await coursesServices.confirmEnrollment(req.body.student, req.body.course);
        res.json(resp);
        Utils.AdminLog(req.user, {method: coursesServices.confirmEnrollment.name, params: [req.body.student, req.body.course], result: resp}, "Confirming Student Enrollment.");
    });

    router.get('/course-students-2', passport.authenticate('jwt', {session: true}), async(req, res, next) => {
        const resp = await coursesServices.getCourseStudent(req.query.course);
        res.json(resp);
    });

    router.get('/module-quiz', async(req, res, next) => {
        const resp = await coursesServices.getQuiz(req.query.course, req.query.module, req.query.quiz);
        res.json(resp);
    });

    router.post('/set-start-time', async(req, res, next) => {
        const resp = await coursesServices.setQuizStartTime(req.body.student, req.body.course, req.body.quiz);
        res.json(resp);
    });

    router.post('/submit-quiz', async(req, res, next) => {
        const resp = await coursesServices.submitQuizForGrade(req.body.student, req.body.course, req.body.module, req.body.quiz, req.body.responses);
        res.json(resp);
    });

    router.get('/student-record', async(req, res, next) => {
        const resp = await coursesServices.getStudentRecord(req.query.student, req.query.course, req.query.quiz);
        res.json(resp);
    });

    router.get('/quiz-info', async(req, res, next) => {
        const resp = await coursesServices.getQuizInfo(req.query.course, req.query.module, req.query.quiz);
        res.json(resp);
    });

    router.post('/save-responses', async(req, res, next) => {
        const resp = await coursesServices.saveResponses(req.body.student, req.body.course, req.body.quiz, req.body.responses);
        res.json(resp);
    });

    router.get('/courses-by', async(req, res, next) => {
        const resp = await coursesServices.getCoursesPage(req.query.sort, Number(req.query.start));
        res.json(resp);
    });

    router.get('/courses-cat-by', async(req, res, next) => {
        const resp = await coursesServices.getCoursesPageByCategory(req.query.category, req.query.sort, Number(req.query.start));
        res.json(resp);
    });

    router.get('/admin-courses', passport.authenticate('jwt', {session: true}), async (req, res, next) => {
        const resp = await coursesServices.getAdminCourses(req.user);
        res.json(resp);
    });

    router.get('/can-register', async (req, res, next) => {
        const resp = await coursesServices.canRegister(req.query.student, req.query.course);
        res.json(resp);
    });

    return router;
}
// router.post('/add-course', passport.authenticate('jwt', {session: true}), async (req, res, next) => {
//     const resp = await coursesServices.addCourse(req.body.course);
//     res.json(resp);
// });
//
// // add course discussion to course
// router.post('/add-course-discussion', passport.authenticate('jwt', {session: true}), jwtMiddleware, async (req, res, next) => {
//     const resp = await coursesServices.addDiscussion(req.body.course, req.body.discussion);
//     res.json(resp);
// });
//
// // add post to a discussion
// router.post('/add-discussion-post', async (req, res, next) => {
//     const resp = await coursesServices.addDiscussionPost(req.body.course, req.body.discussion, req.body.post);
//     res.json(resp);
// });
//
// // add module to a course
// router.post('/add-module', passport.authenticate('jwt', {session: true}), async (req, res, next) => {
//     const resp = await coursesServices.addCourseModule(req.body.course, req.body.module);
//     res.json({success: resp});
// });
//
// // add link content to module
// router.post('/add-module-link', passport.authenticate('jwt', {session: true}), async (req, res, next) => {
//     const resp = await coursesServices.addModuleLink(req.body.course, req.body.module, req.body.content);
//     res.json({success: resp});
// });
//
// // add quiz content to module
// router.post('/add-module-quiz', passport.authenticate('jwt', {session: true}), async (req, res, next) => {
//     const resp = await coursesServices.addModuleQuiz(req.body.course, req.body.module, req.body.content);
//     res.json({success: resp});
// });
//
// // add external link to module
// router.post('/add-module-url', passport.authenticate('jwt', {session: true}), async (req, res, next) => {
//     const resp = await coursesServices.addModuleUrl(req.body.course, req.body.module, req.body.content);
//     res.json({success: resp});
// });
//
// router.post('/add-module-content', passport.authenticate('jwt', {session: true}), async (req, res, next) => {
//     const resp = await coursesServices.addModuleContent(req.body.course, req.body.module, req.body.content);
//     res.json(resp);
// });
//
// // get course catergories
// router.get('/categories', async (req, res, next) => {
//     const resp = await coursesServices.getAllCategories();
//     res.json(resp);
// });
//
// // debug get all data associated with a course
// router.get('/course', passport.authenticate('jwt', {session: true}), async (req, res, next) => {
//     const resp = await coursesServices.getCourse(req.query.key);
//     res.json(resp);
// });
//
// // get info for a course
// router.get('/course-info', async (req, res, next) => {
//     const resp = await coursesServices.getCourseInfo(req.query.key);
//     res.json(resp);
// });
//
// // get all courses infos
// router.get('/courses', async ( req, res, next) => {
//     const resp = await coursesServices.getAllCourses();
//     res.json(resp);
// });
//
// // get course discussions
// router.get('/course-discussions', async (req, res, next) => {
//     const resp = await coursesServices.getDiscussions(req.query.course);
//     res.json(resp);
// });
//
// // get course discussion info
// router.get('/course-discussion-info', async (req, res, next) => {
//     const resp = await coursesServices.getDiscussionInfo(req.query.course, req.query.discussion);
//     res.json(resp);
// });
//
// // get all posts from a discussion
// router.get('/discussion-posts', async (req, res, next) => {
//     const resp = await coursesServices.getDiscussionPosts(req.query.course, req.query.discussion);
//     res.json(resp);
// });
//
// // get upto 50 posts from a discussion starting from start element
// router.get('/discussion-posts-from', async (req, res, next) => {
//     const resp = await coursesServices.getDiscussionPostsFrom(req.query.course, req.query.discussion, Number(req.query.start));
//     res.json(resp);
// });
//
// // get all info for all modules in a course
// router.get('/modules', async (req, res, next) => {
//     const resp = await coursesServices.getCourseModules(req.query.course);
//     res.json(resp);
// });
//
// // get all info for all modules in a course
// // router.get('/course-students', async (req, res, next) => {
// //     const resp = await coursesServices.getCourseStudents(req.query.course);
// //     res.json(resp);
// // });
//
// router.get('/page', async (req, res, next) => {
//     //console.log(req.query);
//     const resp = await coursesServices.getPage(req.query.course, req.query.module, req.query.page);
//     res.json(resp);
// });
//
// // get all the courses that a student is enrolled in
// router.get('/student-courses', jwtMiddleware, async (req, res, next) => {
//     const resp = await coursesServices.getMyCourses(req.decoded);
//     res.json(resp);
// })
//
// // get whether a student is enrolled in a particullar course
// router.get('/student-has-course', jwtMiddleware, async (req, res, next) => {
//     const resp = await coursesServices.studentHasCourse(req.decoded, req.query.course);
//     console.log(resp);
//     res.json(resp);
// });
//
// // get a student's grades for a particular course
// router.get('/student-grades', async(req, res, next) => {
//     const resp = await coursesServices.getStudentGrades(req.query.course, req.query.student);
//     res.json(resp);
// });
//
// router.post('/update-course', passport.authenticate('jwt', {session: true}), async(req, res, next) => {
//     const resp = await coursesServices.updateCourse(req.body.course);
//     res.json(resp);
// });
//
// router.post('/remove-content', passport.authenticate('jwt', {session: true}), async(req, res, next) => {
//     const resp = await coursesServices.removeContent(req.body.course, req.body.module, req.body.content);
//     res.json(resp);
// });
//
// router.get('/course-module', async(req, res, next) => {
//     const resp = await coursesServices.getModule(req.query.course, req.query.module);
//     res.json(resp);
// });
//
// router.post('/update-discussion', passport.authenticate('jwt', {session: true}), async(req, res, next) => {
//     const resp = await coursesServices.updateDiscussion(req.body.course, req.body.discussion);
//     res.json(resp);
// });
//
// router.post('/remove-discussion', passport.authenticate('jwt', {session: true}), async(req, res, next) => {
//     const resp = await coursesServices.removeDiscussion(req.body.course, req.body.discussion);
//     res.json(resp);
// });
//
// router.get('/registered-students', passport.authenticate('jwt', {session: true}), async(req, res, next) => {
//     const resp = await coursesServices.getRegistered(req.query.course);
//     res.json(resp);
// });
//
// router.post('/signup', async(req, res, next) => {
//     const resp = await coursesServices.signUpFor(req.body.student, req.body.course);
//     res.json(resp);
// });
//
//
// router.get('/course-students', jwtMiddleware, async (req, res, next) => {
//     const resp = await coursesServices.getStudents(req.query.course, req.decoded);
//     res.json(resp);
// });
//
// // get courses
// router.get('/courses', async (req, res, next) => {
//     const resp = await coursesServices.getAllCourses();
//     res.json(resp);
// });
//
// router.get('/waiting-list-size', async(req, res, next) => {
//     const resp = await coursesServices.waitingListSize(req.query.course);
//     res.json(resp);
// });
//
// router.post('/remove-registree', passport.authenticate('jwt', {session: true}), async(req, res, next) => {
//     const resp = await coursesServices.removeRegistree(req.body.student, req.body.course);
//     res.json(resp);
// });
//
// router.post('/confirm-enrollment', passport.authenticate('jwt', {session: true}), async(req, res, next) => {
//     const resp = await coursesServices.confirmEnrollment(req.body.student, req.body.course);
//     res.json(resp);
// });
//
// router.get('/course-students', passport.authenticate('jwt', {session: true}), async(req, res, next) => {
//     const resp = await coursesServices.getCourseStudent(req.query.course);
//     res.json(resp);
// });
//
// router.get('/module-quiz', async(req, res, next) => {
//     const resp = await coursesServices.getQuiz(req.query.course, req.query.module, req.query.quiz);
//     res.json(resp);
// });
//
// router.post('/set-start-time', async(req, res, next) => {
//     const resp = await coursesServices.setQuizStartTime(req.body.student, req.body.course, req.body.quiz);
//     res.json(resp);
// });
//
// router.post('/submit-quiz', async(req, res, next) => {
//     const resp = await coursesServices.submitQuizForGrade(req.body.student, req.body.course, req.body.module, req.body.quiz, req.body.responses);
//     res.json(resp);
// });
//
// router.get('/student-record', async(req, res, next) => {
//     const resp = await coursesServices.getStudentRecord(req.query.student, req.query.course, req.query.quiz);
//     res.json(resp);
// });
//
// router.get('/quiz-info', async(req, res, next) => {
//     const resp = await coursesServices.getQuizInfo(req.query.course, req.query.module, req.query.quiz);
//     res.json(resp);
// });
//
// router.post('/save-responses', async(req, res, next) => {
//     const resp = await coursesServices.saveResponses(req.body.student, req.body.course, req.body.quiz, req.body.responses);
//     res.json(resp);
// });
//
// router.get('/courses-by', async(req, res, next) => {
//     const resp = await coursesServices.getCoursesPage(req.query.sort, Number(req.query.start));
//     res.json(resp);
// });
//
// router.get('/admin-courses', passport.authenticate('jwt', {session: true}), async (req, res, next) => {
//     const resp = await coursesServices.getAdminCourses(req.user);
//     res.json(resp);
// });