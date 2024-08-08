import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WebsocketService } from './web-socket-cell-down';
import { filter, Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-cell-down',
  templateUrl: './cell-down.component.html',
  styleUrls: ['./cell-down.component.css']
})
export class CellDownComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = [
    'site', 'band', 'cell_count', 'cell_sum',
    'start_time', 'sitesbehind', 'comment',
    'alarmtype', 'power', 'dg', 'battery', 'region'
  ];

  cellDownTable = new MatTableDataSource<any>()

  private socketSubscription: Subscription;

  isLoading = true;

  cellDownFilterForm: FormGroup

  filterDataTable: any

  isChanged: boolean = false

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  region: { value: string; viewValue: string }[] = [
    { value: 'ANDIJAN', viewValue: 'Андижан' },
    { value: 'BUKHARA', viewValue: 'Бухара' },
    { value: 'DJIZZAK', viewValue: 'Джизак' },
    { value: 'FERGANA', viewValue: 'Фергана' },
    { value: 'SIRDARYA', viewValue: 'Сырдарья' },
    { value: 'KASHKADARYA', viewValue: 'Кашкадарья' },
    { value: 'NAMANGAN', viewValue: 'Наманган' },
    { value: 'NAVOI', viewValue: 'Навои' },
    { value: 'KARAKALPAKISTAN', viewValue: 'Каракалпакстан' },
    { value: 'SAMARKAND', viewValue: 'Самарканд' },
    { value: 'TASHKENT', viewValue: 'г.Ташкент' },
    { value: 'TASHKENTREGION', viewValue: 'Ташкент.обл' },
    { value: 'SURKHANDARYA', viewValue: 'Сурхандарья' },
    { value: 'KHOREZM', viewValue: 'Хорезм' },
  ];

  constructor(private websocket: WebsocketService, private fb: FormBuilder) {
    this.cellDownFilterForm = this.fb.group({
      site: [''],
      start_time: [''],
      sitesbehind: ['all'],
      comment: ['all'],
      alarmtype: [''],
      power: ['all'],
      dg: ['all'],
      battery: ['all'],
      selectedRegion: [[]],
    })
  }

  applyFilter(message: any) {
    this.cellDownTable.data = message.filter((res: any) => {

          return (
            (this.cellDownFilterForm.value.selectedRegion == 0 || this.cellDownFilterForm.value.selectedRegion.some((reigon: any) => res.region.includes(reigon.value))) &&
            (!this.cellDownFilterForm.value.site || res.site.toLowerCase().includes(this.cellDownFilterForm.value.site.toLowerCase())) &&
            (!this.cellDownFilterForm.value.alarmtype || res.alarmtype.toLowerCase().includes(this.cellDownFilterForm.value.alarmtype.toLowerCase())) &&
            (
              this.cellDownFilterForm.value.sitesbehind === 'all' ||
              (this.cellDownFilterForm.value.sitesbehind === 'empty' && (!res.sitesbehind || res.sitesbehind.trim() === '')) ||
              (this.cellDownFilterForm.value.sitesbehind === 'withValue' && res.sitesbehind && res.sitesbehind.trim() !== '')
            ) &&
            (
              this.cellDownFilterForm.value.comment === 'all' ||
              (this.cellDownFilterForm.value.comment === 'empty' && (!res.comment || res.comment.trim() === '')) ||
              (this.cellDownFilterForm.value.comment === 'withValue' && res.comment && res.comment.trim() !== '')
            ) &&
            (
              this.cellDownFilterForm.value.power === 'all' ||
              (this.cellDownFilterForm.value.power === 'empty' && (!res.power || res.power.trim() === '')) ||
              (this.cellDownFilterForm.value.power === 'withValue' && res.power && res.power.trim() !== '')
            ) &&
            (
              this.cellDownFilterForm.value.dg === 'all' ||
              (this.cellDownFilterForm.value.dg === 'empty' && (!res.dg || res.dg.trim() === '')) ||
              (this.cellDownFilterForm.value.dg === 'withValue' && res.dg && res.dg.trim() !== '')
            ) &&
            (
              this.cellDownFilterForm.value.battery === 'all' ||
              (this.cellDownFilterForm.value.battery === 'empty' && (!res.battery || res.battery.trim() === '')) ||
              (this.cellDownFilterForm.value.battery === 'withValue' && res.battery && res.battery.trim() !== '')
            )
          )
        })
  }

  ngOnInit() {

    this.socketSubscription = this.websocket.listen()
    .subscribe((message: any) => {
      console.log(message);
    
      this.applyFilter(message)
      this.cellDownFilterForm.valueChanges.subscribe(() => {
        this.applyFilter(message)
        
      })
      
      this.isLoading = false;
      this.cellDownTable.paginator = this.paginator
      this.cellDownTable.sort = this.sort
    });
  }


  ngOnDestroy() {
    this.websocket.close();
    this.socketSubscription.unsubscribe();
  }

}
