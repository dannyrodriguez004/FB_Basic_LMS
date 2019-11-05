import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private cookies: CookieService,
    private router: Router,
    ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      let nextPath = next.url[0].path

      console.log(next.url.toString());

      if(nextPath === 'login' || nextPath === 'nav' 
      || nextPath === 'courses' && next.url.length == 1 || nextPath === 'helppage' 
      || nextPath === 'home') {
        return true;
      } else {
        const IS_USER = this.cookies.check('admin-session');
        if(!IS_USER) {
         this.router.navigate(['/nav/security/login']);
        }
        return IS_USER;
      }
  }
  
}
