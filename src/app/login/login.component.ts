import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { StorageService } from '../storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  auth: FormGroup;
  loginStatus: any 

  userName: any

  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthService, 
    private storage: StorageService,
    private router: Router,
    private snackBar: MatSnackBar){}

  ngOnInit(): void {
    this.auth = this.formBuilder.group({
      password: '',
      username: ''
    })
  
    this.loginStatus = localStorage.getItem('token')
    console.log(this.loginStatus);
    

  }


  submit(){
    this.authService.login(this.auth.value.username, this.auth.value.password)
      .subscribe(response => {
        this.storage.saveToken(response)
        this.router.navigate(['home'])

        this.authService.getUser().subscribe(res => {
          let name: any
          name = res
          this.userName = name.first_name + ' ' + name.last_name
          this.storage.login(this.userName)
        })
       
      }, error => {
        this.snackBar.open(error.error.non_field_errors, 'Dismiss', {duration: 10000})
      }, )
  }

}
