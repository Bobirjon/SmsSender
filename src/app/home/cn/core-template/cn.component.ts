import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { StorageService } from 'src/app/storage.service';

@Component({
  selector: 'app-cn',
  templateUrl: './cn.component.html',
  styleUrls: ['./cn.component.css'],
})


export class CnComponent implements OnInit {

  cnForm: FormGroup
  user: any
  newForm: boolean
  optionRegion : string = ''
  SmsTextBody: any
  time = new Date()
  requestType: any
  asNew: boolean = false
  tableBody: any
  smsBody: any
  filteredOptionsProblem: Observable<string[]>;
  filteredOptionsReason: Observable<string[]>;
  filteredOptionsEffect: Observable<string[]>;
  filteredOptionsDesc: Observable<string[]>;

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
    { value: 'Core-NetAct', viewValue: 'Core-NetAct' },
    { value: 'GPRS', viewValue: 'GPRS' },
    { value: 'Roaming', viewValue: 'Roaming' },
    { value: 'MPLS', viewValue: 'MPLS' },
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
  periodicity: { value: string; viewValue: string }[] = [
    { value: '', viewValue: 'Оставить пустым' },
    { value: 'периодически', viewValue: 'Периодически' },
    { value: 'периодически и частично', viewValue: 'Периодически и частично' }
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
    'Нет эффекта на сервис ',
    'Нет эффекта на сервис, Core site работает на ДГ, остаток ДТ на',
    'Трафик переключился на альтернативные каналы',
    'Нет эффект на услугу роуминга',
    'Сервис 4G не был доступен для абонентов в роуминге',
    'Проподание сервиса на Люкс Контент. Работают только короткие номера 0909, 0720',
    
  ]

