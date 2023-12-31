import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, FormsModule, NgForm } from '@angular/forms';
import { Subscription, catchError, map, merge, startWith, switchMap } from 'rxjs';
import { WebSocketService } from 'src/web-socket.service';
import * as XLSX from 'xlsx';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StorageService } from '../storage.service';

export interface DataTable {
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
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy   {

  dataTable = new MatTableDataSource<DataTable>()
  Data = new MatTableDataSource<DataTable>()
  TemplateData = new MatTableDataSource<DataTable>()
  userName: any
  isAdmin = localStorage.getItem('role')
  pageSizes = [25, 50, 10];
  filterInput: string
  selectedLevel: string
  selectedType: string
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  globalFilter = '';
  private socketSubscription: Subscription;

  displayedColumnsNew: string[] = [
    'type',
    'level',
    'created_at',
    'start_time',
    'problem',
    'reason',
    'description',
    'region',
    'actions'
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
    'actions'
  ]

  columnWidths = {
    type: '100px', // Set the width of column1 to 100 pixels
    level: '200px', // Set the width of column2 to 200 pixels
    createdAt: 'auto',   // Set the width of column3 to auto (adjust based on content)
    start_time: '100px', // Set the width of column1 to 100 pixels
    end_time: '200px', // Set the width of column2 to 200 pixels
    problem: 'auto',
    reason: '100px', // Set the width of column1 to 100 pixels
    description: '200px', // Set the width of column2 to 200 pixels
    region: 'auto',
    action: 'auto'
  };

  @ViewChild(MatPaginator) paginator: MatPaginator

  @ViewChild('table1sort') public table1sort: MatSort;
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
  username = new FormControl()


  constructor(
    private authService: AuthService,
    private router: Router,
    private webSocketService: WebSocketService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) {
   
    // Open Cases table
    this.authService.getFilteredData()
      .subscribe((data: any) => {
        this.Data = new MatTableDataSource(data.results)
        console.log(data.results);
        
        this.Data.sort = this.table1sort;
        this.Data.filterPredicate = this.customFilterPredicate();
        
        this.socketSubscription = webSocketService.getDataObservable().subscribe((data) => {
          this.Data.data.push(data)

          this.Data.data = [...this.Data.data]
        })
      })
    
    // Template table
    this.authService.getTemplateSMS()
      .subscribe((data: any) => {
        this.TemplateData = new MatTableDataSource(data.results)

        this.socketSubscription = webSocketService.getDataObservable().subscribe((data) => {
          this.TemplateData.data.push(data)

          this.TemplateData.data = [...this.TemplateData.data]
        })
      })
  }
  ngOnDestroy(): void {
    this.socketSubscription.unsubscribe();
  }

  // All Cases table with backend pagination

  ngAfterViewInit() {

    // If the user changes the sort order, reset back to the first page.
    this.table2sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

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
      this.table2sort.sortChange,
      this.paginator.page)
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
          if (this.table2sort.direction == 'desc') {
            dir = '-'
          } else {
            dir = ''
          }

          return this.authService
            .getDataTest(
              level, type, description, reason, problem,
              createdAt, startTime, endTime, region,
              this.table2sort.active,
              dir,
              this.paginator.pageIndex + 1,
              this.paginator.pageSize
            )
            .pipe(catchError(() => observableOf(null)));
        }),
        map((data) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.resultsLength = data.count;
          
          return data;
        })
      )
      .subscribe((data) => {
        this.dataTable = new MatTableDataSource(data.results)
        
        this.socketSubscription = this.webSocketService.getDataObservable().subscribe((data) => {
          this.dataTable.data.push(data)

          this.dataTable.data = [...this.dataTable.data]
        })
      });
  }

  ngOnInit(): void {

    this.authService.getUser().subscribe((data:any) => {
      this.userName = data.first_name + ' ' + data.last_name
      console.log(this.userName);
      
      
    })

  }

  applyFilter(filter: string) {
    this.globalFilter = filter;
    this.Data.filter = JSON.stringify(this.filteredValuesForOpenCases)
    console.log(this.Data.filter);

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

  onDelete(id: number) {
    const dialogRef = this.dialog.open(areYouSure);

    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.authService.deleteData(id).subscribe(res => {
          console.log(res);
          this.snackBar.open('Удалено', '', { duration: 10000 })
          window.location.reload()
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
  posttest: any
  constructor(
    private authService: AuthService,
  ) { }
  onSubmit(form: NgForm) {
    this.authService.exportExcel(form.value.starttime, form.value.endtime)
      .subscribe(res => {
        console.log(res);
        this.posttest = res
        this.convertToXLSX(this.posttest.results, 'data')
      })
  }


  convertToXLSX(data: any, filename: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, filename);
  }

  saveAsExcelFile(buffer: any, filename: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url: string = window.URL.createObjectURL(data);
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = url;
    link.download = filename + '.xlsx';
    link.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      link.remove();
    }, 100);
  }
}

@Component({
  selector: 'areYouSure',
  templateUrl: 'areYouSure.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class areYouSure { }

function observableOf(arg0: null): any {
  throw new Error('Function not implemented.');
}

