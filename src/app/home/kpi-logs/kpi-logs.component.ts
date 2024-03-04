import { Component, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-kpi-logs',
  templateUrl: './kpi-logs.component.html',
  styleUrls: ['./kpi-logs.component.css']
})
export class KpiLogsComponent {
  LogData = new MatTableDataSource<any>()
  LogColumns: string[] = [
    'name', 'alarmreport', 'level', 'sent_time', 
    'send_duration','type', 'sms_type'
  ]
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authservice: AuthService
    ) {
      
      this.authservice.getLog().subscribe((response: any) => {
        console.log(response);
        
        const result = response.filter((res: any) =>
          res.user == data.id 
        )
        this.LogData.data = result
        this.LogData.sort = this.sort
      })   
  }
  
  
}
