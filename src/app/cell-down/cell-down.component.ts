import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WebsocketService } from './web-socket-cell-down';
import { filter, Subject, Subscription } from 'rxjs';
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

  mode: boolean


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('element') element: ElementRef

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
      mode: [false],
      selectedRegion: [[]],
    })

    this.cellDownFilterForm.valueChanges.subscribe((res: any) => {
      this.mode = this.cellDownFilterForm.value.mode
    })

  }

  applyFilter(message?: any) {

    this.cellDownTable.filterPredicate = (data: any, filter: any) => {
      return (
        (this.cellDownFilterForm.value.selectedRegion == 0 || this.cellDownFilterForm.value.selectedRegion.some((reigon: any) => data.region.includes(reigon.value))) &&
        (!this.cellDownFilterForm.value.site || data.site.toLowerCase().includes(this.cellDownFilterForm.value.site.toLowerCase())) &&
        (!this.cellDownFilterForm.value.alarmtype || data.alarmtype.toLowerCase().includes(this.cellDownFilterForm.value.alarmtype.toLowerCase())) &&
        (
          this.cellDownFilterForm.value.sitesbehind === 'all' ||
          (this.cellDownFilterForm.value.sitesbehind === 'empty' && (!data.sitesbehind || data.sitesbehind.trim() === '')) ||
          (this.cellDownFilterForm.value.sitesbehind === 'withValue' && data.sitesbehind && data.sitesbehind.trim() !== '')
        ) &&
        (
          this.cellDownFilterForm.value.comment === 'all' ||
          (this.cellDownFilterForm.value.comment === 'empty' && (!data.comment || data.comment.trim() === '')) ||
          (this.cellDownFilterForm.value.comment === 'withValue' && data.comment && data.comment.trim() !== '')
        ) &&
        (
          this.cellDownFilterForm.value.power === 'all' ||
          (this.cellDownFilterForm.value.power === 'empty' && (!data.power || data.power.trim() === '')) ||
          (this.cellDownFilterForm.value.power === 'withValue' && data.power && data.power.trim() !== '')
        ) &&
        (
          this.cellDownFilterForm.value.dg === 'all' ||
          (this.cellDownFilterForm.value.dg === 'empty' && (!data.dg || data.dg.trim() === '')) ||
          (this.cellDownFilterForm.value.dg === 'withValue' && data.dg && data.dg.trim() !== '')
        ) &&
        (
          this.cellDownFilterForm.value.battery === 'all' ||
          (this.cellDownFilterForm.value.battery === 'empty' && (!data.battery || data.battery.trim() === '')) ||
          (this.cellDownFilterForm.value.battery === 'withValue' && data.battery && data.battery.trim() !== '')
        )
      )
    }
    this.cellDownTable.filter = JSON.stringify(this.cellDownFilterForm.value);
  }

  ngOnInit() {

    this.socketSubscription = this.websocket.getDataStream().subscribe((message: any) => {
      this.cellDownTable.data = [...this.cellDownTable.data, ...message]
      this.isLoading = false
      this.applyFilter()
      this.cellDownTable.paginator = this.paginator
      this.cellDownTable.sort = this.sort
    });

    this.cellDownFilterForm.valueChanges.subscribe(() => { this.applyFilter() })
  }

  ngOnDestroy() {
    this.websocket.closeConnection()
    this.socketSubscription.unsubscribe()
  }
}