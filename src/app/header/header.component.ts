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
  isAuth: string
  name: string

  constructor(
    public storageService: StorageService,
    private authService: AuthService,
    private router: Router){
  }

  ngOnInit(): void {
  }
  
  logout() {
    this.authService.logout()
    this.storageService.logout()
    this.storageService.deleteToken()
    this.router.navigate(['/login'])
    window.location.reload()
  }
}