  optionsDesc: string[] = [
    'Линк автоматически поднялся ',
    'Трафик автоматически восстановлен',
    'Включили основное питание',
    'Работа частично завершена',
  ]
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
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
      'endTime': ['', this.endTimeValidation],
      'region': [''],
      'effect': ['', Validators.required],
      'effect_option': ['', Validators.required],
      'category': ['', Validators.required],
      'informed': ['', Validators.required],
      'desc': [''],
      'sender': [''],
      'periodicity': ['']
    })

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

    this.filteredOptionsDesc = this.cnForm.controls.desc.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.optionsDesc))
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

  endTimeValidation(control: any) {
    let endTime = new Date(control.value)
    const formGroup = control?.parent;
    if(formGroup) {
      const startTime = formGroup.get('startTime')
      const startTimeSelected = new Date(startTime.value)
      const difference = endTime.getTime() - startTimeSelected.getTime()
      if(difference < 0) {

        return { timeValid: true}
      } else {
        return null
      }
    }
    return null
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
    } else {
      this.tableBody.end_time = null
    }
  }

  smsSendBody(id?: number) {

    let addWord = this.storageService.additionWord(this.cnForm.value.level)

    this.SmsTextBody = 
    `${this.cnForm.value.level.replace('P', 'П')+ ' ' + this.requestType}\n` +
    `${(this.cnForm.value.AddOrCor != null || this.cnForm.value.AddOrCor != undefined) ? '(' + this.cnForm.value.AddOrCor + ')\n' : ''}` +
    `${this.cnForm.value.problem}\n` +
    `${'Причина: ' + this.cnForm.value.reason}\n` +
    `${'Эффект: ' + this.cnForm.value.effect}\n` +
    `${this.requestType !== 'Проблема' ?  'Описание: ' + this.cnForm.value.desc+'\n': ''}` +
    `${'Оповещен: ' + this.cnForm.value.informed }\n` +
    `${'Начало: ' + this.cnForm.value.startTime.replace("T", " ")}\n`+
    `${this.requestType !== 'Проблема' ?  'Конец: ' + this.cnForm.value.endTime.replace("T", " ") + '\n': ''}` +
    `${'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name}\n` +
    `${addWord}`
    
    console.log(this.SmsTextBody);
    

    // if (this.requestType == 'Проблема') {
    //   if (this.cnForm.value.AddOrCor == (null || undefined)) {
    //     this.SmsTextBody =
    //       this.cnForm.value.level.replace('P', 'П') + ' ' + this.requestType + '\n' +
    //       this.cnForm.value.problem + '\n' +
    //       'Причина: ' + this.cnForm.value.reason + '\n' +
    //       'Эффект: ' + this.cnForm.value.effect + '\n' +
    //       'Оповещен: ' + this.cnForm.value.informed + '\n' +
    //       'Начало: ' + this.cnForm.value.startTime.replace("T", " ") + '\n' +
    //       'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name + '\n' +
    //       addWord
    //   } else {
    //     this.SmsTextBody =
    //       this.cnForm.value.level.replace('P', 'П') + ' ' + this.requestType + '\n' +
    //       '(' + this.cnForm.value.AddOrCor + ') ' + '\n' +
    //       this.cnForm.value.problem + '\n' +
    //       'Причина: ' + this.cnForm.value.reason + '\n' +
    //       'Эффект: ' + this.cnForm.value.effect + '\n' +
    //       'Оповещен: ' + this.cnForm.value.informed + '\n' +
    //       'Начало: ' + this.cnForm.value.startTime.replace("T", " ") + '\n' +
    //       'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name + '\n' +
    //       addWord
    //   }
    // } else {
    //   if (this.cnForm.value.AddOrCor == (null || undefined)) {
    //     this.SmsTextBody =
    //       this.cnForm.value.level.replace('P', 'П') + ' ' + this.requestType + '\n' +
    //       this.cnForm.value.problem + '\n' +
    //       'Причина: ' + this.cnForm.value.reason + '\n' +
    //       'Эффект: ' + this.cnForm.value.effect + '\n' +
    //       'Описание: ' + this.cnForm.value.desc + '\n' +
    //       'Оповещен: ' + this.cnForm.value.informed + '\n' +
    //       'Начало: ' + this.cnForm.value.startTime.replace("T", " ") + '\n' +
    //       'Конец: ' + this.cnForm.value.endTime.replace("T", " ") + '\n' +
    //       'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name + '\n' +
    //       addWord
    //   } else {
    //     this.SmsTextBody =
    //       this.cnForm.value.level.replace('P', 'П') + ' ' + this.requestType + '\n' +
    //       '(' + this.cnForm.value.AddOrCor + ') ' + '\n' +
    //       this.cnForm.value.problem + '\n' +
    //       'Причина: ' + this.cnForm.value.reason + '\n' +
    //       'Эффект: ' + this.cnForm.value.effect + '\n' +
    //       'Описание: ' + this.cnForm.value.desc + '\n' +
    //       'Оповещен: ' + this.cnForm.value.informed + '\n' +
    //       'Начало: ' + this.cnForm.value.startTime.replace("T", " ") + '\n' +
    //       'Конец: ' + this.cnForm.value.endTime.replace("T", " ") + '\n' +
    //       'Отправил: ' + this.user?.first_name + ' ' + this.user?.last_name + '\n' +
    //       addWord
    //   }
    // }

    let smsType = this.cnForm.value.periodicity == '' ? 
      this.storageService.SmsType(this.requestType, this.cnForm.value.AddOrCor, false) : 
      this.storageService.SmsType(this.requestType, this.cnForm.value.AddOrCor, true)

    // let smsType
    // if (this.cnForm.value.periodicity == '') {
    //   smsType = this.storageService.SmsType(this.requestType, this.cnForm.value.AddOrCor, false)
    // } else {
    //   smsType = this.storageService.SmsType(this.requestType, this.cnForm.value.AddOrCor, true)
    // }


    this.smsBody = {
      'source_addr': 'ncc-cn',
      'network': ['CN'],
      'criteria': [this.cnForm.value.level.replace('P', 'A')],
      'sms_text': this.SmsTextBody,
      'alarmreport_id': id,
      'sms_type': smsType
    }

    if (this.cnForm.value.category == ('Power') || this.cnForm.value.category == ('High Temp')) {
      this.smsBody.notification = ['Power/HighTemp']
      this.smsBody.region = [this.cnForm.value.region]

    } else if (this.cnForm.value.category == ('MPLS') || this.cnForm.value.category == ('Core-NetAct')) {
      this.smsBody.notification = ['Core']
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
    
      let endTimeForUpdate: any
      this.newForm = false
      
      if(this.route.snapshot.url.toString().includes('update')) {
        this.asNew = true
      }

      // this.regionDisabled()
      
      this.authService.getSms(this.route.snapshot.params.id)
        .subscribe(result => {
          console.log( formatDate(result['end_time'], 'yyyy-MM-ddTHH:mm', 'en'));
          console.log(result['end_time']);
          
          if (result['end_time'] == null || this.asNew == true) {
            endTimeForUpdate = ''
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
            'endTime': [endTimeForUpdate, this.endTimeValidation],
            'region': [result['region'], Validators.required],
            'effect': [result['influence']],
            'periodicity' : [result['flapping_type']],
            'category': [result['category_for_core']],
            'informed': [result['informed']],
            'desc': [result['description']],
            'sender': [result['sender']]
          })

          if(result['category_for_core'] == 'Core' ||
             result['category_for_core'] == 'GPRS' ||
             result['category_for_core'] == 'Roaming' ||
             result['category_for_core'] == 'MPLS' ||
             result['category_for_core'] == 'Core-NetAct') {
            this.cnForm.get('region').disable()
          } else {
            this.cnForm.get('region').enable()
          }
        })
    }
  }

  updateData() {
    this.tableSendBody()

    this.storageService.updateData(this.route.snapshot.params.id, this.tableBody)
  }

  sendButton() {
    // api for send SMS
    this.storageService.sendSms(this.smsBody)
  }

  regionDisabled() {
    const cases = ['Power', 'High Temp']

    if(cases.includes(this.cnForm.value.category)) {
      this.cnForm.get('region').enable()
    } else {
      this.cnForm.get('region').disable()
    }
  }

  onSelectRegion() {
    this.optionsProblem.unshift('Отсутствие основного электропитания на' +this.cnForm.value.region +' Core Site ')
    this.cnForm.get('problem').setValue('')
  }

  onSubmit() {
    this.tableSendBody()

    this.storageService.createToTable(this.tableBody)

  }

  onSubmitButtonProblem(smsType: string) {
    this.requestType = smsType

  
    const dialogRef = this.dialog.open(areYouSure);
    
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        if (this.newForm == false && this.asNew == false) {
          this.tableSendBody()

          this.authService.updateSms(this.route.snapshot.params.id, this.tableBody)
            .subscribe((result: any) => {

              this.snackBar.open('Обновлено', '', { duration: 10000 })
              this.smsSendBody(result.id)
              this.sendButton()
            }, error => {
              console.log(error);
              this.snackBar.open('Ошибка при обновлении', '', { duration: 10000 })
            })


        } else {
          this.tableSendBody()

          this.authService.postData(this.tableBody)
            .subscribe((result) => {
              this.snackBar.open('Добавлен в таблицу', '', { duration: 10000 })
              this.smsSendBody(result.id)
              this.sendButton()
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
      data: { text: this.SmsTextBody }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
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
