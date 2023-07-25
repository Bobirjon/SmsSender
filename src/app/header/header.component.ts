import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  loginStatus: any
  IsLoggedIn$: any

  constructor(
    private storageService: StorageService,
    private authService: AuthService,){
  }

  ngOnInit(): void {
    this.IsLoggedIn$ = this.storageService.isLoggedIn$

    if(this.storageService.getToken() == null) {
      this.loginStatus = false
    } else {
      this.loginStatus = true
    }
  }

  logout() {
    this.authService.logout()
      .subscribe((res) => {
        console.log(res);
      })
    this.storageService.deleteToken()
  }

}

