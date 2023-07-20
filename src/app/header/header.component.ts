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
  isLoged: boolean
  hide: any

  constructor(
    private storageService: StorageService,
    private authService: AuthService){
  }

  ngOnInit(): void {
    
    this.hide = this.storageService.getToken()
    if(this.hide != null) {
      this.isLoged = true
    } else {
      this.isLoged = false
    }
  }

  logout() {
    this.authService.logout()
      .subscribe(() => {})
      
    this.storageService.deleteToken()  
  }

}

