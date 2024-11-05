import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';

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
        <div style="margin-bottom: 1rem;">
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

        <div style="margin-bottom: 1rem;">
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

        <div style="margin-bottom: 1rem;">
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
  editForm: FormGroup;
  userdata: any;
  constructor(
    private authservice: AuthService,
    public dialogRef: MatDialogRef<DialogUpdateContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
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
      console.log(data);

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
    const body = {
      phonenumber: this.editForm.value.phonenumber,
      sitename: this.editForm.value.sitename,
      worktype: this.editForm.value.worktype,
      entertime: this.editForm.value.entertime,
      exittime: this.editForm.value.exittime,
      comment: this.editForm.value.comment,
      info: this.editForm.value.info,
    };
    console.log(this.data.id);
    console.log(typeof this.editForm.value.phonenumber);

    this.authservice
      .updateCommentDoorOpen(this.data.id, body)
      .subscribe(() => {});
  }
}
