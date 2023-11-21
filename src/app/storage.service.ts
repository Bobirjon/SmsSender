import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public isLoggedIn$: BehaviorSubject<boolean>;
  addWordA3 = [
    'Ucell - предотвращение таких аварий зависит от тебя!', 
    'Кто-же если не ты…?, ', 
    'По отдельности мы одна капля. Вместе мы океан.',
    'Всегда есть возможность изменить ситуацию',
    'Успех — это результат скрещивания удачи и тяжёлого труда'
  ]

  addWordA4 = [
    'Подумай как сделать так, чтобы это больше не повторялось.', 
    'Просите помощи у коллег своевременно и часто', 
    'Воображение важнее знаний',
    'Последние 10% работы перед запуском проекта требуют столько же энергии, как и первые 90%',
    'Ценить нужно подлинную продуктивность труда, а не показную усталость',
    'Всё начинается с отличной идеи и командной работы.'
  ]

  addWordA5 = [
    'Ты сможешь решить данную проблему быстрее.', 
    'Свзяь - это то, что должно быть всегда и везде.', 
    'Вспомни историю про проигранную войну, из-за незабитого гвоздя',
  ]
  addWord: any
  textIndex = 0;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,) 
    {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    this.isLoggedIn$ = new BehaviorSubject(isLoggedIn);
  }

  public tokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  public saveToken(token: string): void {
    localStorage.setItem('token', token['auth_token'])
    localStorage.setItem('loggedIn', 'true');
    this.isLoggedIn$.next(true); 
  }

  public deleteToken() {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.setItem('loggedIn', 'false');
    this.isLoggedIn$.next(false);
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
            this.snackBar.open("Ошибка", '', { duration: 10000 })
          })
  }

  public additionWord(value: any) {

    if(value == 'A3') {
      this.textIndex = (this.textIndex + 1) % this.addWordA3.length
      this.addWord = this.addWordA3[this.textIndex]
    } else if (value == 'A4') {
      this.textIndex = (this.textIndex + 1) % this.addWordA4.length
      this.addWord = this.addWordA4[this.textIndex]
    } else if (value == 'A5') {
      this.textIndex = (this.textIndex + 1) % this.addWordA5.length
      this.addWord = this.addWordA5[this.textIndex]
    } else {
      this.addWord = ''
    }

    return this.addWord
  }


}