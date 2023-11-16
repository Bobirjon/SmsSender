import { Dialog } from '@angular/cdk/dialog';
import { NgIf, formatDate } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { WebSocketService } from 'src/web-socket.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, Subject } from 'rxjs';
import { NgFor, AsyncPipe } from '@angular/common';
import { map, startWith } from 'rxjs/operators';
import { StorageService } from 'src/app/storage.service';


@Component({
  selector: 'app-cn',
  templateUrl: './cn.component.html',
  styleUrls: ['./cn.component.css'],
})

export class CnComponent implements OnInit {

  cnForm: FormGroup
  preview = false
  user: any
  newForm: boolean
  criteria_list: any
  criteria: any
  SmsTextBody: any
  time = new Date()
  requestType: any
  tableBody: any
  smsBody: any
  criteriaArray: any
  idAlarmReport: any
  filteredOptionsProblem: Observable<string[]>;
  filteredOptionsReason: Observable<string[]>;
  filteredOptionsEffect: Observable<string[]>;

  level: { value: string; viewValue: string }[] = [
    { value: 'A1', viewValue: 'A1' },
    { value: 'A2', viewValue: 'A2' },
    { value: 'A3', viewValue: 'A3' },
    { value: 'A4', viewValue: 'A4' },
    { value: 'A5', viewValue: 'A5' },
    { value: 'P1', viewValue: 'П1' },
    { value: 'P2', viewValue: 'П2' },
    { value: 'P3', viewValue: 'П3' },
    { value: 'P4', viewValue: 'П4' },
    { value: 'P5', viewValue: 'П5' },
  ];
  categories_report: { value: string; viewValue: string }[] = [
    { value: 'Тех проблема', viewValue: 'Тех проблема' },
    { value: 'ЭС и Клим', viewValue: 'ЭС и Клим' },
    { value: 'Провайдер', viewValue: 'Провайдер' },
    { value: 'ПР', viewValue: 'ПР' },
    { value: 'Выясняется', viewValue: 'Выясняется' },
  ];
  category: { value: string; viewValue: string }[] = [
    { value: 'Core', viewValue: 'Core' },
    { value: 'GPRS', viewValue: 'GPRS' },
    { value: 'Roaming', viewValue: 'Roaming' },
    { value: 'Power', viewValue: 'Power' },
    { value: 'High Temp', viewValue: 'High Temp' },
  ];
  responsible_report: { value: string; viewValue: string }[] = [
    { value: 'Другие ЗО', viewValue: 'Другие ЗО' },
    { value: 'Эксплуатация', viewValue: 'Эксплуатация' },
    { value: 'Выясняется', viewValue: 'Выясняется' },
  ];
  effect_option: { value: string; viewValue: string }[] = [
    { value: 'С влиянием', viewValue: 'С влиянием' },
    { value: 'Без влияния', viewValue: 'Без влияния' }
  ];
  region: { value: string; viewValue: string }[] = [
    { value: 'Андижан', viewValue: 'Андижан' },
    { value: 'Бухара', viewValue: 'Бухара' },
    { value: 'Джизак', viewValue: 'Джизак' },
    { value: 'Фергана', viewValue: 'Фергана' },
    { value: 'Сырдарья', viewValue: 'Сырдарья' },
    { value: 'Кашкадарья', viewValue: 'Кашкадарья' },
    { value: 'Наманган', viewValue: 'Наманган' },
    { value: 'Навои', viewValue: 'Навои' },
    { value: 'Каракалпакстан', viewValue: 'Каракалпакстан' },
    { value: 'Самарканд', viewValue: 'Самарканд' },
    { value: 'г.Ташкент', viewValue: 'г.Ташкент' },
    { value: 'Ташкент.обл', viewValue: 'Ташкент.обл' },
    { value: 'Сурхандарья', viewValue: 'Сурхандарья' },
    { value: 'Хорезм', viewValue: 'Хорезм' },
  ];

