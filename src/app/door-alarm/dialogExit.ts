import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-dialog-content',
    template: `
    <h1 mat-dialog-title>Обновить данные</h1>
    <form #dialogForm="ngForm" (ngSubmit)="onSubmit(dialogForm)">
        <div mat-dialog-content>
        <p>Выберите время выхода из сайта:</p>
        <div>
            <input type="datetime-local" [(ngModel)] = "userdata" name="userdata">
        </div>
        </div>
        <div mat-dialog-actions>
            <button mat-button type="button" (click)="onCancel()">Отменить</button>
            <button mat-raised-button type="submit">Сохранить</button>
        </div>
    </form>
  `,
})
export class DialogExitContentComponent {
    userdata: any
    constructor(
        private authservice: AuthService,
        public dialogRef: MatDialogRef<DialogExitContentComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    onCancel(): void {
        console.log('закрыть');
        
        this.dialogRef.close();
    }

    onSubmit(formData: any): void {
        this.userdata = formData.value.userdata
        const body = {
            exittime: this.userdata
        }
        this.authservice.updateExitDoorOpen(this.data, body).subscribe((res: any) => {console.log(res);
        })
    
        this.dialogRef.close(formData.value);
    }
}