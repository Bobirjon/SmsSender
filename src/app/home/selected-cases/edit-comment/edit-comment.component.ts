import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-comment',
  templateUrl: './edit-comment.component.html',
})
export class EditCommentComponent {
  constructor(
    public dialogRef: MatDialogRef<EditCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number; comment: string }
  ) {}


  onNoClick(): void {
    this.dialogRef.close(); // Close the dialog without making changes
  }

  onSave(): void {
    this.dialogRef.close({ comment: this.data.comment }); // Save and close
  }

}
