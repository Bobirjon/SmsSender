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
			console.log(localStorage.length);
			
			if(localStorage.getItem('loggedIn') == 'false' || localStorage.length == 0) {
				this.router.navigate(['login'])
				return false
			}
			return true
	}
}
