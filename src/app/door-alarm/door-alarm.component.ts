import {HttpClient} from '@angular/common/http';
import {Component, ViewChild, AfterViewInit, inject, OnInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, elementAt, map, startWith, switchMap} from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { DialogExitContentComponent } from './dialogExit'
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DialogCommentContentComponent } from './dialogComment';
import { AddNewElementComponent } from './add-new-element/add-new-element.component';
import { UserCreateComponent } from './user-create/user-create.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-door-alarm',
  templateUrl: './door-alarm.component.html',
  styleUrls: ['./door-alarm.component.css']
})
export class DoorAlarmComponent implements OnInit , AfterViewInit  {
  private httpClient = inject(HttpClient)

  displayedColumns: string[] = [
    'sitename', 'worktype', 'entertime', 'visitor__username', 
    'organization', 'visitor__phonenumber', 'exittime', 'comment'];
  exampleDatabase: AuthService | null
  dataSource = new MatTableDataSource<any>
  allData: any

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  pageSize = [15, 30, 50, 100]
  pageNumber: any
  limit: any = 1000
  dataToExport: any[] = [];

  doorControlForm: FormGroup

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder, public dialog: MatDialog) {
    this.doorControlForm = this.fb.group({
      region: [''],
      sitename: [''],
      worktype: [''],
      entertime: [''],
      username: [''],
      organization: [''],
      number: [''],
    })
  }

  ngAfterViewInit(): void {
    this.exampleDatabase = new AuthService(this.httpClient)

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0)

    merge(
      this.doorControlForm.valueChanges,
      this.sort.sortChange, 
      this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          var sortDirection: any = this.sort.direction == 'desc' ? '-' : ''

          var sitename = this.doorControlForm.value.sitename == null ? '' : this.doorControlForm.value.sitename
          var worktype = this.doorControlForm.value.worktype == null ? '' : this.doorControlForm.value.worktype
          var entertime = this.doorControlForm.value.entertime == null ? '' : this.doorControlForm.value.entertime
          var username = this.doorControlForm.value.username == null ? '' : this.doorControlForm.value.username
          var organization = this.doorControlForm.value.organization == null ? '' : this.doorControlForm.value.organization
          var number = this.doorControlForm.value.number == null ? '' : this.doorControlForm.value.number
          var regions = this.doorControlForm.value.region
          console.log(this.doorControlForm.value.region);
          
          
          return this.exampleDatabase!.getDoorOpen(
            sitename, worktype, entertime, username, organization,
            number, regions, this.sort.active, sortDirection,
            this.paginator.pageIndex + 1, this.paginator.pageSize
          ).pipe(catchError(() => observableOf(null)))
        }),
        map((data: any) => {
          this.isLoadingResults = false
          this.isRateLimitReached = data === null

          if (data === null) {
            return[]
          }

          this.resultsLength = data.count
          return data.results
        })
      )
      .subscribe((data: any) => (this.dataSource = data))
  }

  editExitTime(element: any) {
    console.log(element);
    const dialogRef = this.dialog.open(DialogExitContentComponent, {
      width: '300px',
      data : element
    })

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      
      if(result && result.userdata !== undefined) {
        window.location.reload()
      }
    })
  }

  onComment(element: any) {
    const dialogRef = this.dialog.open(DialogCommentContentComponent, {
      width: '300px',
      data : element
    })
    
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      if(result && result.userdata !== undefined) {
        window.location.reload()
      }
    })
  }

  onCreate() {
    const dialogRef = this.dialog.open(AddNewElementComponent, {
      width: '800px'
    })

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      
    })
  }

  onCreateUser() {
    const dialogRef = this.dialog.open(UserCreateComponent, {
      width: '800px'
    })

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      
    })
  }



  onExport() {
    this.exampleDatabase.getDoorOpenExport(1, this.limit)
    .subscribe((res: any) => {
      this.pageNumber = Math.ceil(res.count / res.results.length)

      const promises = [];
      for (let i = 1; i <= this.pageNumber; i++) {
        promises.push(this.exampleDatabase.getDoorOpenExport( i, this.limit).toPromise());
      }

      Promise.all(promises).then(results => {
        console.log(results);
        results.forEach((res: any) => {
          this.dataToExport = this.dataToExport.concat(res.results)
          console.log(this.dataToExport);
          
          
        });
        const transformedData = this.dataToExport.map((item: any) => ({
          sitename: item.sitename,
          worktype: item.worktype,
          visitorName: item.visitor.username,
          visitorNumber: item.visitor.phonenumber,
          visitorOrganization:item.visitor.organization,
          region: item.region,
          entertime: item.entertime,
          exittime: item.exittime
        }))
        
        this.convertToExcel(transformedData)
      });
    })
  }


  convertToExcel(data: any[]) {

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const url = e.target.result;
      const a = document.createElement('a');
      a.href = url;
      a.download = 'data.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    reader.readAsDataURL(blob);

    
  }


  ngOnInit(): void {

  }
}
