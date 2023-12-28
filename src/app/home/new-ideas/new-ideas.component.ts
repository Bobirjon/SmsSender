import { Component, OnInit } from '@angular/core';
import { DataModel } from './myData.model';
import { Observable, of } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-new-ideas',
  templateUrl: './new-ideas.component.html',
  styleUrls: ['./new-ideas.component.css'],
})

export class NewIdeasComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['priority', 'description', 'status'];

  // Define a FormGroup for the user input
  userInputForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    // Initial data
    const initialData = [
      { priority: 1, description: 'John Doe', status: 'john@example.com' },
      { priority: 2, description: 'Jane Doe', status: 'jane@example.com' },
      { priority: 3, description: 'Bob Smith', status: 'bob@example.com' },
    ];

    // Push initial data to the MatTableDataSource
    this.dataSource.data = initialData;

    // Initialize the user input form
    this.userInputForm = this.formBuilder.group({
      priority: [null, Validators.required],
      description: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  // Function to add new user input data to the MatTable
  addUserInputData() {
    const newData = this.userInputForm.value;

    // Push the new data to the MatTableDataSource
    this.dataSource.data = [...this.dataSource.data, newData];
    // Reset the form
    this.userInputForm.reset();
    // Trigger a refresh of the table
    this.dataSource._updateChangeSubscription();

  }
}
