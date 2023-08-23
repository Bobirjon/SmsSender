import { Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import { AuthService } from '../auth.service';
import { Data, Router } from '@angular/router';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AbstractControl, Form, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { BehaviorSubject, Subscription, ValueFromArray, map } from 'rxjs';
import { WebSocketService } from 'src/web-socket.service';

export interface DataTable {
  region: string
  username: string
  start_time: any
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
export class HomeComponent implements OnInit {
  Data: any
  Loaded: boolean;
  CurrentRoute = this.router.url
  isComplete: boolean
  name: any
  user: any;
  hidden: any
  isAdmin = localStorage.getItem('role')


  displayedColumnsNew: string[] = [
    'level',
    'type',
    'created_at',
    'start_time',
    'description',
    'reason',
    'problem',
    'region',
    'actions'
  ]


  dataTable: MatTableDataSource<DataTable>
  posts: any
  posts2: any
  @ViewChild(MatPaginator) paginator: MatPaginator

  @ViewChild('table1sort') public table1sort: MatSort;
  @ViewChild('table2sort') public table2sort: MatSort;
  levelSelect: string[] = ['All', 'A2', 'A3', 'A4', 'A5'];
  typeSelect: string[] = ['All', 'CORE', 'RN']
  selectableFilters: any[] = []

  defaultValue = "All";

  filterDictionary = new Map<string, string[]>();

  filteredValues = {
    level: '',
    type: '',
    description: '',
    reason: '',
    problem: '',
    created_at: '',
    start_time: '',
    region: ''
  };

  refreshUser$ = new BehaviorSubject<boolean>(true)
  output: any[] = []
  feedback: any
  nameOfUser: any
  messageDataTest: any

  level = new FormControl()
  type = new FormControl()
  description = new FormControl()
  reason = new FormControl()
  problem = new FormControl()
  createdAt = new FormControl()
  startTime = new FormControl()
  region = new FormControl()
  username = new FormControl()


  constructor(
    private authService: AuthService,
    private router: Router,
    private webSocketService: WebSocketService) {
    // Table for all Cases
    this.authService.getData()
      .subscribe((data) => {
        this.posts = data

        this.dataTable = new MatTableDataSource(this.posts)
        this.dataTable.sort = this.table2sort;
        this.dataTable.paginator = this.paginator;

        this.filterForAllCase()

      })
    // Filtred data
    this.authService.getFilteredData()
      .subscribe((data) => {
        this.posts2 = data

        this.Data = new MatTableDataSource(this.posts2)
        this.Data.sort = this.table1sort;

        this.selectableFilters.push({ name: 'level', options: this.levelSelect, defaultValue: this.defaultValue })
        this.selectableFilters.push({ name: 'type', options: this.typeSelect, defaultValue: this.defaultValue })

        this.filterForOpenCase()
      })
  }

  filterForAllCase() {
    this.level.valueChanges.subscribe((levelFilter) => {
      this.filteredValues['level'] = levelFilter;
      this.dataTable.filter = JSON.stringify(this.filteredValues)
    })

    this.type.valueChanges.subscribe((typeFilter) => {
      this.filteredValues['type'] = typeFilter;
      this.dataTable.filter = JSON.stringify(this.filteredValues)
    })

    this.description.valueChanges.subscribe((descriptionFilter) => {
      this.filteredValues['description'] = descriptionFilter;
      this.dataTable.filter = JSON.stringify(this.filteredValues)
    })

    this.reason.valueChanges.subscribe((reasonFilter) => {
      this.filteredValues['reason'] = reasonFilter;
      this.dataTable.filter = JSON.stringify(this.filteredValues)
    })

    this.problem.valueChanges.subscribe((problemFilter) => {
      this.filteredValues['problem'] = problemFilter;
      this.dataTable.filter = JSON.stringify(this.filteredValues)
    })

    this.createdAt.valueChanges.subscribe((createdAtFilter) => {
      this.filteredValues['created_at'] = createdAtFilter;
      this.dataTable.filter = JSON.stringify(this.filteredValues)
    })

    this.startTime.valueChanges.subscribe((startTimeFilter) => {
      this.filteredValues['start_time'] = startTimeFilter;
      this.dataTable.filter = JSON.stringify(this.filteredValues)
    })

    this.region.valueChanges.subscribe((regionFilter) => {
      this.filteredValues['region'] = regionFilter;
      this.dataTable.filter = JSON.stringify(this.filteredValues)
    })


    this.dataTable.filterPredicate = function (data, filter): boolean {
      let searchString = JSON.parse(filter);
      let levelFound = data.level.toString().trim().toLowerCase().indexOf(searchString.level.toLowerCase()) !== -1
      let typeFound = data.type.toString().trim().toLowerCase().indexOf(searchString.type.toLowerCase()) !== -1
      let descriptionFound = data.description.toString().trim().toLowerCase().indexOf(searchString.description.toLowerCase()) !== -1
      let reasonFound = data.reason.toString().trim().toLowerCase().indexOf(searchString.reason.toLowerCase()) !== -1
      let problemFound = data.problem.toString().trim().toLowerCase().indexOf(searchString.problem.toLowerCase()) !== -1
      let createdAtFound = data.created_at.toString().trim().toLowerCase().indexOf(searchString.created_at.toLowerCase()) !== -1
      let startTimeFound = data.start_time.toString().trim().toLowerCase().indexOf(searchString.start_time.toLowerCase()) !== -1
      let regionFound = data.region.toString().trim().toLowerCase().indexOf(searchString.region.toLowerCase()) !== -1

      if (searchString.topFilter) {
        return levelFound || typeFound || descriptionFound || reasonFound || problemFound || createdAtFound || startTimeFound || regionFound
      } else {
        return levelFound && typeFound && descriptionFound && reasonFound && problemFound && createdAtFound && startTimeFound && regionFound
      }
    }
  }

  filterForOpenCase() {

    this.Data.filterPredicate = function (selectRecord: any, selectFilter: any) {
      var map = new Map(JSON.parse(selectFilter));
      let isMatch = false;
      for (let [key, value] of map) {
        isMatch = value == 'All' ||
          selectRecord[key as keyof Data] == value[0] ||
          selectRecord[key as keyof Data] == value[1] ||
          selectRecord[key as keyof Data] == value[2]
        if (!isMatch) return false;
      }
      return isMatch;
    };
  }

  ngOnInit(): void {
    this.webSocketService.listen().subscribe((data) => {
      this.updateMessage(data)
    })

    if (this.router.url == '/home') {
      this.Loaded = true
    } else {
      this.Loaded = false
    }
  }

  updateMessage(data: any): void {

    let dataee = JSON.parse(data.data)

    if (!!!data) return;
    let indexAll = this.posts.findIndex((item: any) => item.id == dataee.id)
    let indexOpen = this.posts2.findIndex((item: any) => item.id == dataee.id)
    if (dataee.is_complete == true) {
      if (indexAll !== -1 && indexOpen !== -1) {
        this.posts.splice(indexAll, 1)
        this.posts.push(dataee)
        this.dataTable = new MatTableDataSource(this.posts)

        this.posts2.splice(indexOpen, 1)
        this.Data = new MatTableDataSource(this.posts2)
      } else if (indexAll !== -1 && indexOpen === -1) {
        this.posts.splice(indexAll, 1)
        this.posts.push(dataee)
        this.dataTable = new MatTableDataSource(this.posts)
      }
      else {
        this.posts.push(dataee)
        this.dataTable = new MatTableDataSource(this.posts)
      }
    } else {
      if (indexAll !== -1 && indexOpen !== -1) {
        this.posts.splice(indexAll, 1)
        this.posts.push(dataee)
        this.dataTable = new MatTableDataSource(this.posts)

        this.posts2.splice(indexOpen, 1)
        this.posts2.push(dataee)
        this.Data = new MatTableDataSource(this.posts2)
      } else {
        this.posts.push(dataee)
        this.dataTable = new MatTableDataSource(this.posts)

        this.posts2.push(dataee)
        this.Data = new MatTableDataSource(this.posts2)
      }
    }

    this.Data.sort = this.table1sort;
    this.dataTable.sort = this.table2sort;
    this.dataTable.paginator = this.paginator;
    this.filterForAllCase()
    this.filterForOpenCase()

  }

  applySelectableFilter(ob: MatSelectChange, data: Data) {
    if (ob.value == 'RN') {
      this.filterDictionary.set(data.name, ['CHRONIC', 'BSC/RNC', 'HUB'])
    } else {
      this.filterDictionary.set(data.name, [ob.value])
    }

    var jsonString = JSON.stringify(
      Array.from(this.filterDictionary.entries())
    )

    this.Data.filter = jsonString

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

}
