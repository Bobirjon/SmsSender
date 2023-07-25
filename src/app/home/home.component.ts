import { Component, OnInit, ViewChild,  } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { MatSort, Sort  } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  Data: any
  Loaded: boolean;
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

  @ViewChild(MatSort) sort: MatSort
   
  constructor(
    private authService: AuthService,
    private router: Router,) { }

  ngOnInit(): void {
    
    if(this.router.url == '/home') {
      this.Loaded = true
    } else {
      this.Loaded = false
    }

    this.authService.getData()
      .subscribe(res => {
        this.Data = res
        this.Data.sort = this.sort
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
