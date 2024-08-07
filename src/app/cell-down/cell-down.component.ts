import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WebsocketService } from './web-socket-cell-down';
import { Subscription } from 'rxjs';
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
      sitesbehind: [''],
      comment: ['all'],
      alarmtype: [''],
      power: ['all'],
      dg: ['all'],
      battery: ['all'],
      selectedRegion: [[]],
    })
  }

  ngOnInit() {
    this.socketSubscription = this.websocket.listen()
    .subscribe((message: any) => {
      this.isLoading = false;
      this.cellDownTable.data = message
      this.cellDownTable.paginator = this.paginator
      this.cellDownTable.sort = this.sort
      this.cellDownFilterForm.valueChanges.subscribe(filters => {

        this.cellDownTable.data = message.filter((res: any) => {
          return (
            (filters.selectedRegion == 0 || filters.selectedRegion.some((reigon: any) => res.region.includes(reigon.value))) &&
            (!filters.site || res.site.toLowerCase().includes(filters.site.toLowerCase())) &&
            (!filters.alarmtype || res.alarmtype.toLowerCase().includes(filters.alarmtype.toLowerCase())) &&
            (!filters.sitesbehind || res.sitesbehind?.toLowerCase().includes(filters.sitesbehind?.toLowerCase())) &&
            (
              filters.comment === 'all' ||
              (filters.comment === 'empty' && (!res.comment || res.comment.trim() === '')) ||
              (filters.comment === 'withValue' && res.comment && res.comment.trim() !== '')
            ) &&
            (
              filters.power === 'all' ||
              (filters.power === 'empty' && (!res.power || res.power.trim() === '')) ||
              (filters.power === 'withValue' && res.power && res.power.trim() !== '')
            ) &&
            (
              filters.dg === 'all' ||
              (filters.dg === 'empty' && (!res.dg || res.dg.trim() === '')) ||
              (filters.dg === 'withValue' && res.dg && res.dg.trim() !== '')
            ) &&
            (
              filters.battery === 'all' ||
              (filters.battery === 'empty' && (!res.battery || res.battery.trim() === '')) ||
              (filters.battery === 'withValue' && res.battery && res.battery.trim() !== '')
            )
          )
        })
      })
    });
  }


  ngOnDestroy() {
    this.websocket.close();
    this.socketSubscription.unsubscribe();
  }

}
