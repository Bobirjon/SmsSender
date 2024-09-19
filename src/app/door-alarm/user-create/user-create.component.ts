import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit{
  formData = {
    username: '',
    phonenumber: '',
    organization: '',
    position: '',
  };
  constructor(public dialogRef: MatDialogRef<UserCreateComponent>,
    private authService: AuthService
) {}

  ngOnInit(): void {
  }

  onSubmit(formData: any) {
    this.authService.create_user_door_control(formData.value).subscribe((res: any) => {
      console.log(res);
      window.location.reload()
    }, error => {
      if(error.error.phonenumber == "allowed users with this phonenumber already exists.") {
        alert('Пользователь с таким номером телефона уже зарегистрирован')
      }
    })
  }

  

  onCancel() {

  }

}
