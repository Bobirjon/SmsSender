import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../auth.service';
import { catchError, map, merge, startWith, switchMap } from 'rxjs';


@Component({
  selector: 'app-add-phone-numbers',
  templateUrl: './add-phone-numbers.component.html',
  styleUrls: ['./add-phone-numbers.component.css']
})
export class AddPhoneNumbersComponent implements OnInit {

  ActivePhoneNumberList: MatTableDataSource<any>
  dataSend: any
  data: any
  AddPhoneNumber: FormGroup
  pageSizes = [10, 25, 50];
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false
  @ViewChild('table2sort') public table2sort: MatSort;

  filteredValues = {
    nameFilter: '',
    numberFilter: '',
    networkFilter: '',
    criteriaFilter: '',
    notificationFilter: '',
    regionFilter: '',
  };

  nameFilter = new FormControl()
  numberFilter = new FormControl()
  networkFilter = new FormControl()
  criteriaFilter = new FormControl()
  notificationFilter = new FormControl()
  regionFilter = new FormControl()

  displayedColumns: string[] = [
    'name',
    'number',
    'notification',
    'criteria',
    'region',
    'network',
    'actions'
  ];

  network: { value: string; viewValue: string }[] = [
    { value: 'CN', viewValue: 'CN' },
    { value: 'RN', viewValue: 'RN' },
  ];

  criteria: { value: string; viewValue: string }[] = [
    { value: 'A2', viewValue: 'A2' },
    { value: 'A3', viewValue: 'A3' },
    { value: 'A4', viewValue: 'A4' },
    { value: 'A5', viewValue: 'A5' },
  ];

  notification: { value: string; viewValue: string }[] = [
    { value: 'GPRS', viewValue: 'GPRS' },
    { value: 'Roaming', viewValue: 'Roaming' },
    { value: 'Core', viewValue: 'Core' },
    { value: 'Power/HighTemp', viewValue: 'Power/HighTemp' },
    { value: 'BSC/RNC', viewValue: 'BSC/RNC' },
    { value: 'Chronic', viewValue: 'Chronic' },
    { value: 'Hub', viewValue: 'Hub' },
    { value: 'Report', viewValue: 'Report' },
  ];

