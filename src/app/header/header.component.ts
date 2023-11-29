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

  isLoggedIn$ = this.storageService.isAuth$
  username$ = this.storageService.username$

  constructor(
    private storageService: StorageService,
    private authService: AuthService,){
  }

  ngOnInit(): void {
    console.log(this.isLoggedIn$);
    
  }
  
  logout() {
    this.authService.logout()
    this.storageService.logout()
    this.storageService.deleteToken()
  }
}

