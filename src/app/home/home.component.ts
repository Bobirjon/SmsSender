import { Component, OnInit, forwardRef } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  Data: any
  Loaded = true
  CurrentRoute = this.router.url
  isComplete: boolean
  name: any
  displayedColumns: string[] = [
    'Level',
    'type',
    'created_at',
    'reason',
    'description',
    'problem',
    'influence',
    'region',
    'start_time',
    'user',
    'actions'
    ];
  user: any;
  hidden: any

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService) { }

  ngOnInit(): void {

    this.authService.getData()
      .subscribe(res => {
        this.Data = res
        console.log(res);
        
      })

    this.authService.getUser()
      .subscribe(result => {
        console.log(result);
        
        this.user = result
      })


  }

  onRN() {
    this.Loaded = !this.Loaded
    this.router.navigate(['home/rn'])
  }

  onCN() {
    this.Loaded = !this.Loaded
    this.router.navigate(['home/cn'])
  }

  onEdit() {
    this.Loaded = !this.Loaded
  }

}
