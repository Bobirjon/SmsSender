import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Data, Router } from '@angular/router';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AbstractControl, Form, FormBuilder, FormControl, FormGroup, FormsModule, NgForm } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { BehaviorSubject, Subscription, ValueFromArray, catchError, filter, map, merge, startWith, switchMap, windowWhen } from 'rxjs';
import { WebSocketService } from 'src/web-socket.service';
import * as XLSX from 'xlsx';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

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
export class HomeComponent implements OnInit, AfterViewInit {

  dataTable = new MatTableDataSource<DataTable>()
  Data = new MatTableDataSource<DataTable>()
  TemplateData = new MatTableDataSource<DataTable>()
  posts: any
  posts2: any
  Loaded: boolean;
  //CurrentRoute = this.router.url
  //isComplete: boolean
  // name: any
  // user: any;
  // hidden: any
  isAdmin = localStorage.getItem('role')
  // isRegister: any;
  // UserActive: boolean
  //isColor: any
  //currentPage = 0
  //pageSize = 10
  //totalItems = 0
  pageSizes = [25, 50, 10];
  // totalData: any
  filterInput: string
  selectedLevel: string
  selectedType: string
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  globalFilter = '';

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

  @ViewChild(MatPaginator) paginator: MatPaginator

  @ViewChild('table1sort') public table1sort: MatSort;
  @ViewChild('table2sort') public table2sort: MatSort;
  // levelSelect: string[] = ['All', 'A1', 'A2', 'A3', 'A4', 'A5', 'P1', 'P2', 'P3', 'P4', 'P5'];
  // typeSelect: string[] = ['All', 'CORE', 'RN']
  // selectableFilters: any[] = []

  // defaultValue = "All";

  // filterDictionary = new Map<string, string[]>();

  // filteredValues = {
  //   type: '',
  //   level: '',
  //   created_at: '',
  //   start_time: '',
  //   end_time: '',
  //   problem: '',
  //   reason: '',
  //   description: '',
  //   region: '',
  // };

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

  //refreshUser$ = new BehaviorSubject<boolean>(true)
  //output: any[] = []
  // feedback: any
  // nameOfUser: any
  // messageDataTest: any


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
    //private webSocketService: WebSocketService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) {
    // testing one


    // Table for all Cases
    // this.authService.getData()
    //   .subscribe((data) => {
    //     this.posts = data

    //     this.dataTable = new MatTableDataSource(this.posts.results)
    //     this.dataTable.sort = this.table2sort;
    //     this.dataTable.paginator = this.paginator;

    //     this.filterForAllCase()
    //   }, error => {
    //     this.isRegister = error.statusText
    //     if (this.isRegister == 'Unauthorized') {
    //       this.isRegisteredUser(false)
    //     }
    //   })
    // Filtred data

    this.authService.getFilteredData()
      .subscribe((data) => {
        this.posts2 = data
        this.Data = new MatTableDataSource(this.posts2.results)

        this.Data.sort = this.table1sort;

        this.Data.filterPredicate = this.customFilterPredicate();

        // this.selectableFilters.push({ name: 'level', options: this.levelSelect, defaultValue: this.defaultValue })
        // this.selectableFilters.push({ name: 'type', options: this.typeSelect, defaultValue: this.defaultValue })

        // this.filterForOpenCase()
      })

    this.authService.getTemplateSMS()
      .subscribe((data) => {
        let post3: any = data
        console.log(post3.results);
        
        this.TemplateData = new MatTableDataSource(post3.results)
      })


  }

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
          console.log(startTime);

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
        console.log(data);
        
        this.posts = data
        this.dataTable = new MatTableDataSource(this.posts.results)
      });
  }

  // isRegisteredUser(isRegistered: any) {
  //   this.UserActive = isRegistered
  // }

  ngOnInit(): void {

    // this.webSocketService.listen().subscribe((data) => {
    //   this.updateMessage(data)
    // })

    if (this.router.url == '/home') {
      this.Loaded = true
    } else {
      this.Loaded = false
    }
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

  addNumber() {
    this.router.navigate(['/add'])
  }

  exportXlsx() {
    const dialogRef = this.dialog.open(exportExcel);

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);

    })
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
    // this.authService.getData()
    //   .subscribe(res => {
    //     console.log(res);
    //     this.posttest = res
    //     this.convertToXLSX(this.posttest.results, 'data')
    //   })
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

