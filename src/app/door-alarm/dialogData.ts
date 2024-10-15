import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-dialog-content',
    template: `
    <h1 mat-dialog-title>Обновить данные</h1>
    <form #dialogForm="ngForm" (ngSubmit)="onSubmit(dialogForm)">
        <div mat-dialog-content>
        <p>Сайта:</p>
        <div>
            <input [(ngModel)] = "userdata" name="userdata">
        </div>
        </div>
        <div mat-dialog-actions>
            <button mat-raised-button type="button" (click)="onCancel()">Отменить</button>
            <button mat-raised-button type="submit">Сохранить</button>
        </div>
    </form>
  `,
})
export class DialogUpdateContentComponent {
    userdata: any
    constructor(
        private authservice: AuthService,
        public dialogRef: MatDialogRef<DialogUpdateContentComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    onCancel(): void {
        this.dialogRef.close();
    }
 
    onSubmit(formData: any): void {
        this.userdata = formData.value.userdata
        console.log(this.data['columnName']);
        
        const body = {
            [this.data['columnName']]: this.userdata
        }
        this.authservice.updateCommentDoorOpen(this.data, body).subscribe(() => {})
        
        this.dialogRef.close(formData.value);
    }
}