import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-user-info-update',
  template: `
    <form
      [formGroup]="editForm"
      (ngSubmit)="onSubmit()"
      style="width: 100%; max-width: 500px; margin: auto;"
    >
      <h1 mat-dialog-title>Обновить данные</h1>
      <div mat-dialog-content>
        <div style="margin-bottom: 1rem;">
          <label
            for="username"
            style="display: block; font-weight: bold; margin-bottom: 0.25rem;"
            >Username</label
          >
          <input
            id="username"
            type="text"
            formControlName="username"
            style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 5px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);"
          />
        </div>

        <div style="margin-bottom: 1rem;">
          <label
            for="phonenumber"
            style="display: block; font-weight: bold; margin-bottom: 0.25rem;"
            >Phone Number</label
          >
          <input
            id="phonenumber"
            type="text"
            formControlName="phonenumber"
            style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 5px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);"
          />
        </div>

        <div style="margin-bottom: 1rem;">
          <label
            for="organization"
            style="display: block; font-weight: bold; margin-bottom: 0.25rem;"
            >Organization</label
          >
          <input
            id="organization"
            type="text"
            formControlName="organization"
            style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 5px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);"
          />
        </div>

        <div style="margin-bottom: 1rem;">
          <label
            for="position"
            style="display: block; font-weight: bold; margin-bottom: 0.25rem;"
            >Position</label
          >
          <input
            id="position"
            type="text"
            formControlName="position"
            style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 5px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);"
          />
        </div>

        <div style="margin-bottom: 1rem;">
          <label
            for="region"
            style="display: block; font-weight: bold; margin-bottom: 0.25rem;"
            >Region</label
          >
          <input
            id="region"
            type="text"
            formControlName="region"
            style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 5px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);"
          />
        </div>

        <div style="margin-bottom: 1rem;">
          <label
            for="is_active"
            style="display: block; font-weight: bold; margin-bottom: 0.25rem;"
            >Is Active</label
          >
          <select
            id="is_active"
            formControlName="is_active"
            style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 5px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);"
          >
            <option value="true">Да</option>
            <option value="false">Нет</option>
          </select>
        </div>
      </div>
      <div mat-dialog-actions>
        <button mat-raised-button type="submit">Сохранить</button>
        <button mat-button type="button" (click)="onCancel()">Отменить</button>
      </div>
    </form>
  `,
})
export class UserInfoUpdateComponent implements OnInit {
  editForm: FormGroup;
  userdata: any;
  constructor(
    public dialogRef: MatDialogRef<UserInfoUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.editForm = this.fb.group({
      username: [data.username],
      phonenumber: [data.phonenumber],
      organization: [data.organization],
      position: [data.position],
      region: [data.region],
      is_active: [data.is_active],
    });
  }
  ngOnInit(): void {
    console.log(this.data);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    const body = {
      username: this.editForm.value.username,
      phonenumber: this.editForm.value.phonenumber,
      organization: this.editForm.value.organization,
      position: this.editForm.value.position,
      region: this.editForm.value.region,
      is_active: this.editForm.value.is_active,
    };

    this.authService
      .putAllowedUsers(this.data.id, body)
      .subscribe((res: any) => {
        console.log(res);
        this.dialogRef.close();
        window.location.reload();
      });
  }
}
