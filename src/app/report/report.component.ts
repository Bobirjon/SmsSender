import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { DatePipe } from '@angular/common';
import { MatTable } from '@angular/material/table';
import { Clipboard } from '@angular/cdk/clipboard';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit {

  currentTime: any

  displayedColumns: string[] = ['xududlar', 'umumiyBS',
    'ochkanBS', '3soat', '12soat', '12soatKop', 'foyiz'];
  dataSource: any

  @ViewChild('table', { static: true }) table: ElementRef<HTMLTableElement>;


  constructor(private authService: AuthService,
    private datePipe: DatePipe,
    private clipboard: Clipboard) { }

  ngOnInit(): void {
    if (!this.table) {
      console.error('Table element is not defined!');
    }
    this.authService.rtmcReport().subscribe(
      (res: any) => {
        this.currentTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm');

        this.dataSource = res
      }
    )
  }

  copyTableContent() {
    // let copyText = '';
    
    // // Get headers
    // copyText += this.displayedColumns.join('\t') + '\n';
    
    // // Get rows
    // this.dataSource.data.forEach((row: any) => {
    //   const rowData = this.displayedColumns.map(column => row[column]);
    //   copyText += rowData.join('\t') + '\n';
    // });
    console.log(this.dataSource);
    
    this.clipboard.copy(this.dataSource);
  }

}
