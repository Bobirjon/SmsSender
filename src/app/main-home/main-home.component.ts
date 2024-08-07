import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-home',
  templateUrl: './main-home.component.html',
  styleUrls: ['./main-home.component.css']
})
export class MainHomeComponent {

  constructor(private router: Router) {}

  smsSender() {
    this.router.navigate(['senderHome'])
  }

  cellDownBybands() {
    this.router.navigate(['alarmMonitor'])
  }

  doorAlarm() {
    this.router.navigate(['doorAlarm'])
  }

  cellDown() {
    this.router.navigate(['cellDown'])
  }

}
