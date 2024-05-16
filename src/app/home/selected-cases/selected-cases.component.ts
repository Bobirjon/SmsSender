import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/auth.service';
import { EditCommentComponent } from './edit-comment/edit-comment.component';

@Component({
  selector: 'app-selected-cases',
  templateUrl: './selected-cases.component.html',
  styleUrls: ['./selected-cases.component.css']
})
export class SelectedCasesComponent implements OnInit, AfterViewInit  {

  dataSource = new MatTableDataSource<any>(); // Data source for the Material table
  displayedColumns = ['type', 'reason', 'problem', 'comment']; // Columns to be displayed
  totalItems = 0; // Total number of items (from the response)

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Reference to the paginator


  constructor(private authService: AuthService, private dialog: MatDialog) {}
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // Link paginator to the data source
    this.fetchData(0, this.paginator.pageSize);
  }


  ngOnInit() {}

  fetchData(pageIndex: number, pageSize: number) {
    // Fetch paginated data from the backend
    this.authService.GetSelectedCase(pageIndex + 1, pageSize).subscribe((response: any) => {
      this.dataSource.data = response.results; // Update the table data source
      
      this.totalItems = response.count; // Update the total number of items

      if (this.paginator) {
        // Update paginator settings
        this.paginator.length = this.totalItems;
        this.paginator.pageIndex = pageIndex;
        this.paginator.pageSize = pageSize;
      }
    });
  }

  handlePageEvent(event: any) {
    // Handle pagination events
    this.fetchData(event.pageIndex, event.pageSize); // Fetch new data when page changes
  }

  editComment(row: any) {
    // Open a dialog or some other UI to edit the comment
    const dialogRef = this.dialog.open(EditCommentComponent, {
      width: '550px',
      data: { id: row.id, comment: row.comment },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.comment !== row.comment) {
        // If there's a change, update the comment via API
        let data = {
          'alarmreport' : row.alarmreport.id,
          'comment' : result.comment
        }
        this.authService.updateComment(row.id, data).subscribe((res) => {
          console.log(res);
          window.location.reload()
        });
      }
    });
  }

}