  optionsProblem: string[] = [
    'Отсутствие основного электропитания на ',
    'Высокая температура в комнате на',
    'GPRS трафик от',
    'IP MPLS канал',
    'Не работает DIAMETER ',
    'Потеря линк',
    'Периодическая потеря линк',
    'Периодический недоступен',
    'Скачок линка меджу',
    'Резервная плата недоступна',
    'Увеличена'
  ];


  optionsReason: string[] = [
    'Выясняется ',
    'Отключение электропитания со стороны РЭС',
    'В связи с',
    'Из-за автоматического обновления узлов GGC',
    'Плановые работы на ',
    'Проблема на стороне ',
    'В связи с плановыми работами',
    'Обрыв кабеля на участке',
  ];

  optionsEffect: string[] = [
    'Нет эффект на сервис ',
    'Трафик переключился на альтернативные каналы',
    'Нет эффект на услугу роуминга',
    'Сервис 4G не был доступен для абонентов в роуминге',
    'Проподание сервиса на Люкс Контент. Работают только короткие номера 0909, 0720',
  ]



  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router,
    private storageService: StorageService,
    public dialog: MatDialog) {

    // form creation
    this.cnForm = this.formBuilder.group({
      'AddOrCor': [null],
      'level': ['', Validators.required],
      'categories_report': ['', Validators.required],
      'responsible_report': ['', Validators.required],
      'problem': ['', Validators.required],
      'reason': ['', Validators.required],
      'startTime': ['', Validators.required],
      'endTime': [''],
      'region': [''],
      'effect': ['', Validators.required],
      'effect_option': ['', Validators.required],
      'category': ['', Validators.required],
      'informed': ['', Validators.required],
      'desc': [''],
      'sender': ['']
    })

    // option for input fields

    this.filteredOptionsProblem = this.cnForm.controls.problem.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.optionsProblem))
    )

    this.filteredOptionsReason = this.cnForm.controls.reason.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.optionsReason))
    )

    this.filteredOptionsEffect = this.cnForm.controls.effect.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.optionsEffect))
    )
  }

  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLocaleLowerCase()
    return options.filter(option => option.toLocaleLowerCase().includes(filterValue))
  }

  setDefault() {
    if (this.cnForm.value.level == 'P1' || this.cnForm.value.level == 'P2' ||
      this.cnForm.value.level == 'P3' || this.cnForm.value.level == 'P4' || this.cnForm.value.level == 'P5') {
      this.cnForm.value.categories_report = 'ПР'
    }
  }

  tableSendBody() {
    this.tableBody = {
      'type': 'CORE',
      'level': this.cnForm.value.level,
      'category': this.cnForm.value.categories_report,
      'responsible_area': this.cnForm.value.responsible_report,
      'problem': this.cnForm.value.problem,
      'reason': this.cnForm.value.reason,
      'effect': this.cnForm.value.effect_option,
      'start_time': this.cnForm.value.startTime,
      'category_for_core': this.cnForm.value.category,
      'description': this.cnForm.value.desc,
      'informed': this.cnForm.value.informed,
      'influence': this.cnForm.value.effect,
      'sender': this.user?.first_name + ' ' + this.user?.last_name
    }

    if (this.cnForm.value.category == ('Power') || this.cnForm.value.category == ('High Temp')) {
      this.tableBody.region = this.cnForm.value.region
    } else {
      this.tableBody.region = ''
    }
    if (this.cnForm.value.endTime !== '') {
      this.tableBody.end_time = this.cnForm.value.endTime
    }
  }

  smsSendBody(id?: number) {
    if (this.requestType == 'Проблема') {
      if (this.cnForm.value.AddOrCor == (null || undefined)) {
        this.SmsTextBody =
          this.cnForm.value.level.replace('P', 'П') + ' ' + this.requestType + '\n' +
          this.cnForm.value.problem + '\n' +
          'Причина: ' + this.cnForm.value.reason + '\n' +
          'Эффект: ' + this.cnForm.value.effect + '\n' +
          'Оповещен: ' + this.cnForm.value.informed + '\n' +
          'Начало: ' + this.cnForm.value.startTime.replace("T", " ") + '\n' +
          'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name + '\n' 
      } else {
        this.SmsTextBody =
          this.cnForm.value.level.replace('P', 'П') + ' ' + this.requestType + '\n' +
          '(' + this.cnForm.value.AddOrCor + ') ' + '\n' +
          this.cnForm.value.problem + '\n' +
          'Причина: ' + this.cnForm.value.reason + '\n' +
          'Эффект: ' + this.cnForm.value.effect + '\n' +
          'Оповещен: ' + this.cnForm.value.informed + '\n' +
          'Начало: ' + this.cnForm.value.startTime.replace("T", " ") + '\n' +
          'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name + '\n'
      }
    } else {
      if (this.cnForm.value.AddOrCor == (null || undefined)) {
        this.SmsTextBody =
          this.cnForm.value.level.replace('P', 'П') + ' ' + this.requestType + '\n' +
          this.cnForm.value.problem + '\n' +
          'Причина: ' + this.cnForm.value.reason + '\n' +
          'Эффект: ' + this.cnForm.value.effect + '\n' +
          'Описание: ' + this.cnForm.value.desc + '\n' +
          'Оповещен: ' + this.cnForm.value.informed + '\n' +
          'Начало: ' + this.cnForm.value.startTime.replace("T", " ") + '\n' +
          'Конец: ' + this.cnForm.value.endTime.replace("T", " ") + '\n' +
          'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name + '\n' 
      } else {
        this.SmsTextBody =
          this.cnForm.value.level.replace('P', 'П') + ' ' + this.requestType + '\n' +
          '(' + this.cnForm.value.AddOrCor + ') ' + '\n' +
          this.cnForm.value.problem + '\n' +
          'Причина: ' + this.cnForm.value.reason + '\n' +
          'Эффект: ' + this.cnForm.value.effect + '\n' +
          'Описание: ' + this.cnForm.value.desc + '\n' +
          'Оповещен: ' + this.cnForm.value.informed + '\n' +
          'Начало: ' + this.cnForm.value.startTime.replace("T", " ") + '\n' +
          'Конец: ' + this.cnForm.value.endTime.replace("T", " ") + '\n' +
          'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name + '\n'
      }
    }

    this.smsBody = {
      'source_addr': 'ncc-cn',
      'network': ['CN'],
      'criteria': [this.cnForm.value.level.replace('P', 'A')],
      'sms_text': this.SmsTextBody,
      'alarmreport_id': id
    }

    if (this.cnForm.value.category == ('Power') || this.cnForm.value.category == ('High Temp')) {
      this.smsBody.notification = ['Power/HighTemp']
      this.smsBody.region = [this.cnForm.value.region]
    }
    else {
      this.smsBody.notification = [this.cnForm.value.category]
    }
  }

  ngOnInit(): void {

    // get Current user
    this.authService.getUser()
      .subscribe(result => {
        this.user = result
      })
    //is it new request or update mode
    if (this.route.snapshot.params.id == null) {
      this.newForm = true

    } else {
      let isDisabled: any
      let endTimeForUpdate: any
      this.newForm = false

      this.authService.getSms(this.route.snapshot.params.id)
        .subscribe(result => {
          if (result['category_for_core'] == 'Core' || result['category_for_core'] == 'Roaming' || result['category_for_core'] == 'GPRS') {
            isDisabled = true
          } else {
            isDisabled = false
          }
          if (result['end_time'] == null) {
            endTimeForUpdate = (result['end_time'], 'yyyy-MM-ddTHH:mm', '')
          } else {
            endTimeForUpdate = formatDate(result['end_time'], 'yyyy-MM-ddTHH:mm', 'en')
          }
          this.cnForm = this.formBuilder.group({
            'AddOrCor': [null],
            'level': [result['level'], Validators.required],
            'categories_report': [result['category'], Validators.required],
            'responsible_report': [result['responsible_area'], Validators.required],
            'problem': [result['problem'], Validators.required],
            'reason': [result['reason'], Validators.required],
            'effect_option': [result['effect'], Validators.required],
            'startTime': [formatDate(result['start_time'], 'yyyy-MM-ddTHH:mm', 'en'), Validators.required],
            'endTime': [endTimeForUpdate],
            'region': [{ value: result['region'], disabled: isDisabled }, Validators.required],
            'effect': [result['influence']],
            'category': [result['category_for_core']],
            'informed': [result['informed']],
            'desc': [result['description']],
            'sender': [result['sender']]
          })
        })

    }
  }

  updateData() {
    
    this.tableSendBody()

    this.storageService.updateData(this.route.snapshot.params.id, this.tableBody)
    // this.authService.updateSms(this.route.snapshot.params.id, this.tableBody)
    //   .subscribe((result) => {
    //     console.log(result);
    //     this.snackBar.open('Обновлено', '', { duration: 10000 })
    //   }, error => {
    //     console.log(error);
    //     this.snackBar.open('Ошибка при обновлении', '', { duration: 10000 })
    //   })
  }

  sendButton() {
    console.log('Suucess sned', this.smsBody);
    
    // api for send SMS
    this.storageService.sendSms(this.smsBody)

    // this.authService.sendSms(this.smsBody)
    //       .subscribe(res => {
    //         console.log(res);
    //         this.snackBar.open('Сообщения отправлено', '', { duration: 10000 })
    //         this.router.navigate(['/home'])
    //       }, error => {
    //         console.log(error);
    //         this.snackBar.open("Ошибка", '', { duration: 10000 })
    //       })
  }

  onSubmit() {
    this.tableSendBody()

    this.storageService.createToTable(this.tableBody)
    
    // this.authService.postData(this.tableBody)
    //   .subscribe((result) => {
    //     console.log(result);
    //     this.snackBar.open('Добавлен в таблицу', '', { duration: 10000 })
    //   }, error => {
    //     console.log(error);
    //     this.snackBar.open("Ошибка", '', { duration: 10000 })
    //   })

    
  }

  onSubmitButtonProblem(smsType: string) {
    this.requestType = smsType

    const dialogRef = this.dialog.open(areYouSure);

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        if (this.newForm == false) {
          this.tableSendBody()

          this.authService.updateSms(this.route.snapshot.params.id, this.tableBody)
            .subscribe((result) => {
              console.log(result);
              this.idAlarmReport = result
              console.log(this.idAlarmReport.id);
              
              this.snackBar.open('Обновлено', '', { duration: 10000 })
              this.smsSendBody(this.idAlarmReport.id)
              this.sendButton()
              console.log('ok workung id is', this.idAlarmReport.id);
              
            }, error => {
              console.log(error);
              this.snackBar.open('Ошибка при обновлении', '', { duration: 10000 })
            })
          

        } else {
          this.tableSendBody()

          this.authService.postData(this.tableBody)
            .subscribe((result) => {
              console.log(result);
              this.snackBar.open('Добавлен в таблицу', '', { duration: 10000 })
              this.smsSendBody(result.id)
              this.sendButton()
              console.log('ok workung id is', result.id)
            }, error => {
              console.log(error);
              this.snackBar.open("Ошибка", '', { duration: 10000 })
            })
        }
      }
    })

  }

  forTestSms(smsType: string) {
    this.requestType = smsType
    this.smsSendBody()
    
    const dialogRef = this.dialog.open(fortesting, {
      data: { text: this.SmsTextBody}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        // this.smsSendBody()
        // console.log(this.smsBody);
        
        // this.sendButton()
      }
    })
  }

}

@Component({
  selector: 'areYouSure',
  templateUrl: 'areYouSure.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class areYouSure { }


@Component({
  selector: 'fortesting',
  templateUrl: 'fortesting.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule],
})
export class fortesting {
  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<fortesting>,
    @Inject(MAT_DIALOG_DATA) public smsbody: any,
  ) { }

  onSubmit(form: NgForm) {
    let tel_list = form.value.field.split('\n')
    console.log(this.smsbody);

    let smsTXTBody = {
      'source_addr': 'ncc-cn',
      'sms_text': this.smsbody.text,
      'tel_number_list': tel_list,
    }

    this.authService.sendTestSMS(smsTXTBody)
      .subscribe(res => {
        console.log(res);
      })
  }
}
