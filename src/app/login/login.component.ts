import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { StorageService } from '../storage.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  auth: FormGroup;
  user: any

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
  }

  submit(){
    this.authService.login(this.auth.value.username, this.auth.value.password)
      .subscribe(response => {
        console.log(response);
        
        this.storage.saveToken(response)
        this.router.navigate(['home'])
      }, error => {
        console.log(error);
        
        this.snackBar.open(error.error.non_field_errors, 'Dismiss', {duration: 5000})
      }, )
    
  }


}
