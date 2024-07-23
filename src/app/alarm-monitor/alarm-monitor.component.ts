import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-alarm-monitor',
  templateUrl: './alarm-monitor.component.html',
  styleUrls: ['./alarm-monitor.component.css']
})
export class AlarmMonitorComponent implements OnInit {
  data: any[] = [
    {siteName: 'TS2020', alarmTime: '04.04.4044', alarmNumber: '123456', alarmText: 'TESTING ALARM'},
    {siteName: 'TS2020', alarmTime: '04.04.4044', alarmNumber: '123456', alarmText: 'TESTING ALARM'},
    {siteName: 'TS2020', alarmTime: '04.04.4044', alarmNumber: '123456', alarmText: 'TESTING ALARM'},
    {siteName: 'TS2020', alarmTime: '04.04.4044', alarmNumber: '123456', alarmText: 'TESTING ALARM'}
  ]

  displayedData: any[] = [];

  CurrentAlarm: any[] = []
  cellDown: any[] = []
  chronicSites: any[] = []

  cellDownFilter: FormGroup

  constructor(private authService: AuthService, private fb: FormBuilder) {

    this.cellDownFilter = this.fb.group({
      power: [''],
      dg: [''],
      battery: [''],
      comment: [''],
      alarmType: [''],
      siteName: ['']
    })

    this.cellDownFilter.valueChanges.subscribe((res: any) => {
      this.fetchApi(res.power, res.dg, res.battery, res.comment, res.alarmType, res.siteName)
    })

  }

  fetchApi(power: string, dg: string, battery: string, comment: string, alarmType: string, siteName: string) {
    this.authService.getCellDown(power, dg, battery, comment, alarmType, siteName).subscribe((res: any) => {
      this.cellDown = res
    })
  }

  ngOnInit(): void {
    this.fetchApi(this.cellDownFilter.value.power,this.cellDownFilter.value.dg,
                  this.cellDownFilter.value.battery,this.cellDownFilter.value.comment,
                  this.cellDownFilter.value.alarmType, this.cellDownFilter.value.siteName)
  }

}
