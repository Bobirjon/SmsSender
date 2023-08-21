import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isAdmin(route);
  }

  private isAdmin(route: ActivatedRouteSnapshot): boolean {
    const roles = localStorage.getItem('role')
    const expectedRoles = route.data.expectedRoles;
    
    if(roles != expectedRoles) {
      return false
    }
    return true
  }
  
}
