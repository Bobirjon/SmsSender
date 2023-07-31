import { Injectable } from "@angular/core";
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot,
	UrlTree
} from "@angular/router";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private router: Router) { }
	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): boolean | Promise<boolean> {
			if(localStorage.getItem('loggedIn') == 'false') {
				this.router.navigate(['login'])
				return false
			}
			return true
	}
}
