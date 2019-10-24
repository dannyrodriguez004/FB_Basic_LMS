// import {
//   CanActivate,
//   ActivatedRouteSnapshot,
//   RouterStateSnapshot,
//   Router
// } from '@angular/router';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { UsertypeModel } from '../models/usertype.model';
// import {AuthenticationService} from '../services/authentication.service';

// @Injectable()
// export class AuthGuard implements CanActivate {
  // constructor(private authService: AuthenticationService, private router: Router) {}
  // constructor(private router: Router) {}
  //
  // // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot
  // // ): boolean | Observable<boolean> | Promise<boolean> {
    // const isAuth = this.authService.getIsAuth();
    // if (!isAuth) {
    //   this.router.navigate(['/login']);
    // }
    // return isAuth;
//   }
// }

// import { Injectable } from '@angular/core';
// import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// import { AuthenticationService } from '../services/authentication.service';
// import { UsertypeModel } from '../models/usertype.model';
//
// @Injectable({ providedIn: 'root' })
// export class AuthGuard implements CanActivate {
//   constructor(
//     private router: Router,
//     private authenticationService: AuthenticationService
//   ) { }
//
//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
//     const currentUser = this.authenticationService.currentUserValue;
//
//     if (route.data.roles) { // has roles
//       if (route.data.roles.indexOf(UsertypeModel.Guest) === -1) { // not for guests
//         if (currentUser) { // user logged in
//           if (route.data.roles.indexOf(currentUser.user) === -1) { // user doesn't have permission
//             this.router.navigate(['/']);
//             return false;
//           } else { // user has permission
//             return true;
//           }
//         } else { // user not logged in
//           this.router.navigate(['/login']);
//           return false;
//         }
//       } else { // only for guests
//         if (currentUser) { // user logged in
//           this.router.navigate(['/']);
//         } else { // user not logged in
//           return true;
//         }
//       }
//     }
//
//     return true; // route doesn't have role guards
//   }
// }
