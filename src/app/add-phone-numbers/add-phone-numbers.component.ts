import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../auth.service';

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
    { value: 'Andijan', viewValue: 'Andijan' },
    { value: 'Bukhara', viewValue: 'Bukhara' },
    { value: 'Djizzakh', viewValue: 'Djizzakh' },
    { value: 'Fergana', viewValue: 'Fergana' },
    { value: 'Sirdarya', viewValue: 'Sirdarya' },
    { value: 'Kashkadarya', viewValue: 'Kashkadarya' },
    { value: 'Namangan', viewValue: 'Namangan' },
    { value: 'Navoi', viewValue: 'Navoi' },
    { value: 'Karakalpakstan', viewValue: 'Karakalpakstan' },
    { value: 'Samarkand', viewValue: 'Bukhara' },
    { value: 'Tashkent', viewValue: 'Tashkent' },
    { value: 'Surkhandarya', viewValue: 'Surkhandarya' },
    { value: 'Khorezm', viewValue: 'Khorezm' },
  ];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  createForm() {
    this.AddPhoneNumber = this.formBuilder.group({
      'name': [null],
      'number': [null],
      'network': [null],
      'criteria': [null],
      'notification': [null],
      'region': [null],
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

        this.ActivePhoneNumberList = new MatTableDataSource(this.data)
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
