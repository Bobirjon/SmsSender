import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-editPage',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.css']
})
export class EditPageComponent implements OnInit {

  username: string

  editPageForm: FormGroup = this.fb.group({
    name: [this.data.text.name, Validators.required],
    description: [this.data.text.description, Validators.required],
    status: [this.data.text.status, Validators.required],
    priority: [this.data.text.priority, Validators.required]
  })
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private ref: MatDialogRef<EditPageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    this.authService.getUser().subscribe(
      (res: any) => {
        this.username = res.username
      }
    )
  }

  closepopup() {
    this.ref.close('Close using Functon')
  }

  deleteRow(id: number) {
    this.authService.deleteNewIdeas(id).subscribe(res => {
      console.log(res);
      window.location.reload()
    })
  }

  updateRow() {
    let updateDate = {
      'name': this.editPageForm.value.name,
      'description': this.editPageForm.value.description,
      'status': this.editPageForm.value.status,
      'priority': this.editPageForm.value.priority,
    }

    this.authService.updateNewIdeas(this.data.text.id, updateDate).subscribe(
      (res) => {
        window.location.reload()
      }
    )
  }

}
