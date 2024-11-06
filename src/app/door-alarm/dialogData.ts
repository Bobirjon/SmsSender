import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog-content',
  template: `
    <form
      [formGroup]="editForm"
      (ngSubmit)="onSubmit()"
      style="width: 100%; max-width: 500px; margin: auto;"
    >
      <h1 mat-dialog-title>Обновить данные</h1>
      <div mat-dialog-content>
        <div style="margin-bottom: 1rem;" *ngIf="data.length == 1">
          <label
            for="sitename"
            style="display: block; font-weight: bold; margin-bottom: 0.25rem;"
            >Имя сайта</label
          >
          <input
            id="sitename"
            type="text"
            formControlName="sitename"
            style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 5px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);"
          />
        </div>

        <div style="margin-bottom: 1rem;">
          <label
            for="worktype"
            style="display: block; font-weight: bold; margin-bottom: 0.25rem;"
            >Тип работы</label
          >
          <select
            id="worktype"
            formControlName="worktype"
            style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 5px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);"
          >
            <option value="Установка/заправка генератора">
              Установка/заправка генератора
            </option>
            <option value="BTS Swap">BTS Swap</option>
            <option value="Link swap">Link swap</option>
            <option value="PSU swap">PSU swap</option>
            <option value="Проверка/Испытание сайта">
              Проверка/Испытание сайта
            </option>
            <option value="Монтаж нового обор-я">Монтаж нового обор-я</option>
            <option value="PM">PM</option>
            <option value="Устранение аварий">Устранение аварий</option>
            <option value="Clean Up">Clean Up</option>
            <option value="Демонтаж обор-я">Демонтаж обор-я</option>
            <option value="Установка/замена АКБ">Установка/замена АКБ</option>
            <option value="Прочее">Прочее</option>
          </select>
        </div>

        <div style="margin-bottom: 1rem;">
          <label
            for="phonenumber"
            style="display: block; font-weight: bold; margin-bottom: 0.25rem;"
            >Номер телефона</label
          >
          <input
            id="phonenumber"
            type="text"
            formControlName="phonenumber"
            style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 5px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);"
          />
        </div>

        <div style="margin-bottom: 1rem;" *ngIf="data.length == 1">
          <label
            for="entertime"
            style="display: block; font-weight: bold; margin-bottom: 0.25rem;"
            >Время входа</label
          >
          <input
            id="entertime"
            type="datetime-local"
            formControlName="entertime"
            style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 5px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);"
          />
        </div>

        <div style="margin-bottom: 1rem;" *ngIf="data.length == 1">
          <label
            for="exittime"
            style="display: block; font-weight: bold; margin-bottom: 0.25rem;"
            >Время Выхода</label
          >
          <input
            id="exittime"
            type="datetime-local"
            formControlName="exittime"
            style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 5px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);"
          />
        </div>

        <div style="margin-bottom: 1rem;">
          <label
            for="comment"
            style="display: block; font-weight: bold; margin-bottom: 0.25rem;"
            >Коммент</label
          >
          <input
            id="comment"
            type="text"
            formControlName="comment"
            style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 5px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);"
          />
        </div>

        <div style="margin-bottom: 1rem;">
          <label
            for="info"
            style="display: block; font-weight: bold; margin-bottom: 0.25rem;"
            >Инфо</label
          >
          <select
            id="info"
            formControlName="info"
            style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 5px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);"
          >
            <option [value]="data.info">{{ data.info }}</option>
            <option value="Ложное">Ложное</option>
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
export class DialogUpdateContentComponent {
  body: any;
  editForm: FormGroup;
  userdata: any;
  constructor(
    private authservice: AuthService,
    public dialogRef: MatDialogRef<DialogUpdateContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.editForm = this.formGroup(data);
  }

  formGroup(data: any[]) {
    const formControls: { [key: string]: any } = {};

    const formControlName = [
      'sitename',
      'worktype',
      'phonenumber',
      'entertime',
      'exittime',
      'comment',
      'info',
    ];

    formControlName.forEach((field) => {
      let value = '';

      if (data.length == 1) {
        const entry = data[0];
        if (entry) {
          value =
            field === 'phonenumber' && entry.visitor
              ? entry.visitor.phonenumber
              : entry[field];
        }
      }
      formControls[field] = [value];
    });

    return this.fb.group(formControls);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    const createBody = (item: any) => ({
      phonenumber: this.editForm.value.phonenumber || item.visitor.phonenumber,
      sitename: this.editForm.value.sitename || item.sitename,
      worktype: this.editForm.value.worktype || item.worktype,
      entertime: this.editForm.value.entertime || item.entertime,
      exittime: this.editForm.value.exittime || item.exittime,
      comment: this.editForm.value.comment || item.comment,
      info: this.editForm.value.info || item.info,
    });

    if (this.data.length === 1) {
      this.body = createBody(this.data[0]);
      this.authservice
        .updateCommentDoorOpen(this.data[0].id, this.body)
        .subscribe((res: any) => {
          window.location.reload();
        });
    } else {
      this.data.forEach((item: any) => {
        this.body = createBody(item);
        this.authservice
          .updateCommentDoorOpen(item.id, this.body)
          .subscribe((res: any) => {
            window.location.reload();
          });
      });
    }
  }
}
