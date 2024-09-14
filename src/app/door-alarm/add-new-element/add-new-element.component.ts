import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-add-new-element',
  templateUrl: './add-new-element.component.html',
  styleUrls: ['./add-new-element.component.css'],
})
export class AddNewElementComponent {
  formData = {
    sitename: '',
    worktype: '',
    phonenumber: '',
    comment: '',
    starttime: '',
    exittime: ''
  };
  constructor(public dialogRef: MatDialogRef<AddNewElementComponent>,
              private authService: AuthService
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(formData: any): void {
    this.authService.create_request_door_control(formData.value).subscribe((res: any) => {
      console.log(res);
      window.location.reload()
    }, error => {
      if(error.error.phonenumber == 'User with this phone number does not exist.') {
        alert('Пользователь с таким номером телефона не существует')
      }
    })
    
    
    this.dialogRef.close(formData.value);
  }
}
