// import { Injectable } from "@angular/core";
// import {
// 	ActivatedRouteSnapshot,
// 	CanActivate,
// 	Router,
// 	RouterStateSnapshot,
// } from "@angular/router";

// @Injectable()
// export class AuthGuard implements CanActivate {
// 	constructor(
// 		private router: Router) { }
// 	canActivate(
// 		route: ActivatedRouteSnapshot,
// 		state: RouterStateSnapshot): boolean | Promise<boolean> {
// 			if(localStorage.getItem('loggedIn') === 'false' ) {
// 				console.log(localStorage.getItem('loggedIn'));
// 				console.log(localStorage.length);
				
// 				console.log('empty ');
				
// 				this.router.navigate(['login'])
// 				return false
// 			}
// 			return true
// 	}
// }

import { Injectable } from "@angular/core";
import { CanActivate, Router} from "@angular/router";

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	constructor(private router: Router) {}

	canActivate() {
		if(localStorage.getItem('token') == null) {
			this.router.navigate(['login'])
			return false
		} else {
			return true
		}
	}
}