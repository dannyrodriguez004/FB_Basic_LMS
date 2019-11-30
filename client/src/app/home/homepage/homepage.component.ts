import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  admins = [
    {name: 'Danny Rodriguez', phone: '(305)-439-1452', email: 'drodr518@fiu.edu'},
    {name: 'Joao Guiramaes', phone: '(754)-242-1096', email: 'jguim002@fiu.edu'}
  ];

  constructor() { }

  ngOnInit() {
  }

}

// import { Component, OnInit } from '@angular/core';
// import {UserService} from '../../services/user.service';
// import {CoursesService} from '../../services/courses.service';
// import {BehaviorSubject} from 'rxjs';
// import {CourseNav} from '../../models/courses.models';
// import {UserModel} from '../../models/usermodel.models';
// import {Subscription} from 'rxjs/internal/Subscription';
// import {FBRegisterComponent} from '../../nav/fbregister/fbregister.component';
// import {UsertypeModel} from '../../models/usertype.model';
// import {MatDialog} from '@angular/material/dialog';
//
// @Component({
//   selector: 'app-homepage',
//   templateUrl: './homepage.component.html',
//   styleUrls: ['./homepage.component.scss']
// })
// export class HomepageComponent implements OnInit {
//
//   myCourses: CourseNav[] = []; // the user's courses names and id
//   user: UserModel;
//   adminCourses: CourseNav[] = [];
//   // tslint:disable-next-line:variable-name
//   private subscriptions: Subscription[] = [];
//   loggedIn;
//   loading = false;
//   private isRegistered: boolean;
//   admins = [
//     {name: 'Danny Rodriguez', phone: '(305)-439-1452', email: 'drodr518@fiu.edu'},
//     {name: 'Joao Guiramaes', phone: '(999)-999-9999', email: 'xxxxxx@fiu.edu'},
//   ];
//
//   constructor(private userServices: UserService,
//               private coursesServices: CoursesService,
//               private dialog: MatDialog,
//   ) {
//     const jwtToken = this.userServices.getToken();
//     this.loggedIn = new BehaviorSubject<boolean>(!!jwtToken);
//     // const jwtCookie = this.userServices.isTokenFresh('admin-session');
//     // this.adminLoggedIn = new BehaviorSubject<boolean>(!!jwtCookie);
//     this.userServices.resetUserModel();
//   }
//
//   doLogin() {
//     this.userServices.submitLogin();
//     this.userServices.FBLoggedIn.subscribe(bool => {
//       console.log('############### FBLoggedIn changed to ' + bool);
//       this.loggedIn.next(true);
//       this.subscriptions.push(this.userServices.getCurrentUser().subscribe((resp: any) => {
//         console.log(resp);
//         this.loadCourses();
//         if (!resp.registered) {
//           this.isRegistered = false;
//           this.openRegisterStudentDialog();
//         } else {
//           this.isRegistered = true;
//           console.log('AFTER DO LOGIN', resp.user_info);
//           // window.localStorage.user_info = JSON.stringify(resp.user_info);
//         }
//       }));
//     });
//   }
//
//   openRegisterStudentDialog() {
//     this.dialog.closeAll();
//     const dialogRef = this.dialog.open(FBRegisterComponent, {
//       width: '90%',
//       data: {
//         id: this.userServices.fbUser().id,
//         first_name: this.userServices.fbUser().first_name,
//         last_name: this.userServices.fbUser().last_name,
//         email: this.userServices.fbUser().email,
//         type: UsertypeModel.Student
//       }
//     });
//
//     this.subscriptions.push(dialogRef.afterClosed().subscribe( (result) => {
//       if (result) {
//         this.isRegistered = true;
//         console.log(result);
//       }
//     }));
//   }
//   /**
//    * Load courses, id and name, for the current user.
//    */
//   loadCourses() {
//     // if (this.loggedIn.value || this.adminLoggedIn.value) {
//     if (this.loggedIn.value || this.isAdmin()) {
//       if (this.loggedIn.value) {
//         console.log('IN LOAD COURSES FOR STUDENT IN NAVBAR');
//         this.subscriptions.push(this.coursesServices.getStudentCourses().subscribe((resp: CourseNav[]) => {
//           this.myCourses = resp;
//         }));
//       }
//     }
//     if (this.isAdmin()) {
//       console.log('IN LOAD COURSES FOR ADMIN IN NAVBAR');
//       // this.adminLoggedIn.next(true);
//       this.subscriptions.push(this.coursesServices.getAdminCourses().subscribe((resp: CourseNav[]) => {
//         console.log(resp);
//         this.adminCourses = resp;
//       }));
//     }
//   }
//
//
//   isAdmin() {
//     return this.userServices.getIsAdmin();
//   }
//
//   ngOnInit() {
//   }
//
// }
