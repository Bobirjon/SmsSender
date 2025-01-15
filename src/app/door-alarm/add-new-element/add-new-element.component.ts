import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { debounceTime, of, Subject, switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-add-new-element',
  templateUrl: './add-new-element.component.html',
  styleUrls: ['./add-new-element.component.css'],
})
export class AddNewElementComponent implements OnInit {
  username: string = '';
  filteredUsers: any[] = [];
  private usernameSubject = new Subject<string>();
  formData = {
    sitename: '',
    worktype: '',
    username: '',
    phonenumber: '',
    comment: '',
    starttime: '',
    exittime: '',
  };
  constructor(
    public dialogRef: MatDialogRef<AddNewElementComponent>,
    private authService: AuthService,
    private api: HttpClient
  ) {}

  ngOnInit(): void {
    this.usernameSubject
      .pipe(
        debounceTime(300), // Delay for 300ms
        switchMap((value: string) => {
          if (!value.trim()) {
            return of([]); // Return an empty observable if input is empty
          }
          const params = new HttpParams().set('username__icontains', value);
          return this.authService.get_user_data(params);
        })
      )
      .subscribe(
        (users: any) => {
          this.filteredUsers = users.results; // Update filtered users
        },
        (error) => {
          console.error('Error fetching users', error); // Handle errors
        }
      );
  }

  onUsernameChange(value: string): void {
    this.usernameSubject.next(value); // Emit the input value for debouncing
  }

  onUserSelected(event: any): void {
    const selectedUser = this.filteredUsers.find(
      (user) => user.username === event.option.value
    );

    if (selectedUser) {
      console.log(selectedUser);

      this.formData.phonenumber = selectedUser.phonenumber; // Update phone number
      console.log(this.formData.phonenumber);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(formData: any): void {
    this.authService.create_request_door_control(formData.value).subscribe(
      (res: any) => {
        console.log(res);
        window.location.reload();
      },
      (error) => {
        if (
          error.error.phonenumber ==
          'User with this phone number does not exist.'
        ) {
          alert('Пользователь с таким номером телефона не существует');
        }
      }
    );

    this.dialogRef.close(formData.value);
  }
}
