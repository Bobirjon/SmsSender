import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  addWordA3 = [
    'Ucell - предотвращение таких аварий зависит от тебя!', 
    'Ucell - кто-же если не ты…?, ', 
    'Ucell - по отдельности мы одна капля. Вместе мы океан.',
    'Ucell - всегда есть возможность изменить ситуацию',
    'Ucell - успех, это результат скрещивания удачи и тяжёлого труда'
  ]

  addWordA4 = [
    'Ucell - подумай как сделать так, чтобы это больше не повторялось.', 
    'Ucell - просите помощи у коллег своевременно и часто', 
    'Ucell - воображение важнее знаний',
    'Ucell - последние 10% работы перед запуском проекта требуют столько же энергии, как и первые 90%',
    'Ucell - ценить нужно подлинную продуктивность труда, а не показную усталость',
    'Ucell - всё начинается с отличной идеи и командной работы.'
  ]

  addWordA5 = [
    'Ucell - ты сможешь решить данную проблему быстрее.', 
    'Ucell - свзязь, это то, что должно быть всегда и везде.', 
    'Ucell - вспомни историю про проигранную войну, из-за незабитого гвоздя',
  ]
  addWord = ''
  textIndex = 0;

  private isAuthSubject: BehaviorSubject<boolean>;
  private usernameSubject: BehaviorSubject<string | null>

  public isAuth$: Observable<boolean>
  public username$: Observable<string | null>

  private isAuthenticated = false;
  private userNameTest: string = '';

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,) {
      this.isAuthSubject = new BehaviorSubject<boolean>(false)
      this.usernameSubject = new BehaviorSubject<string | null>(null)

      this.isAuth$ = this.isAuthSubject.asObservable()
      this.username$ = this.usernameSubject.asObservable()

      const storedAuth = localStorage.getItem('auth');
      if (storedAuth) {
        const authData = JSON.parse(storedAuth);
        this.isAuthenticated = authData.isAuthenticated;
        this.userNameTest = authData.userName;
      }
  }

  login(name: string) {
    this.isAuthenticated = true;
    this.userNameTest = name;

    // Store authentication data in localStorage
    localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, userName: this.userNameTest }));
  }

  logout() {
    this.isAuthenticated = false;
    this.userNameTest = '';

    // Remove authentication data from localStorage
    localStorage.removeItem('auth');
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }

  // Get the user's name
  getUserName(): string {
    return this.userNameTest;
  }

  public saveToken(token: string): void {
    localStorage.setItem('token', token['auth_token'])
    localStorage.setItem('loggedIn', 'true');
  }

  public deleteToken() {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.setItem('loggedIn', 'false');
    localStorage.removeItem('auth')
  }

  public getToken(): string {
    return localStorage .getItem('token')
  }

  public getNotification(notif: any){
    let notification:any
    switch(notif) {
      case "A2" : {
        notification = ['A2','A3', 'A4', 'A5']
        break;
      }
      case "A3" : {
        notification = ['A3', 'A4', 'A5']
        break;
      }
      case "A4" : {
        notification = ['A4', 'A5']
        break;
      }
      case "A5" : {
        notification = ['A5']
        break;
      }
    }
    return notification
  }

  public isNewForm(isNew: boolean) {
    console.log(isNew);
    
    return isNew  
  }

  public createToTable(data: any) {
    return this.authService.postData(data)
      .subscribe((result) => {
        console.log(result);
        this.snackBar.open('Добавлен в таблицу', '', { duration: 10000 })
        return result
      }, error => {
        console.log(error);
        this.snackBar.open("Ошибка", '', { duration: 10000 })
      })
  }

  public createToTableForSMS(data: any) {
    this.authService.postData(data)
      .subscribe((result) => {
        console.log(result);
        this.snackBar.open('Добавлен в таблицу', '', { duration: 10000 })
      }, error => {
        console.log(error);
        this.snackBar.open("Ошибка", '', { duration: 10000 })
      })
  }

  public updateData(id: any, data: any) {
    this.authService.updateSms(id, data)
    .subscribe((result) => {
      console.log(result);
      this.snackBar.open('Обновлено', '', { duration: 10000 })
    }, error => {
      console.log(error);
      this.snackBar.open('Ошибка при обновлении', '', { duration: 10000 })
    })
  }

  public updateDataForSMS(id: any, data: any) {

  }

  public sendSms(data: any) {
    this.authService.sendSms(data)
          .subscribe(res => {
            console.log(res);
            this.snackBar.open('Сообщения отправлено', '', { duration: 10000 })
            this.router.navigate(['/home'])
          }, error => {
            console.log(error);
            this.snackBar.open("Ошибка при отправлении сообщения", '', { duration: 10000 })
          })
  }

  public additionWord(value: any) {

    this.textIndex = +localStorage.getItem('counter') || 0;

    if(value == 'A3') {
      this.textIndex = (this.textIndex + 1) % this.addWordA3.length
      localStorage.setItem('counter', this.textIndex.toString());
      this.addWord = this.addWordA3[this.textIndex]
    } else if (value == 'A4') {
      this.textIndex = (this.textIndex + 1) % this.addWordA4.length
      localStorage.setItem('counter', this.textIndex.toString());
      this.addWord = this.addWordA4[this.textIndex]
    } else if (value == 'A5') {
      this.textIndex = (this.textIndex + 1) % this.addWordA5.length
      localStorage.setItem('counter', this.textIndex.toString());
      this.addWord = this.addWordA5[this.textIndex]
    } else {
      this.addWord = ''
    }

    return this.addWord
  }

  public SmsType(smsType: string, type: string, period: boolean) {
    let typeOfSms
    if(period == true) {
       if(smsType == 'Проблема' && type == null) {
      typeOfSms = 'Проблема-периодически'
      return typeOfSms
    } else if(smsType == 'Проблема' && type == 'Дополнения') {
      typeOfSms = 'Проблема-периодически-дополнение'
      return typeOfSms
    } else if(smsType == 'Проблема' && type == 'Коррекция') {
      typeOfSms = 'Проблема-периодически-коррекция'
      return typeOfSms
    } else if(smsType == 'Решение' && type == null) {
      typeOfSms = 'Решение-периодически'
      return typeOfSms
    } else if(smsType == 'Решение' && type == 'Дополнения') {
      typeOfSms = 'Решение-периодически-дополнение'
      return typeOfSms
    } else if(smsType == 'Решение' && type == 'Коррекция') {
      typeOfSms = 'Решение-периодически-коррекция'
      return typeOfSms
    }else if(smsType == 'Информационное' && type == null) {
      typeOfSms = 'Информационное-периодически'
      return typeOfSms
    } else if(smsType == 'Информационное' && type == 'Дополнения') {
      typeOfSms = 'Информационное-периодически-дополнение'
      return typeOfSms
    } else if(smsType == 'Информационное' && type == 'Коррекция') {
      typeOfSms = 'Информационное-периодически-коррекция'
      return typeOfSms
    }
    } else {
    if(smsType == 'Проблема' && type == null) {
      typeOfSms = 'Проблема'
      return typeOfSms
    } else if(smsType == 'Проблема' && type == 'Дополнения') {
      typeOfSms = 'Проблема-дополнение'
      return typeOfSms
    } else if(smsType == 'Проблема' && type == 'Коррекция') {
      typeOfSms = 'Проблема-коррекция'
      return typeOfSms
    } else if(smsType == 'Решение' && type == null) {
      typeOfSms = 'Решение'
      return typeOfSms
    } else if(smsType == 'Решение' && type == 'Дополнения') {
      typeOfSms = 'Решение-дополнение'
      return typeOfSms
    } else if(smsType == 'Решение' && type == 'Коррекция') {
      typeOfSms = 'Решение-коррекция'
      return typeOfSms
    }else if(smsType == 'Информационное' && type == null) {
      typeOfSms = 'Информационное'
      return typeOfSms
    } else if(smsType == 'Информационное' && type == 'Дополнения') {
      typeOfSms = 'Информационное-дополнение'
      return typeOfSms
    } else if(smsType == 'Информационное' && type == 'Коррекция') {
      typeOfSms = 'Информационное-коррекция'
      return typeOfSms
    }
  }
  }
  
}