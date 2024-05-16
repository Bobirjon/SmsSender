import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth.service';
import { of as observableOf } from 'rxjs';

@Component({
  selector: 'app-correction',
  templateUrl: './correction.component.html',
  styleUrls: ['./correction.component.css']
})
export class CorrectionComponent implements OnInit, AfterViewInit {

  dataSource = new MatTableDataSource<any>(); // Data source for the Material table
  displayedColumns = ['id', 'username', 'sentTime', 'alarmreportID', 'smsType']; // Columns to be displayed
  totalItems = 0; // Total number of items (from the response)

  isLoading: boolean = false

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Reference to the paginator
  resultArray: any;

  constructor(private authService: AuthService) {
  }

  getCorrectionList(pageIndex: number, pageSize: number) {
    return this.authService.getCorrection(pageIndex, pageSize)
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // Link paginator to the data source
    this.paginator.page
    .pipe(
      startWith({}),
      switchMap(() => {
        Promise.resolve().then(()=> this.isLoading = true)
        return this.getCorrectionList(
          this.paginator.pageIndex + 1,
          this.paginator.pageSize
        ).pipe(catchError(() => observableOf(null)));
      }),
      map((corList: any) => {
        if (corList == null) return [];
        this.totalItems = corList.count;
        console.log(corList);
        
        Promise.resolve().then(()=> this.isLoading = false)
        
        return corList.results;
        
      })
    )
    .subscribe((corData: any) => {
      
      this.authService.getUsers().subscribe((users: any)=> {
        this.gettingUsername(users, corData)
        this.dataSource = new MatTableDataSource(this.resultArray);
      })
      
    });
  }


  ngOnInit() {
   
  }

  gettingUsername(usernames: any, kpis: any) {

    this.resultArray = kpis.map((kpi: any) => {
      
      const userName = usernames.results.find((value: any) => value.id == kpi.user)
     
      if (userName) {
        return {
          id: userName.id,
          smsLogId: kpi.id,
          username: userName.username,
          sentTime: kpi.sent_time,
          alarmreport: kpi.alarmreport,
          smsType: kpi.sms_type,
        }
      }
    }).filter(Boolean)
  }

  changeCorrectionType(row: any) {

    let body = { 
      sms_type: row.smsType.replace('коррекция', 'коррекИнформатор')
    }
    this.authService.changeCorrectionType(row.smsLogId, body).subscribe((res: any) => {
      console.log(res);
    
      
    })
    
  }

}
