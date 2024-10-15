import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, FormsModule, NgForm } from '@angular/forms';
import { Subscription, catchError, map, of, merge, startWith, switchMap } from 'rxjs';
import { WebSocketService } from 'src/web-socket.service';
import * as XLSX from 'xlsx';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { KpiLogsComponent } from './kpi-logs/kpi-logs.component';

export interface DataTable {
  informed: string,
  region: string
  username: string
  start_time: any
  end_time: any
  created_at: any;
  level: string,
  type: string,
  description: string,
  reason: string,
  problem: string
  id: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {

  kpiColumns: string[] = ['name',
    'chronicDuration', 'chronicCount', 'chronicCorrection', 'coreDurationA',
    'coreCountA', 'coreCorrectionA', 'coreDurationP', 'coreCountP',
    'coreCorrectionP', 'hubBscDurationA', 'hubBscCountA', 'hubBscCorrectionA',
    'hubBscDurationP', 'hubBscCountP', 'hubBscCorrectionP']
  KPIDataSource = new MatTableDataSource<any>()

  dataTable = new MatTableDataSource<DataTable>()
  Data = new MatTableDataSource<DataTable>()
  TemplateData = new MatTableDataSource<DataTable>()
  userName: any
  pageViewSize = [15, 30, 50, 150 , 300, 500, 1500, 15000];
  filterInput: string
  selectedLevel: string
  selectedType: string
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  globalFilter = '';
  KPI: any
  LOG: any
  USERS: any
  resultArray: any

  displayedColumnsTemplate: string[] = [
    'type',
    'level',
    'created_at',
    'start_time',
    'problem',
    'reason',
    'description',
    'region',
    'informed',
    'action'
  ]

  displayedColumnsNew: string[] = [
    'type',
    'level',
    'chronic_hours',
    'created_at',
    'start_time',
    'problem',
    'reason',
    'description',
    'region',
    'informed',
  ]

  displayedColumnsForAllCases: string[] = [
    'type',
    'level',
    'created_at',
    'start_time',
    'end_time',
    'problem',
    'reason',
    'description',
    'region',
    'informed',
    'id'
  ]

  displayedColumnsKpiUsers: string[] = [
    'type',
    'level',
    'created_at',
    'start_time',
    'problem',
    'reason',
    'description',
    'region',
    'informed',
    'action'
  ]

  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort;
  //@ViewChild('table1sort') public table1sort: MatSort;
  @ViewChild('table2paginator') public table2paginator: MatPaginator
  @ViewChild('table2sort') public table2sort: MatSort;

  filteredValuesForOpenCases = {
    type: '',
    level: '',
    created_at: '',
    start_time: '',
    end_time: '',
    problem: '',
    reason: '',
    description: '',
    region: '',
    informed: ''
  }

  level = new FormControl()
  type = new FormControl()
  description = new FormControl()
  reason = new FormControl()
  problem = new FormControl()
  createdAt = new FormControl()
  startTime = new FormControl()
  endTime = new FormControl()
  region = new FormControl()
  informed = new FormControl()
  username = new FormControl()
  id = new FormControl()


  constructor(
    private authService: AuthService,
    private router: Router,
    private webSocketService: WebSocketService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,) { }

  // All Cases table with backend pagination

  ngAfterViewInit() {

    // Open Cases table
    this.authService.getFilteredData()
      .subscribe((data: any) => {
        
        this.Data.data = data.results
        this.Data.sort = this.sort;

        this.Data.paginator = this.paginator

        // Open cases filter
        this.Data.filterPredicate = this.customFilterPredicate();

        this.webSocketService.receiveMessage().subscribe(
          (data) => {
            const exist = this.Data.data.findIndex(
              (item: any) => item.id === data.id
            )
            if (exist !== -1) {
              if (data.action == 'delete') {
                this.Data.data.splice(exist, 1)
                this.Data.data = this.Data.data
              } else if (data.is_complete == true) {
                this.Data.data.splice(exist, 1)
                this.Data.data = this.Data.data
              } else {
                this.Data.data[exist] = data
                this.Data.data = this.Data.data
              }
            } else if (data.is_complete == false && data.is_send_sms == true) {
              this.Data.data = [...this.Data.data, data]
            }
          })
      }),

      // Template table
      this.authService.getTemplateSMS()
        .subscribe((data: any) => {
          this.TemplateData.data = data.results

          this.webSocketService.receiveMessage().subscribe((data) => {

            const exist = this.TemplateData.data.findIndex(
              (item: any) => item.id === data.id
            )

            if (exist !== -1) {
              if (data.action == 'delete') {
                this.TemplateData.data.splice(exist, 1)
                this.TemplateData.data = this.TemplateData.data
              } else if (data.is_send_sms == true) {
                this.TemplateData.data.splice(exist, 1)
                this.TemplateData.data = this.TemplateData.data
              } else {
                this.TemplateData.data[exist] = data
                this.TemplateData.data = this.TemplateData.data
              }
            } else if (data.is_send_sms == false) {
              this.TemplateData.data = [...this.TemplateData.data, data]
            }
          })
        })


    this.table2sort.sortChange.subscribe(() => (this.table2paginator.pageIndex = 0));

    merge(
      this.level.valueChanges,
      this.type.valueChanges,
      this.description.valueChanges,
      this.reason.valueChanges,
      this.problem.valueChanges,
      this.createdAt.valueChanges,
      this.startTime.valueChanges,
      this.endTime.valueChanges,
      this.region.valueChanges,
      this.informed.valueChanges,
      this.id.valueChanges,
      this.table2sort.sortChange,
      this.table2paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          var dir: string
          var level = this.level.value == null ? '' : this.level.value;
          var type = this.type.value == null ? '' : this.type.value;
          var description = this.description.value == null ? '' : this.description.value;
          var reason = this.reason.value == null ? '' : this.reason.value;
          var problem = this.problem.value == null ? '' : this.problem.value;
          var createdAt = this.createdAt.value == null ? '' : this.createdAt.value;
          var startTime = this.startTime.value == null ? '' : this.startTime.value;
          var endTime = this.endTime.value == null ? '' : this.endTime.value;
          var region = this.region.value == null ? '' : this.region.value;
          var informed = this.informed.value == null ? '' : this.informed.value;
          var id = this.id.value == null ? '' : this.id.value;
          if (this.table2sort.direction == 'desc') {
            dir = '-'
          } else {
            dir = ''
          }


          return this.authService
            .getDataTest(
              level, type, description, reason, problem, createdAt,
              startTime, endTime, region, informed, id, dir,
              this.table2sort.active,
              this.table2paginator.pageIndex + 1,
              this.table2paginator.pageSize
            )
            .pipe(catchError(() => of(null)));
        }),
        map((data) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }

          this.resultsLength = data.count;
          return data;
        })
      )
      .subscribe(data => {
        
        this.dataTable.data = data.results
        this.webSocketService.receiveMessage().subscribe((data) => {
          const exist = this.dataTable.data.findIndex(
            (item: any) => item.id === data.id
          )

          if (exist !== -1) {

            if (data.action == 'delete') {
              this.dataTable.data.splice(exist, 1)
              this.dataTable.data = this.dataTable.data
            } else {
              this.dataTable.data[exist] = data
              this.dataTable.data = this.dataTable.data
            }
          } else {
            this.dataTable.data = [...this.dataTable.data, data]
          }

        })
      });
  }

  ngOnInit(): void {

    this.authService.getUser().subscribe((data: any) => {
      this.userName = data.first_name + ' ' + data.last_name
    })


    this.authService.getKPI().subscribe((data: any) => {
      this.KPI = data

      this.authService.getUsers().subscribe((data: any) => {
        this.USERS = data.results

        this.gettingUsername(this.USERS, this.KPI)
        this.KPIDataSource.data = this.nullItemReplacing(this.resultArray)

      })

    })
  }

  nullItemReplacing(data: any[]): any[] {
    return data.map(item => ({
      ...item,
      avg_send_duration_chronic: item.avg_send_duration_chronic !== null ? item.avg_send_duration_chronic : '--:--:--',
      avg_send_duration_core_a: item.avg_send_duration_core_a !== null ? item.avg_send_duration_core_a : '--:--:--',
      avg_send_duration_core_p: item.avg_send_duration_core_p !== null ? item.avg_send_duration_core_p : '--:--:--',
      avg_send_duration_hub_bscrnc_a: item.avg_send_duration_hub_bscrnc_a !== null ? item.avg_send_duration_hub_bscrnc_a : '--:--:--',
      avg_send_duration_hub_bscrnc_p: item.avg_send_duration_hub_bscrnc_p !== null ? item.avg_send_duration_hub_bscrnc_p : '--:--:--',
    }))
  }

  gettingUsername(usernames: any, kpis: any) {

    this.resultArray = usernames.map((user: any) => {
      const kpiValue = kpis.find((value: any) => value.user === user.id)

      if (kpiValue) {
        return {
          id: user.id,
          username: user.username,
          avg_send_duration_chronic: kpiValue.avg_send_duration_chronic,
          avg_send_duration_core_a: kpiValue.avg_send_duration_core_a,
          avg_send_duration_core_p: kpiValue.avg_send_duration_core_p,
          avg_send_duration_hub_bscrnc_a: kpiValue.avg_send_duration_hub_bscrnc_a,
          avg_send_duration_hub_bscrnc_p: kpiValue.avg_send_duration_hub_bscrnc_p,
          count_chronic: kpiValue.count_chronic,
          count_core_a: kpiValue.count_core_a,
          count_core_p: kpiValue.count_core_p,
          count_hub_bscrnc_a: kpiValue.count_hub_bscrnc_a,
          count_hub_bscrnc_p: kpiValue.count_hub_bscrnc_p,
          count_correction_chronic: kpiValue.count_correction_chronic,
          count_correction_core_a: kpiValue.count_correction_core_a,
          count_correction_core_p: kpiValue.count_correction_core_p,
          count_correction_hub_bscrnc_a: kpiValue.count_correction_hub_bscrnc_a,
          count_correction_hub_bscrnc_p: kpiValue.count_correction_hub_bscrnc_p
        }
      }
    }).filter(Boolean)

  }

  onRowClick(type: string, user: string, level: string) {
    this.dialog.open(KpiLogsComponent, {
      width: '60%',
      maxHeight: '90vh',
      data: {
        type: type,
        userInfo: user,
        level: level,
      }
    })
  }


  logExport(name: string) {
    this.authService.getLog().subscribe((data: any) => {
      const result = data.filter((res: any) => res.user_id == name)
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(result);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, name + '.xlsx');

    })

  }


  applyFilter(filter: string) {
    this.globalFilter = filter;
    this.Data.filter = JSON.stringify(this.filteredValuesForOpenCases)
  }

  onSelectLevel() {
    this.filteredValuesForOpenCases['level'] = this.selectedLevel
    this.Data.filter = JSON.stringify(this.filteredValuesForOpenCases)
  }

  onSelectType() {
    this.filteredValuesForOpenCases['type'] = this.selectedType
    this.Data.filter = JSON.stringify(this.filteredValuesForOpenCases)
  }

  customFilterPredicate() {
    const myFilterPredicate = (
      data: any,
      filter: string
    ): boolean => {
      var globalMatch = !this.globalFilter;

      if (this.globalFilter) {
        // search all text fields

        globalMatch =
          data.reason
            .toString()
            .trim()
            .toLowerCase()
            .indexOf(this.globalFilter.toLowerCase()) !== -1 ||
          data.problem
            .toString()
            .trim()
            .toLowerCase()
            .indexOf(this.globalFilter.toLowerCase()) !== -1 ||
          data.description
            .toString()
            .trim()
            .toLowerCase()
            .indexOf(this.globalFilter.toLowerCase()) !== -1 ||
          data.region
            .toString()
            .trim()
            .toLowerCase()
            .indexOf(this.globalFilter.toLowerCase()) !== -1 ||
          data.informed
            .toString()
            .trim()
            .toLowerCase()
            .indexOf(this.globalFilter.toLowerCase()) !== -1 ||
          data.created_at
            .toString()
            .trim()
            .toLowerCase()
            .indexOf(this.globalFilter.toLowerCase()) !== -1 ||
          data.start_time
            .toString()
            .trim()
            .toLowerCase()
            .indexOf(this.globalFilter.toLowerCase()) !== -1

      }

      if (!globalMatch) {
        return;
      }

      let searchString = JSON.parse(filter);
      return (
        data.level.toString().trim().indexOf(searchString.level) !== -1 &&
        data.type
          .toString()
          .trim()
          .toLowerCase()
          .indexOf(searchString.type.toLowerCase()) !== -1
      );
    };
    return myFilterPredicate;
  }

  onRN() {
    this.router.navigate(['home/rn'])
  }

  onCN() {
    this.router.navigate(['home/cn'])
  }

  addNumber() {
    this.router.navigate(['/add'])
  }

  exportXlsx() {
    const dialogRef = this.dialog.open(exportExcel);

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);

    })
  }

  dashBorad() {
    this.router.navigate(['home/newIdeas'])
  }

  selectedCase(row: any) {
    this.snackBar.open('Saved', '', { duration: 10000 })
    let body = {
      'alarmreport': row.id,
      'comment': ''
    }
    this.authService.PostSelectedCase(body).subscribe((res) => {
      console.log(res);

    })
  }

  getSelectedCases() {
    this.router.navigate(['home/selectedCases'])
  }

  correctionList() {
    this.router.navigate(['home/correctionList'])
  }

  onExportVisible() {
    this.convertToExcel(this.dataTable.data)
    
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


  onDelete(id: number) {
    const dialogRef = this.dialog.open(areYouSure);

    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.authService.deleteData(id).subscribe(res => {
          this.snackBar.open('Удалено', '', { duration: 10000 })
        })
      }
    })

  }
}

@Component({
  selector: 'exportExcel',
  templateUrl: 'exportExcel.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule],
})
export class exportExcel {
  data: any[] = [];
  limit: any = 1000
  pageNumber: any
  posttest: any
  startTime: any
  endTime: any
  constructor(private authService: AuthService) { }

  onSubmit(form: NgForm) {
    this.startTime = form.value.starttime
    this.endTime = form.value.endtime


    this.authService.exportExcel(this.startTime, this.endTime, 1, this.limit)
      .subscribe((res: any) => {
        this.pageNumber = Math.ceil(res.count / res.results.length)

        const promises = [];
        for (let i = 1; i <= this.pageNumber; i++) {
          promises.push(this.authService.exportExcel(this.startTime, this.endTime, i, this.limit).toPromise());
        }

        Promise.all(promises).then(results => {
          results.forEach((res: any) => this.data = this.data.concat(res.results));
          this.convertToExcel(this.data)
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

}

@Component({
  selector: 'areYouSure',
  templateUrl: 'areYouSure.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class areYouSure { }



