import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { UserService} from '../../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private authorized: boolean;

  constructor(
    private cookies: CookieService,
    private router: Router,
    private userServices: UserService,
) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const nextPath = next.url[0].path;
    console.log(next.url.toString());

    if (nextPath === 'login' || nextPath === 'nav'
      || nextPath === 'courses' && next.url.length === 1 || nextPath === 'helppage'
      || nextPath === 'home') {
      this.authorized = true;
      return this.authorized;
      } else {
        const IS_USER = this.cookies.check('admin-session') || this.userServices.fbUser() != null;
        const FB_USER = this.userServices.fbUser();
        if ( !IS_USER ) {
         if (FB_USER) {
           this.authorized = true;
           return this.authorized;
         } else {
           this.authorized = false;
           this.router.navigate(['/nav/security/login']);
           return this.authorized;
         }
       }
        return this.authorized;
      }
  }
}