  region: { value: string; viewValue: string }[] = [
    { value: 'Андижан', viewValue: 'Andijan' },
    { value: 'Бухара', viewValue: 'Bukhara' },
    { value: 'Джизак', viewValue: 'Djizzakh' },
    { value: 'Фергана', viewValue: 'Fergana' },
    { value: 'Сырдарья', viewValue: 'Sirdarya' },
    { value: 'Кашкадарья', viewValue: 'Кашкадарья' },
    { value: 'Наманган', viewValue: 'Наманган' },
    { value: 'Навои', viewValue: 'Навои' },
    { value: 'Каракалпакстан', viewValue: 'Каракалпакстан' },
    { value: 'Самарканд', viewValue: 'Самарканд' },
    { value: 'г.Ташкент', viewValue: 'г.Ташкент' },
    { value: 'Ташкент.обл', viewValue: 'Ташкент.обл' },
    { value: 'Сурхандарья', viewValue: 'Сурхандарья' },
    { value: 'Хорезм', viewValue: 'Хорезм' },
  ];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  createForm() {
    this.AddPhoneNumber = this.formBuilder.group({
      'name': [null, Validators.required],
      'number': ['99893', Validators.required],
      'network': [null, Validators.required],
      'criteria': [null, Validators.required],
      'notification': [null, Validators.required],
      'region': [null, Validators.required],
    })
  }

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.createForm()
  }

  onSubmit() {

    this.dataSend = {
      'name': this.AddPhoneNumber.value.name,
      'tel_number': this.AddPhoneNumber.value.number,
      'network': this.AddPhoneNumber.value.network,
      'criteria': this.AddPhoneNumber.value.criteria,
      'notification': this.AddPhoneNumber.value.notification,
    }

    console.log(this.dataSend);
    

    if(this.AddPhoneNumber.value.region != null || this.AddPhoneNumber.value.region != undefined) {
      this.dataSend.region = this.AddPhoneNumber.value.region
    }

    this.authService.postReceiverData(this.dataSend)
      .subscribe(res => {
        console.log(res);
        window.location.reload()
      })

  }

  ngOnInit(): void {

    this.authService.getreceiverData()
      .subscribe(res => {
        this.data = res

        this.ActivePhoneNumberList = new MatTableDataSource(this.data.results)
        
        this.ActivePhoneNumberList.paginator = this.paginator;
        this.ActivePhoneNumberList.sort = this.sort;
        this.filterForAllCase()
      })
  }

  onDelete(event: any) {
   this.authService.deleteReceiver(event)
    .subscribe(res => {
      console.log(res);
      window.location.reload()
    })
  }

  ngAfterViewInit() {

    // If the user changes the sort order, reset back to the first page.
    this.table2sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(
      this.nameFilter.valueChanges,
      this.numberFilter.valueChanges,
      this.networkFilter.valueChanges,
      this.criteriaFilter.valueChanges,
      this.notificationFilter.valueChanges,
      this.regionFilter.valueChanges,
      this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          var dir: string
          var nameFilter = this.nameFilter.value == null ? '' : this.nameFilter.value;
          var numberFilter = this.numberFilter.value == null ? '' : this.numberFilter.value;
          var networkFilter = this.networkFilter.value == null ? '' : this.networkFilter.value;
          var criteriaFilter = this.criteriaFilter.value == null ? '' : this.criteriaFilter.value;
          var notificationFilter = this.notificationFilter.value == null ? '' : this.notificationFilter.value;
          var regionFilter = this.regionFilter.value == null ? '' : this.regionFilter.value;
          if (this.table2sort.direction == 'desc') {
            dir = '-'
          } else {
            dir = ''
          }

          return this.authService
            .getRecievers(
              nameFilter, numberFilter, networkFilter, criteriaFilter, notificationFilter,
              regionFilter,
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
        this.ActivePhoneNumberList = new MatTableDataSource(data.results)
        console.log(data);

      });
  }

  filterForAllCase() {
    this.nameFilter.valueChanges.subscribe((nameFilters) => {
      this.filteredValues['nameFilter'] = nameFilters;
      this.ActivePhoneNumberList.filter = JSON.stringify(this.filteredValues)
    })

    this.numberFilter.valueChanges.subscribe((numberFilter) => {
      this.filteredValues['numberFilter'] = numberFilter;
      this.ActivePhoneNumberList.filter = JSON.stringify(this.filteredValues)
    })

    this.networkFilter.valueChanges.subscribe((networkFilters) => {
      this.filteredValues['networkFilters'] = networkFilters;
      this.ActivePhoneNumberList.filter = JSON.stringify(this.filteredValues)
    })

    this.criteriaFilter.valueChanges.subscribe((criteriaFilters) => {
      this.filteredValues['criteriaFilter'] = criteriaFilters;
      this.ActivePhoneNumberList.filter = JSON.stringify(this.filteredValues)
    })

    this.notificationFilter.valueChanges.subscribe((notificationFilters) => {
      this.filteredValues['notificationFilter'] = notificationFilters;
      this.ActivePhoneNumberList.filter = JSON.stringify(this.filteredValues)
    })

    this.regionFilter.valueChanges.subscribe((regionFilters) => {
      this.filteredValues['regionFilter'] = regionFilters;
      this.ActivePhoneNumberList.filter = JSON.stringify(this.filteredValues)
    })

    this.ActivePhoneNumberList.filterPredicate = function (data, filter): boolean {
      let searchString = JSON.parse(filter);
      let nameFound = data.name.toString().trim().toLowerCase().indexOf(searchString.nameFilter.toLowerCase()) !== -1
      let numberFound = data.tel_number.toString().trim().toLowerCase().indexOf(searchString.numberFilter.toLowerCase()) !== -1
      let networkFound = data.network.toString().trim().toLowerCase().indexOf(searchString.networkFilter.toLowerCase()) !== -1

      let criteriaFound = data.criteria.toString().trim().toLowerCase().indexOf(searchString.criteriaFilter.toLowerCase()) !== -1
      let notificationFound = data.notification.toString().trim().toLowerCase().indexOf(searchString.notificationFilter.toLowerCase()) !== -1
      let regionFound = data.region.toString().trim().toLowerCase().indexOf(searchString.regionFilter.toLowerCase()) !== -1

      if (searchString.topFilter) {
        console.log(networkFound);

        return nameFound || numberFound || networkFound || criteriaFound || notificationFound || regionFound
      } else {
        console.log(networkFound);
        return nameFound && numberFound && networkFound && criteriaFound && notificationFound && regionFound
      }
    }
  }

}
function observableOf(arg0: null): any {
  throw new Error('Function not implemented.');
}

