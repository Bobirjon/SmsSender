import { Injectable } from "@angular/core";
import { CanActivate, Router} from "@angular/router";

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	constructor(private router: Router) {	}

	canActivate() {
		if(localStorage.getItem('token') == null) {
			console.log('heelo is not auth');
			this.router.navigate(['login'])
			return false
		} else {
			return true
			
		}
	}
}