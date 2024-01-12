import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/auth.service';
import {MatDialog,} from '@angular/material/dialog';
import { EditPageComponent } from './edit-page/edit-page.component';

export interface NewData {
  name: string;
  description: string;
  status: string;
  priority: string
}

@Component({
  selector: 'app-new-ideas',
  templateUrl: './new-ideas.component.html',
  styleUrls: ['./new-ideas.component.css'],
})

export class NewIdeasComponent implements OnInit {

  displayedColumns: string[] = ['name', 'description', 'created_at', 'status', 'priority'];
  dataSource = new MatTableDataSource<NewData>([]);
  newIdeasForm: FormGroup

  constructor( 
    private fb: FormBuilder, 
    private authService: AuthService,
    private dialog: MatDialog) {
    this.createForm()

    this.authService.getNewIdeas().subscribe(
      (res: any) => {
        console.log(res.results);
        this.dataSource = new MatTableDataSource(res.results)
        
      }
    )
  }

  ngOnInit() {
    
  }

  createForm() {
    this.newIdeasForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  addData() {
    if (this.newIdeasForm.valid) {
      let dataBody = {
        'name': this.newIdeasForm.value.name,
        'description': this.newIdeasForm.value.description,
        'status': 'Waiting',
        'priority': 'Low',
      }
      this.authService.postNewIdeas(dataBody).subscribe(
        (res) => {
          window.location.reload()
        }
      )
    }
  }

  onEdit(row: string) {
    const popup = this.dialog.open(EditPageComponent, {
      width: '400px', 
      data: {
        text: row,
        title: 'Изменить'
      }
    });

    popup.afterClosed().subscribe(item => {
      console.log(item);
      
    })
  }
}
