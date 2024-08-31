import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { DatePipe } from '@angular/common';


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

  constructor(private authService: AuthService, private datePipe: DatePipe) {

  }

  ngOnInit(): void {
    this.authService.rtmcReport().subscribe(
      (res: any) => {
        this.currentTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm');
        console.log(this.currentTime);
        
        this.dataSource = res
      }
    )
  }

}
