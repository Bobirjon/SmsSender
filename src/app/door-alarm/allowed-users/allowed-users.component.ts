import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/auth.service';
import { UserInfoUpdateComponent } from './userInfoUpdate';

@Component({
  selector: 'app-allowed-users',
  templateUrl: './allowed-users.component.html',
  styleUrls: ['./allowed-users.component.css'],
})
export class AllowedUsersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'username',
    'phonenumber',
    'organization',
    'position',
    'region',
    'is_active',
  ];
  dataSource = new MatTableDataSource<any>();
  totalRows = 0;
  pageSize = 10;
  currentPage = 1;
  sortField = 'username';
  sortDirection = 'asc';

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filterForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.filterForm = this.fb.group({
      username__icontains: [''],
      phonenumber__icontains: [''],
      region__icontains: [''],
      organization__icontains: [''],
    });
  }

  ngOnInit(): void {
    this.loadData();

    this.filterForm.valueChanges.subscribe(() => this.applyFilter());
  }

  loadData() {
    const sortParam =
      this.sortDirection === 'asc' ? this.sortField : `-${this.sortField}`;
    const params = {
      page: this.currentPage,
      page_size: this.pageSize,
      ordering: sortParam,
      ...this.filterForm.value,
    };
    this.authService.getAllowedUsers(params).subscribe((res: any) => {
      this.dataSource.data = res.results;
      console.log(res.results);

      this.totalRows = res.count;
    });
  }

  applyFilter() {
    this.currentPage = 1;
    this.paginator.firstPage();
    this.loadData();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => {
      this.sortField = this.sort.active;
      this.sortDirection = this.sort.direction;
      this.loadData();
    });

    this.paginator.page.subscribe(() => {
      this.currentPage = this.paginator.pageIndex + 1;
      this.pageSize = this.paginator.pageSize;
      this.loadData();
    });
  }

  onRowClicked(row: any) {
    this.dialog.open(UserInfoUpdateComponent, {
      width: '400px',
      data: row,
    });
  }
}
