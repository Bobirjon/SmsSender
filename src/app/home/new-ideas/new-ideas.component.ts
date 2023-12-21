import { Component, OnInit } from '@angular/core';
import { DataModel } from './myData.model';
import { Observable, of } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-ideas',
  templateUrl: './new-ideas.component.html',
  styleUrls: ['./new-ideas.component.css'],
})

export class NewIdeasComponent implements OnInit {
  addForm: FormGroup
  displayedColumns: string[] = ['id', 'description', 'status'];
  dataSource: DataModel[] = [
    {id: 1, description: 'description', status: 'status'}
  ]

  loadData() {
    this.getData().subscribe((data) => {this.dataSource = data; console.log(data);
    })
  }
  
  ngOnInit(): void {
    this.loadData()
  }

  constructor(private fb: FormBuilder) {
    this.addForm = this.fb.group({
      description: ['', Validators.required],
      status: ['', Validators.required]
    })
  }

  addDataButton() {
    if (this.addForm.valid) {
      const newItem: DataModel = {
        id: this.dataSource.length + 1,
        description: this.addForm.value.description,
        status: this.addForm.value.status 
      }

      this.dataSource.push(newItem);
      console.log(this.dataSource);
      
      this.loadData()
      this.addForm.reset()
    }
  }

  updateDataButton(item: DataModel) {
    const index = this.dataSource.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      this.dataSource[index] = item;
    }
    this.loadData()
  }

  deleteButton(id: number) {
    this.dataSource = this.dataSource.filter((item) => item.id !== id);
    this.loadData();  
  }

  getData(): Observable<DataModel[]> {
    console.log(this.dataSource);
    
    return of(this.dataSource);
  }
}
